import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { domain } = await req.json();
    if (!domain) {
      return new Response(JSON.stringify({ age_days: null }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Try RDAP lookup first (ICANN standard, no API key needed)
    try {
      const rdapRes = await fetch(`https://rdap.org/domain/${domain}`, {
        headers: { Accept: "application/rdap+json" },
        signal: AbortSignal.timeout(5000),
      });

      if (rdapRes.ok) {
        const rdapData = await rdapRes.json();
        // Look for registration event
        const regEvent = rdapData.events?.find((e: any) => e.eventAction === "registration");
        if (regEvent?.eventDate) {
          const regDate = new Date(regEvent.eventDate);
          const ageDays = Math.floor((Date.now() - regDate.getTime()) / (1000 * 60 * 60 * 24));
          return new Response(JSON.stringify({ age_days: ageDays }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
      }
    } catch {
      // RDAP failed, fall through
    }

    // If RDAP didn't work, return null (unknown)
    return new Response(JSON.stringify({ age_days: null }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ age_days: null }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
