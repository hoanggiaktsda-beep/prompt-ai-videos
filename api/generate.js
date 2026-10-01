export default async function handler(req,res){
 if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
 try{
  const {media="image",model="openai-image",mode="edit",prompt="",source="",repair_iteration=0}=req.body||{};
  if(!prompt) return res.status(400).json({error:"prompt is required"});
  if(!process.env.OPENAI_API_KEY) return res.status(500).json({error:"OPENAI_API_KEY is not configured on the backend"});
  if(media==="video"){
   if(!["sora-2","sora-2-pro"].includes(model)) return res.status(400).json({error:"Unsupported video model"});
   const form=new FormData();
   form.append("model",model); form.append("prompt",prompt);
   form.append("seconds",process.env.HG_VIDEO_SECONDS||"8"); form.append("size",process.env.HG_VIDEO_SIZE||"1280x720");
   if(source){
    const m=source.match(/^data:(image\/(?:png|jpeg|webp));base64,(.+)$/);
    if(m){const bytes=Buffer.from(m[2],"base64");const ext={"image/png":"png","image/jpeg":"jpg","image/webp":"webp"}[m[1]]||"png";form.append("input_reference",new Blob([bytes],{type:m[1]}),"source."+ext);}
   }
   const r=await fetch("https://api.openai.com/v1/videos",{method:"POST",headers:{Authorization:"Bearer "+process.env.OPENAI_API_KEY},body:form});
   const d=await r.json();if(!r.ok)return res.status(r.status).json({error:d.error?.message||"Video generation failed"});
   return res.status(200).json({provider:"openai",media:"video",model,job:d,repair_iteration});
  }
  const content=[{type:"input_text",text:prompt}]; if(source)content.push({type:"input_image",image_url:source});
  const body={model:process.env.HG_IMAGE_MODEL||"gpt-image-2",input:[{role:"user",content}],tools:[{type:"image_generation",action:mode==="edit"?"edit":"generate",quality:process.env.HG_IMAGE_QUALITY||"high",size:process.env.HG_IMAGE_SIZE||"1536x1024",background:"opaque"}]};
  const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+process.env.OPENAI_API_KEY},body:JSON.stringify(body)});
  const d=await r.json();if(!r.ok)return res.status(r.status).json({error:d.error?.message||"Image generation failed"});
  const item=(d.output||[]).find(x=>x.type==="image_generation_call"); const b64=item?.result;
  if(!b64)return res.status(502).json({error:"Image model returned no image result"});
  return res.status(200).json({provider:"openai",media:"image",model:process.env.HG_IMAGE_MODEL||"gpt-image-2",mode,image:"data:image/png;base64,"+b64,repair_iteration});
 }catch(e){return res.status(500).json({error:e.message||"Generation adapter failed"});}
}