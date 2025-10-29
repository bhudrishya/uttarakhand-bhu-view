import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // GET /scalar?plotno=XXXX[&levels=061,00306,045452,]
    if (req.method === 'GET' && pathname.endsWith('/scalar')) {
      const plotno = url.searchParams.get('plotno');
      const tehsil_code = url.searchParams.get('tehsil_code');
      const village_code = url.searchParams.get('village_code');
      const levels = url.searchParams.get('levels') ?? '061,00306,045452,';

      if (!plotno || plotno === 'undefined') {
        return new Response(JSON.stringify({ error: 'Missing required query param: plotno' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const target = new URL('https://bhunaksha.uk.gov.in/ScalarDatahandler');
      target.searchParams.set('OP', '5');
      target.searchParams.set('state', '05');
      target.searchParams.set('levels', levels+"%2C"+tehsil_code+"%2C"+village_code);
      target.searchParams.set('plotno', plotno);

      const resp = await fetch(target.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json,text/plain,*/*',
          // Upstream may inspect Referer; send a plausible value
          'Referer': 'https://bhunaksha.uk.gov.in/',
        },
      });

      const text = await resp.text();
      // Try to pass through JSON if possible; otherwise return text
      try {
        const json = JSON.parse(text);
        return new Response(JSON.stringify(json), {
          status: resp.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (_) {
        return new Response(text, {
          status: resp.status,
          headers: { ...corsHeaders, 'Content-Type': resp.headers.get('content-type') ?? 'application/json' },
        });
      }
    }

    // For non-GET requests, try to parse JSON body; otherwise use empty object
    let parsed: any = {};
    if (req.method !== 'GET') {
      try {
        parsed = await req.json();
      } catch (_) {
        parsed = {};
      }
    }

    const { act, district_code, tehsil_code, kcn, vcc, khata_number, village_code, pargana_code, fasli_code } = parsed;
    
    // Handle property details report request
    if (act === 'getReport') {
      const reportBody = `khata_number=${khata_number}&district_code=${district_code}&tehsil_code=${tehsil_code}&village_code=${village_code}&pargana_code=${pargana_code}&fasli_code=${fasli_code}`;
      
      const response = await fetch('https://bhulekh.uk.gov.in/public/public_ror/public_ror_report.jsp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': 'https://bhulekh.uk.gov.in/public/public_ror/Public_ROR.jsp'
        },
        body: reportBody
      });

      const html = await response.text();

      return new Response(JSON.stringify({ html }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Handle other API requests
    let body = `act=${act}`;
    if (district_code) body += `&district_code=${district_code}`;
    if (tehsil_code) body += `&tehsil_code=${tehsil_code}`;
    if (kcn) body += `&kcn=${kcn}`;
    if (vcc) body += `&vcc=${vcc}`;
    
    // Add fasli parameters for khasra search
    if (act === 'sbksn') {
      body += '&fasli-code-value=999&fasli-name-value=%E0%A4%B5%E0%A4%B0%E0%A5%8D%E0%A4%A4%E0%A4%AE%E0%A4%BE%E0%A4%A8+%E0%A4%AB%E0%A4%B8%E0%A4%B2%E0%A5%80';
    }

    const response = await fetch('https://bhulekh.uk.gov.in/public/public_ror/action/public_action.jsp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://bhulekh.uk.gov.in/public/public_ror/Public_ROR.jsp'
      },
      body: body
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in bhulekh-proxy function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
