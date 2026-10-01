export default async function handler(req,res){
 if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
 try{
  const {frames=[],blueprint}=req.body||{};
  if(!frames.length||!blueprint)return res.status(400).json({error:"frames and blueprint are required"});
  if(!process.env.OPENAI_API_KEY)return res.status(500).json({error:"OPENAI_API_KEY is not configured on the backend"});
  const prompt=[
   "You are HOANGGIA AI Temporal Geometry Verification.",
   "Inspect representative frames from the SAME generated architecture/interior video.",
   "Compare them to the Spatial Blueprint and evaluate BOTH spatial fidelity and temporal consistency.",
   "Track wall lines, openings, ceiling, floor, furniture identity/placement, camera continuity, material continuity and lighting direction across frames.",
   "Detect geometry drift, object morphing, furniture substitution, disappearing openings, changing proportions, camera jumps and material flicker.",
   "Do not invent defects. If a change is ambiguous, mark it uncertain.",
   "Return ONLY valid JSON with keys: overall_score, geometry_preservation_score, furniture_identity_score, camera_continuity_score, material_consistency_score, temporal_consistency_score, frame_findings, temporal_violations, approved, reasons, repair_instructions, confidence."
  ].join("\n");
  const content=[{type:"input_text",text:prompt+"\nSPATIAL BLUEPRINT:\n"+JSON.stringify(blueprint)+"\nFRAME COUNT: "+frames.length}];
  frames.forEach((f,i)=>content.push({type:"input_text",text:"FRAME "+(i+1)},{type:"input_image",image_url:f}));
  const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+process.env.OPENAI_API_KEY},body:JSON.stringify({model:process.env.HG_VERIFY_MODEL||"gpt-5.6-luna",input:[{role:"user",content}],max_output_tokens:5000})});
  const d=await r.json();if(!r.ok)return res.status(r.status).json({error:d.error?.message||"Temporal verification failed"});
  const raw=(d.output_text||"").replace(/^\`\`\`json\s*/,"").replace(/\s*\`\`\`$/,"").trim();
  return res.status(200).json({verification:JSON.parse(raw),frames_analyzed:frames.length});
 }catch(e){return res.status(500).json({error:e.message||"Temporal verification failed"});}
}