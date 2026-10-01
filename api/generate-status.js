export default async function handler(req,res){
 if(req.method!=="GET") return res.status(405).json({error:"Method not allowed"});
 try{
  const id=req.query?.id;if(!id)return res.status(400).json({error:"id is required"});
  if(!process.env.OPENAI_API_KEY)return res.status(500).json({error:"OPENAI_API_KEY is not configured on the backend"});
  const r=await fetch("https://api.openai.com/v1/videos/"+encodeURIComponent(id),{headers:{Authorization:"Bearer "+process.env.OPENAI_API_KEY}});
  const d=await r.json();if(!r.ok)return res.status(r.status).json({error:d.error?.message||"Video status failed"});
  if(d.status==="completed"){
   const vr=await fetch("https://api.openai.com/v1/videos/"+encodeURIComponent(id)+"/content",{headers:{Authorization:"Bearer "+process.env.OPENAI_API_KEY}});
   if(vr.ok){const buf=Buffer.from(await vr.arrayBuffer());return res.status(200).json({status:"completed",id,video_url:"data:video/mp4;base64,"+buf.toString("base64")});}
  }
  return res.status(200).json({status:d.status,id,error:d.error||null});
 }catch(e){return res.status(500).json({error:e.message||"Video status failed"});}
}