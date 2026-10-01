// HOANGGIA AI Vision Backend — Cloudflare Worker
const MODEL = "gpt-5.6-luna";
const DEFAULT_ORIGIN = "https://hoanggiaktsda-beep.github.io";

const blueprintSchema = {
  type:"object", additionalProperties:false,
  properties:{
    analysis_status:{type:"string"}, confidence:{type:"string"},
    space:{type:"object",additionalProperties:false,properties:{
      type:{type:"string"},apparent_scale:{type:"string"},ceiling_height_estimate:{type:"string"},
      camera_view:{type:"string"},perspective:{type:"string"}
    },required:["type","apparent_scale","ceiling_height_estimate","camera_view","perspective"]},
    architecture:{type:"object",additionalProperties:false,properties:{
      walls:{type:"array",items:{type:"string"}},openings:{type:"array",items:{type:"string"}},
      doors:{type:"array",items:{type:"string"}},windows:{type:"array",items:{type:"string"}},
      ceiling:{type:"string"},floor:{type:"string"},fixed_elements:{type:"array",items:{type:"string"}}
    },required:["walls","openings","doors","windows","ceiling","floor","fixed_elements"]},
    furniture:{type:"array",items:{type:"object",additionalProperties:false,properties:{
      type:{type:"string"},identity:{type:"string"},position:{type:"string"},orientation:{type:"string"},
      material:{type:"string"},color:{type:"string"},fixed_or_movable:{type:"string"}
    },required:["type","identity","position","orientation","material","color","fixed_or_movable"]}},
    materials:{type:"array",items:{type:"object",additionalProperties:false,properties:{
      element:{type:"string"},material:{type:"string"},finish:{type:"string"},color:{type:"string"},certainty:{type:"string"}
    },required:["element","material","finish","color","certainty"]}},
    lighting:{type:"object",additionalProperties:false,properties:{
      sources:{type:"array",items:{type:"string"}},direction:{type:"string"},quality:{type:"string"},
      color_temperature:{type:"string"},shadow_behavior:{type:"string"},reflections:{type:"string"}
    },required:["sources","direction","quality","color_temperature","shadow_behavior","reflections"]},
    camera:{type:"object",additionalProperties:false,properties:{
      estimated_position:{type:"string"},height:{type:"string"},angle:{type:"string"},
      lens_estimate:{type:"string"},framing:{type:"string"},verticals:{type:"string"}
    },required:["estimated_position","height","angle","lens_estimate","framing","verticals"]},
    geometry_guard:{type:"object",additionalProperties:false,properties:{
      lock_walls:{type:"boolean"},lock_openings:{type:"boolean"},lock_ceiling:{type:"boolean"},
      lock_floor:{type:"boolean"},lock_furniture_identity:{type:"boolean"},lock_furniture_layout:{type:"boolean"},
      lock_camera_space:{type:"boolean"},prohibitions:{type:"array",items:{type:"string"}}
    },required:["lock_walls","lock_openings","lock_ceiling","lock_floor","lock_furniture_identity","lock_furniture_layout","lock_camera_space","prohibitions"]},
    uncertainty:{type:"array",items:{type:"string"}},visual_language:{type:"array",items:{type:"string"}}
  },
  required:["analysis_status","confidence","space","architecture","furniture","materials","lighting","camera","geometry_guard","uncertainty","visual_language"]
};

function cors(origin,allowed){return {"Access-Control-Allow-Origin":(origin&&origin.endsWith(".github.io"))?origin:allowed,"Access-Control-Allow-Methods":"POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type","Vary":"Origin"}}
function json(data,status,origin,allowed){return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json",...cors(origin,allowed)}})}

export default {async fetch(request,env){
  const origin=request.headers.get("Origin")||"",allowed=env.ALLOWED_ORIGIN||DEFAULT_ORIGIN;
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:cors(origin,allowed)});
  const url=new URL(request.url);
  if(url.pathname!=="/analyze-spatial")return json({error:"Not found"},404,origin,allowed);
  if(request.method!=="POST")return json({error:"Method not allowed"},405,origin,allowed);
  if(!env.OPENAI_API_KEY)return json({error:"OPENAI_API_KEY chưa được cấu hình trên backend."},500,origin,allowed);
  let body;try{body=await request.json()}catch(_){return json({error:"JSON body không hợp lệ."},400,origin,allowed)}
  const images=Array.isArray(body.images)?body.images.filter(x=>typeof x==="string").slice(0,6):[];
  if(!images.length)return json({error:"Cần ít nhất một ảnh."},400,origin,allowed);
  for(const image of images){
    if(!/^data:image\/(jpeg|jpg|png|webp|gif);base64,/i.test(image))return json({error:"Ảnh phải là data URL base64."},400,origin,allowed);
    if(image.length>12000000)return json({error:"Một ảnh vượt giới hạn kích thước backend."},413,origin,allowed);
  }
  const context=body.context||{},instruction=typeof body.instruction==="string"?body.instruction:"";
  const userText=[
    "Analyze the supplied architectural/interior reference image set for HOANGGIA AI.",
    "Create a Spatial Blueprint for downstream image-to-video prompting.",
    "Observe only what is visually supported. Never invent walls, openings, furniture, dimensions or materials.",
    "Separate certainty from estimation. Unknown measurements must be marked approximate or unknown.",
    "Treat architecture, openings, ceiling, floor, furniture identity/layout and camera-space relationship as locked geometry.",
    "For multiple images, cross-check them and report conflicts instead of averaging them.",
    "Preserve spatial truth over creative interpretation.",
    "User creative instruction: "+instruction,
    "Context: "+JSON.stringify(context)
  ].join("\n");
  const content=[{type:"input_text",text:userText},...images.map(image_url=>({type:"input_image",image_url,detail:"high"}))];
  const upstream=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({
    model:MODEL,input:[{role:"user",content}],text:{format:{type:"json_schema",name:"spatial_blueprint",strict:true,schema:blueprintSchema}},max_output_tokens:6000
  })});
  const raw=await upstream.json().catch(()=>({}));
  if(!upstream.ok)return json({error:raw?.error?.message||"Vision AI request failed."},502,origin,allowed);
  let blueprint;
  try{
    const text=raw.output_text||raw.output?.flatMap(x=>x.content||[]).find(x=>x.type==="output_text")?.text||"";
    blueprint=JSON.parse(text);
  }catch(_){return json({error:"Vision AI trả về dữ liệu không đọc được.",raw_output:raw.output_text||null},502,origin,allowed)}
  return json({blueprint,model:MODEL},200,origin,allowed);
}};
