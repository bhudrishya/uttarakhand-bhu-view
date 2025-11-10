import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { locationMapping } from "./locationMapping.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // ----------------------------
    // GET /scalar
    // ----------------------------
    if (req.method === "GET" && pathname.endsWith("/scalar")) {
      const plotno = url.searchParams.get("plotno");
      const tehsil_code = url.searchParams.get("tehsil_code");
      const village_code = url.searchParams.get("village_code");
      const levels = url.searchParams.get("levels") ?? "061";

      if (!plotno || plotno === "undefined") {
        return new Response(
          JSON.stringify({ error: "Missing required query param: plotno" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const fullLevels = `${levels},${tehsil_code || "00306"},${village_code || "045452"}`;

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

      try {
        const json = JSON.parse(text);
        const key = `${tehsil_code}-${village_code}`;
        const staticLoc = locationMapping[key] || {
          lat: 30.325564,
          lon: 78.043681,
        };

        json.static_lat = staticLoc.lat;
        json.static_lon = staticLoc.lon;

        return new Response(JSON.stringify(json), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        return new Response(
          JSON.stringify({ error: "Invalid response from upstream", raw: text }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    // ----------------------------
    // Non-GET request body
    // ----------------------------
    let parsed: any = {};
    if (req.method !== "GET") {
      try {
        parsed = await req.json();
      } catch {
        parsed = {};
      }
    }

    const {
      act,
      district_code,
      tehsil_code,
      kcn,
      vcc,
      khata_number,
      village_code,
      pargana_code,
      fasli_code,
    } = parsed;

    // ----------------------------
    // getReport
    // ----------------------------
    if (act === "getReport") {
      const reportBody =
        `khata_number=${khata_number}&district_code=${district_code}` +
        `&tehsil_code=${tehsil_code}&village_code=${village_code}` +
        `&pargana_code=${pargana_code}&fasli_code=${fasli_code}`;

      const response = await fetch(
        "https://bhulekh.uk.gov.in/public/public_ror/public_ror_report.jsp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Referer: "https://bhulekh.uk.gov.in/public/public_ror/Public_ROR.jsp",
          },
          body: reportBody,
        },
      );

      const html = await response.text();

      return new Response(JSON.stringify({ html }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ----------------------------
    // sbksn & others
    // ----------------------------
    let body = "";
    if (act === "sbksn") {
      body =
        `kcn=${kcn}&act=${act}&vcc=${vcc}` +
        `&fasli-code-value=999&fasli-name-value=%E0%A4%B5%E0%A4%B0%E0%A5%8D%E0%A4%A4%E0%A4%AE%E0%A4%BE%E0%A4%A8+%E0%A4%AB%E0%A4%B8%E0%A4%B2%E0%A5%80`;
    } else {
      body = `act=${act}`;
      if (district_code) body += `&district_code=${district_code}`;
      if (tehsil_code) body += `&tehsil_code=${tehsil_code}`;
      if (kcn) body += `&kcn=${kcn}`;
      if (vcc) body += `&vcc=${vcc}`;
    }

    // ----------------------------
    // fillDistrict (static)
    // ----------------------------
    if (act === "fillDistrict") {
      const data = [
        { district_name: "अल्‍मोडा", district_code_census: "064", district_name_english: "Almora" },
        { district_name: "उत्तरकाशी", district_code_census: "056", district_name_english: "Uttarkashi" },
        { district_name: "ऊधम सिह नगर", district_code_census: "067", district_name_english: "Udham Singh Nagar" },
        { district_name: "चमोली", district_code_census: "057", district_name_english: "Chamoli" },
        { district_name: "चम्पावत", district_code_census: "065", district_name_english: "Champawat" },
        { district_name: "टिहरी गढ़वाल", district_code_census: "059", district_name_english: "Tehri Garhwal" },
        { district_name: "देहरादून", district_code_census: "060", district_name_english: "Dehradun" },
        { district_name: "नैनीताल", district_code_census: "066", district_name_english: "Nainital" },
        { district_name: "पिथौरागढ़", district_code_census: "062", district_name_english: "Pithoragarh" },
        { district_name: "पौड़ी", district_code_census: "061", district_name_english: "Pauri Garhwal" },
        { district_name: "बागेश्वर", district_code_census: "063", district_name_english: "Bageshwar" },
        { district_name: "रूद्रप्रयाग", district_code_census: "058", district_name_english: "Rudraprayag" },
        { district_name: "हरिद्वार", district_code_census: "068", district_name_english: "Hardwar" },
      ];
      data.sort((a, b) =>
        a.district_name_english.localeCompare(b.district_name_english, "en", { sensitivity: "base" })
      );

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ----------------------------
    // Upstream API call
    // ----------------------------
    const response = await fetch(
      "https://bhulekh.uk.gov.in/public/public_ror/action/public_action.jsp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: "https://bhulekh.uk.gov.in/public/public_ror/Public_ROR.jsp",
          Origin: "https://bhulekh.uk.gov.in",
          "User-Agent": "Mozilla/5.0",
        },
        body,
      },
    );

    const data = await response.json();

    if (act === "fillTehsil") {
      data.sort((a: any, b: any) =>
        a.tehsil_name_english.localeCompare(b.tehsil_name_english, "en", { sensitivity: "base" })
      );
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (act === "fillVillage") {
      data.sort((a: any, b: any) =>
        a.vname_eng.localeCompare(b.vname_eng, "en", { sensitivity: "base" })
      );

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

// Cloud Run requires listening on $PORT
const port = parseInt(Deno.env.get("PORT") ?? "8080");
serve(handler, { port });
