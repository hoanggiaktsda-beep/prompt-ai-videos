export default async function handler(req,res){
 if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
 try{
  const {image,brief="",space="",purpose="",lock=""}=req.body||{};
  if(!image||!/^data:image\/(png|jpeg|webp);base64,/.test(image)) return res.status(400).json({error:"Missing or invalid image data"});
  if(!process.env.OPENAI_API_KEY) return res.status(500).json({error:"OPENAI_API_KEY is not configured on the backend"});
  const system="You are HOANGGIA AI Vision Engine for architecture and interior design. Read the supplied render/photo as a spatial-analysis specialist. Do not redesign it. Build a Spatial Blueprint that becomes the source of truth for downstream agents. Separate observations from estimates. Never invent hidden geometry. Return ONLY valid JSON with keys: scene_summary, camera, geometry, openings, ceiling, floor, furniture_regions, materials, lighting, people, spatial_relationships, preservation_constraints, uncertainty, blueprint_confidence. Geometry must describe visible walls/planes and approximate normalized 0..1 image coordinates where useful. furniture_regions must list major visible furniture with bbox [x,y,w,h] normalized. If a metric is not observable, use null and explain uncertainty.";
  const user="Project: "+space+"; purpose: "+purpose+"; geometry lock: "+lock+". Brief: "+(brief||"none")+". Analyze this image as the actual source of truth. Preserve visible spatial identity.";
  const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+process.env.OPENAI_API_KEY},body:JSON.stringify({model:process.env.HG_VISION_MODEL||"gpt-5.6-luna",input:[{role:"system",content:system},{role:"user",content:[{type:"input_text",text:user},{type:"input_image",image_url:image}]}],max_output_tokens:5000})});
  const d=await r.json(); if(!r.ok) return res.status(r.status).json({error:d.error?.message||"OpenAI Vision request failed"});
  const text=d.output_text||"";
  const clean=text.replace(/^\`\`\`json\s*/,"").replace(/\s*\`\`\`$/,"").trim();
  return res.status(200).json({blueprint:JSON.parse(clean)});
 }catch(e){return res.status(500).json({error:e.message||"Vision analysis failed"});}
}