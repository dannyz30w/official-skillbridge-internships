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
    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ age_days: null }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Extract domain from email
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) {
      return new Response(JSON.stringify({ age_days: null }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // List of trusted domains that are automatically allowed (no age check needed)
    const trustedDomains = [
      "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "outlook.com", "hotmail.com",
      "live.com", "msn.com", "icloud.com", "me.com", "mac.com", "aol.com", "protonmail.com",
      "proton.me", "mail.com", "zoho.com", "yandex.com", "gmx.com", "gmx.net", "fastmail.com",
      "tutanota.com", "hey.com", "pm.me", "comcast.net", "verizon.net", "att.net", "sbcglobal.net",
      "cox.net", "charter.net", "bellsouth.net", "earthlink.net", "aim.com"
    ];

    // Check if domain is in trusted list or is an .edu domain
    if (trustedDomains.includes(domain) || domain.endsWith(".edu")) {
      return new Response(JSON.stringify({ age_days: 30 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Try RDAP lookup to get domain registration age
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

    // If RDAP didn't work, return null (unknown age, allow signup)
    return new Response(JSON.stringify({ age_days: null }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error in check-email-age function:", error);
    return new Response(JSON.stringify({ age_days: null }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
