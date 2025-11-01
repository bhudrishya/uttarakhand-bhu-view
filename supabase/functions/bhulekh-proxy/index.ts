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
    const url = new URL(req.url);
    const pathname = url.pathname;

    // --- 🔹 Add Static Lat/Lon Map ---
    const staticLocations: Record<string, { lat: number; lon: number }> = {
      // key = `${tehsil_code}-${village_code}`
      "00306-045452": { lat: 30.201218837594354, lon: 78.81496301182275 }, // Example (Rishikesh)
      "00307-045453": { lat: 30.325, lon: 78.045 }, // Example (Dehradun)
      "00201-032120": { lat: 29.946, lon: 78.160 }, // Example (Haridwar)
      // ➕ Add more mappings as needed
    };

    // --- /scalar route ---
    if (req.method === "GET" && pathname.endsWith("/scalar")) {
      const plotno = url.searchParams.get("plotno");
      const tehsil_code = url.searchParams.get("tehsil_code") || "00306";
      const village_code = url.searchParams.get("village_code") || "045452";
      const levels = url.searchParams.get("levels") ?? "061";

      if (!plotno) {
        return new Response(JSON.stringify({ error: "Missing required query param: plotno" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Build the upstream Bhunaksha URL
      const fullLevels = `${levels},${tehsil_code},${village_code}`;
      const target = new URL("https://bhunaksha.uk.gov.in/ScalarDatahandler");
      target.searchParams.set("OP", "5");
      target.searchParams.set("state", "05");
      target.searchParams.set("levels", fullLevels);
      target.searchParams.set("plotno", plotno);

      const resp = await fetch(target.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json,text/plain,*/*",
          "User-Agent": "Mozilla/5.0",
          Referer: "https://bhunaksha.uk.gov.in/",
        },
      });

      const text = await resp.text();

      let json: any;
      try {
        json = JSON.parse(text);
      } catch {
        return new Response(
          JSON.stringify({ error: "Invalid response from Bhunaksha", raw: text }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // 🔹 Inject static lat/lon based on tehsil + village
      const key = `${tehsil_code}-${village_code}`;
      if (staticLocations[key]) {
        json.static_lat = staticLocations[key].lat;
        json.static_lon = staticLocations[key].lon;
      } else {
        // Default fallback (Dehradun center)
        json.static_lat = 30.325564;
        json.static_lon = 78.043681;
      }

      return new Response(JSON.stringify(json), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Handle POST for getReport ---
    if (req.method === "POST") {
      const parsed = await req.json().catch(() => ({}));
      const { act, district_code, tehsil_code, khata_number, village_code, pargana_code, fasli_code } = parsed;

      if (act === "getReport") {
        const reportBody = `khata_number=${khata_number}&district_code=${district_code}&tehsil_code=${tehsil_code}&village_code=${village_code}&pargana_code=${pargana_code}&fasli_code=${fasli_code}`;
        const response = await fetch("https://bhulekh.uk.gov.in/public/public_ror/public_ror_report.jsp", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Referer: "https://bhulekh.uk.gov.in/public/public_ror/Public_ROR.jsp",
          },
          body: reportBody,
        });
        const html = await response.text();
        return new Response(JSON.stringify({ html }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Default
    return new Response(JSON.stringify({ message: "OK" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in bhulekh-proxy function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
