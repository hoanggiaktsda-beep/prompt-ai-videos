// HOANGGIA AI — Creative Intelligence API
// Vercel serverless function. Set OPENAI_API_KEY in the deployment environment.
// The browser never receives the secret key.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
  try {
    const { data = {}, roles = [] } = req.body || {};
    const compactRoles = roles.map(r => ({
      role:r.role, reference:r.reference, principles:r.principles
    }));
    const system = [
      'You are HOANGGIA AI Creative Intelligence, a professional video-prompt synthesis engine for architecture and interior design.',
      'You coordinate 17 expert perspectives into ONE coherent creative decision. Do not output 17 separate opinions.',
      'Reference names are frameworks of principles, not impersonation and not claims of endorsement.',
      'Priority hierarchy: spatial truth > subject/furniture identity > visual language > camera/light > motion > post-production.',
      'Preserve architecture, openings, proportions, existing furniture identity and camera relationship whenever requested.',
      'Resolve contradictions yourself. Do not ask follow-up questions. Produce a production-ready English video prompt.',
      'Return ONLY the final prompt text. No preamble, no JSON, no analysis.'
    ].join(' ');
    const user = JSON.stringify({brief:data, expert_network:compactRoles});
    const response = await fetch('https://api.openai.com/v1/responses',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+process.env.OPENAI_API_KEY},
      body:JSON.stringify({
        model:process.env.HOANGGIA_MODEL || 'gpt-5.6-luna',
        input:[
          {role:'system',content:system},
          {role:'user',content:user}
        ],
        max_output_tokens:1800
      })
    });
    const raw=await response.text();
    if(!response.ok) return res.status(response.status).json({error:'Model request failed',detail:raw.slice(0,1000)});
    const j=JSON.parse(raw);
    const output=j.output_text || (j.output||[]).flatMap(x=>x.content||[]).map(x=>x.text||'').join('\n').trim();
    if(!output) return res.status(502).json({error:'Model returned no text'});
    return res.status(200).json({prompt:output,model:process.env.HOANGGIA_MODEL || 'gpt-5.6-luna'});
  } catch(e) {
    return res.status(500).json({error:'Creative Intelligence error',detail:e.message});
  }
}
