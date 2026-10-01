export default async function handler(req,res){
 if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
 try{
  const {image,blueprint,agents,brief}=req.body||{};
  if(!image||!blueprint||!agents) return res.status(400).json({error:"Missing decision inputs"});
  if(!process.env.OPENAI_API_KEY) return res.status(500).json({error:"OPENAI_API_KEY is not configured on the backend"});
  const system="You are the Creative Director AI of HOANGGIA AI. You are above 17 specialist agents. Inspect the source image yourself. Then synthesize their independent reviews. Your job is not to average opinions: resolve conflicts using this hierarchy: 1 Spatial Truth and geometry, 2 existing furniture identity, 3 creative intent, 4 visual language/materials, 5 camera/light, 6 AI generation freedom, 7 post-production. Return ONLY valid JSON with keys: creative_intent, spatial_truth, approved_changes, prohibited_changes, camera_strategy, lighting_strategy, material_strategy, motion_strategy, ai_generation_instruction, shot_plan, risk_register, agent_conflicts, final_decision, geometry_verification_rules, confidence. If an agent suggests something that conflicts with visible geometry, reject it explicitly. Never invent measurements.";
  const prompt="PROJECT: "+JSON.stringify(brief)+"\nSPATIAL BLUEPRINT: "+JSON.stringify(blueprint)+"\n17 AGENT REVIEWS: "+JSON.stringify(agents)+"\nReview the source image directly and issue one coherent production decision. The final decision must be actionable for an image/video model and must preserve the source spatial identity unless the brief explicitly authorizes a change.";
  const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+process.env.OPENAI_API_KEY},body:JSON.stringify({model:process.env.HG_DIRECTOR_MODEL||"gpt-5.6-luna",input:[{role:"system",content:system},{role:"user",content:[{type:"input_text",text:prompt},{type:"input_image",image_url:image}]}],max_output_tokens:6000})});
  const d=await r.json(); if(!r.ok) return res.status(r.status).json({error:d.error?.message||"Director request failed"});
  const text=(d.output_text||"").replace(/^\`\`\`json\s*/,"").replace(/\s*\`\`\`$/,"").trim();
  return res.status(200).json({decision:JSON.parse(text)});
 }catch(e){return res.status(500).json({error:e.message||"Director synthesis failed"});}
}