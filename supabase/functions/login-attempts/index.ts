// Server-side lockout management. Anonymous-callable (verify_jwt=false default)
// because users aren't authenticated when trying to sign in. Uses service role
// so the login_attempts table can stay locked down from client roles.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const LOCKOUT_SCHEDULE: Record<number, number> = {
  3: 60, 4: 180, 5: 600, 6: 1800, 7: 3600, 8: 10800, 9: 36000,
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function validEmail(v: unknown): v is string {
  return typeof v === "string" && v.length > 3 && v.length < 255 && /.+@.+\..+/.test(v);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return json({ error: "Invalid body" }, 400);
    const action = (body as any).action;
    const emailRaw = (body as any).email;
    if (!validEmail(emailRaw)) return json({ error: "Invalid email" }, 400);
    const email = emailRaw.toLowerCase().trim();

    if (action === "check") {
      const { data } = await supabase.from("login_attempts").select("locked_until").eq("email", email).maybeSingle();
      const lockedUntil = data?.locked_until ? new Date(data.locked_until).getTime() : null;
      const locked = !!(lockedUntil && lockedUntil > Date.now());
      return json({ locked, lockedUntil });
    }

    if (action === "record_failure") {
      const { data } = await supabase.from("login_attempts").select("failed_count").eq("email", email).maybeSingle();
      const count = (data?.failed_count || 0) + 1;
      const lockoutSecs = count >= 10 ? 86400 : LOCKOUT_SCHEDULE[count];
      const lockedUntil = lockoutSecs ? new Date(Date.now() + lockoutSecs * 1000).toISOString() : null;
      if (data) {
        await supabase.from("login_attempts").update({ failed_count: count, locked_until: lockedUntil, last_attempt: new Date().toISOString() }).eq("email", email);
      } else {
        await supabase.from("login_attempts").insert({ email, failed_count: count, locked_until: lockedUntil });
      }
      return json({ count, lockedUntil });
    }

    if (action === "clear") {
      await supabase.from("login_attempts").update({ failed_count: 0, locked_until: null }).eq("email", email);
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error("login-attempts error", e);
    return json({ error: "Internal error" }, 500);
  }
});
