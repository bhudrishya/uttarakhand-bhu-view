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
    const { act, district_code, tehsil_code, kcn, vcc } = await req.json();
    
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
