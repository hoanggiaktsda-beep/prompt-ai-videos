export default async function handler(req,res){
 if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
 try{
  const {image,blueprint,agent,brief}=req.body||{};
  if(!image||!agent||!blueprint) return res.status(400).json({error:"Missing agent, image or blueprint"});
  if(!process.env.OPENAI_API_KEY) return res.status(500).json({error:"OPENAI_API_KEY is not configured on the backend"});
  const system="You are one independent HOANGGIA AI Expert Agent. You MUST inspect the supplied image yourself, then use the Spatial Blueprint as a constraint—not as a replacement for visual inspection. Your job is to challenge the image from your specialist role. Do not pretend to know hidden dimensions. Return ONLY valid JSON with keys: agent, visual_observations, principles_applied, checklist_findings, questions, recommendations, risks, critique, confidence, conflicts. The agent must be specific to architecture/interior production. If something cannot be seen, say unknown.";
  const prompt="AGENT: "+JSON.stringify(agent)+"\nPROJECT: "+JSON.stringify(brief)+"\nSPATIAL BLUEPRINT: "+JSON.stringify(blueprint)+"\nAnalyze the actual image now. Protect geometry and existing furniture identity unless the brief explicitly requests a change. Identify what you would approve, reject, or ask Creative Director to resolve.";
  const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+process.env.OPENAI_API_KEY},body:JSON.stringify({model:process.env.HG_AGENT_MODEL||"gpt-5.6-luna",input:[{role:"system",content:system},{role:"user",content:[{type:"input_text",text:prompt},{type:"input_image",image_url:image}]}],max_output_tokens:2500})});
  const d=await r.json(); if(!r.ok) return res.status(r.status).json({error:d.error?.message||"Agent request failed"});
  const text=(d.output_text||"").replace(/^\`\`\`json\s*/,"").replace(/\s*\`\`\`$/,"").trim();
  return res.status(200).json(JSON.parse(text));
 }catch(e){return res.status(500).json({error:e.message||"Agent analysis failed"});}
}