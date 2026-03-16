import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Update password for admin account
    const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(
      "9d6e901b-0c2f-42c6-bbd0-857bfdbe075b",
      { password: "Arnobgetsmadheadfromrt" }
    );

    if (pwError) {
      return new Response(JSON.stringify({ error: pwError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Delete old admin accounts from auth
    const oldIds = [
      "7401d580-9385-42b1-a260-fb6980d178c3",
      "7b566c89-ca2e-4ff1-8e6b-61401279b05e",
    ];
    for (const id of oldIds) {
      await supabaseAdmin.auth.admin.deleteUser(id);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
