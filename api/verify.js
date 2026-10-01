export default async function handler(req,res){
 if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
 try{
  const {source,output,blueprint}=req.body||{};
  if(!source||!output||!blueprint) return res.status(400).json({error:"source, output and blueprint are required"});
  if(!process.env.OPENAI_API_KEY) return res.status(500).json({error:"OPENAI_API_KEY is not configured on the backend"});
  const system="You are HOANGGIA AI Geometry Verification Agent. Compare SOURCE and OUTPUT images against the Spatial Blueprint. This is a verification gate, not a creative task. Return ONLY valid JSON with keys: geometry_preservation_score, furniture_identity_score, camera_continuity_score, material_consistency_score, detected_changes, violations, approved, reasons, repair_instructions, confidence. Be conservative. If a change cannot be verified visually, mark it uncertain rather than inventing.";
  const prompt="SPATIAL BLUEPRINT:\n"+JSON.stringify(blueprint)+"\nCompare SOURCE to OUTPUT. Flag changed walls, ceiling height, openings, floor plane, major furniture geometry, camera perspective and material identity. Aesthetic improvement is not a reason to approve a geometry change.";
  const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+process.env.OPENAI_API_KEY},body:JSON.stringify({model:process.env.HG_VERIFY_MODEL||"gpt-5.6-luna",input:[{role:"system",content:system},{role:"user",content:[{type:"input_text",text:prompt},{type:"input_image",image_url:source},{type:"input_image",image_url:output}]}],max_output_tokens:3500})});
  const d=await r.json(); if(!r.ok)return res.status(r.status).json({error:d.error?.message||"Verification request failed"});
  const text=(d.output_text||"").replace(/^\`\`\`json\s*/,"").replace(/\s*\`\`\`$/,"").trim();
  return res.status(200).json({verification:JSON.parse(text)});
 }catch(e){return res.status(500).json({error:e.message||"Verification failed"});}
}