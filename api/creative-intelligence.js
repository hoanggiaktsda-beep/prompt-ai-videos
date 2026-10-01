// HOANGGIA AI — Creative Intelligence API
// Pipeline: Vision → Expert Agents → Creative Director → Synthesis → Video Prompt
// Deploy as a Vercel serverless function. Keep OPENAI_API_KEY server-side.

const CORE = [
  'You are HOANGGIA AI Creative Intelligence, an expert system for architecture, interior and cinematic video generation.',
  'The pipeline is: VISION → EXPERT AGENTS → CREATIVE DIRECTOR → SYNTHESIS → VIDEO PROMPT.',
  'Never imitate, impersonate, or claim endorsement by any named expert. Treat names only as reference frameworks for principles.',
  'Priority: spatial truth > furniture/subject identity > visual language > camera/light > motion > post-production.',
  'When a reference image is supplied, analyze it as visual evidence: geometry, openings, proportions, furniture identity, materials, palette, lighting, camera relationship and negative constraints.',
  'Resolve conflicts between agents using the priority hierarchy. Produce one coherent decision, never 17 disconnected opinions.',
  'For architecture/interior scenes, preserve real-world plausibility, scale, perspective and material behavior.',
  'Return production-ready English prompt text only unless JSON is explicitly requested.'
].join(' ');

const VISION = [
  'VISION ANALYSIS: infer a compact scene blueprint from the reference image when available.',
  'Record only observable or strongly supported attributes. Separate certainty from inference.',
  'Extract: scene type, spatial geometry, wall/ceiling/floor relationships, openings, dominant objects, furniture identity, material families, palette, light direction/quality, camera position/lens feel, depth layers, symmetry/vanishing lines, people, and elements that must not change.',
  'If no image exists, build the blueprint from the written brief and mark visual fields as unspecified.'
].join(' ');

const AGENTS = [
  ['Creative Director','emotional intent, hierarchy, storytelling, clarity'],
  ['Art Director','visual language, composition, production-design hierarchy'],
  ['Architect / Interior Designer','proportion, circulation, materiality, spatial experience'],
  ['Storyboard Artist','readable visual beats and sequential clarity'],
  ['Director','motivated action and cinematic pacing'],
  ['Cinematographer / DOP','motivated light, exposure and restrained composition'],
  ['3D / Archviz Artist','accurate perspective, scale and material realism'],
  ['AI Artist / AI Director','precise generative language while protecting visual identity'],
  ['Lighting Designer','light hierarchy, perception and controlled contrast'],
  ['Set / Styling / Decor','object hierarchy and intentional styling'],
  ['Camera Operator','physically plausible camera path and spatial relationship'],
  ['Editor','rhythm, timing and continuity'],
  ['Colorist','palette, tonal separation and highlight control'],
  ['Sound Designer','environmental realism and spatial cues'],
  ['Composer / Music Producer','tempo, tension and emotional arc'],
  ['Voice Artist','clarity and controlled delivery when voice is requested'],
  ['Producer','brief discipline, format, feasibility and delivery constraints']
];

function cleanBody(req) {
  const b=req.body||{};
  return {
    data:b.data||{},
    roles:b.roles||[],
    image:b.image||b.reference_image||null
  };
}

async function callModel(apiKey, model, input) {
  const r=await fetch('https://api.openai.com/v1/responses',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':'Bearer '+apiKey},
    body:JSON.stringify({model,input,max_output_tokens:2200})
  });
  const raw=await r.text();
  if(!r.ok) throw new Error('Model request failed: '+r.status+' '+raw.slice(0,500));
  const j=JSON.parse(raw);
  const out=j.output_text || (j.output||[]).flatMap(x=>x.content||[]).map(x=>x.text||'').join('\n').trim();
  if(!out) throw new Error('Model returned no text');
  return out;
}

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const apiKey=process.env.OPENAI_API_KEY;
  if(!apiKey) return res.status(503).json({error:'OPENAI_API_KEY is not configured'});
  try{
    const {data,roles,image}=cleanBody(req);
    const model=process.env.HOANGGIA_MODEL||'gpt-5.6-luna';

    // 1) VISION — multimodal when a reference image is actually provided.
    let visionBlueprint='';
    if(image && typeof image==='string' && image.startsWith('data:image/')){
      visionBlueprint=await callModel(apiKey,model,[
        {role:'system',content:CORE+' '+VISION+' Return a concise structured visual blueprint.'},
        {role:'user',content:[
          {type:'input_text',text:'Analyze this architecture/interior reference image for HOANGGIA AI. '+JSON.stringify(data)},
          {type:'input_image',image_url:image,detail:'high'}
        ]}
      ]);
    } else {
      visionBlueprint='No reference image supplied. Build the scene blueprint from the written brief only.';
    }

    // 2) EXPERT AGENTS — one coordinated deliberation pass, with role-specific lenses.
    const roleSet=AGENTS.map(([role,principles],i)=>{
      const supplied=roles.find(r=>r.role===role);
      return (i+1)+'. '+role+' — '+(supplied?.reference||'reference framework')+' — '+(supplied?.principles||principles);
    }).join('\n');

    const expertDecision=await callModel(apiKey,model,[
      {role:'system',content:CORE+' You are the Expert Agent Network. Apply all 17 lenses internally, then output a compact decision memo grouped by: preserve, enhance, camera, motion, light, material, atmosphere, storytelling, constraints.'},
      {role:'user',content:'SCENE DATA:\n'+JSON.stringify(data)+'\n\nVISION BLUEPRINT:\n'+visionBlueprint+'\n\n17 AGENTS:\n'+roleSet}
    ]);

    // 3) CREATIVE DIRECTOR — resolve trade-offs into one creative direction.
    const creativeDirection=await callModel(apiKey,model,[
      {role:'system',content:CORE+' You are the Creative Director. Synthesize the vision blueprint and expert memo into ONE final creative decision. Protect spatial truth and identity above decorative invention. Output only the decision, not a prompt.'},
      {role:'user',content:'BRIEF:\n'+JSON.stringify(data)+'\n\nVISION:\n'+visionBlueprint+'\n\nEXPERT MEMO:\n'+expertDecision}
    ]);

    // 4) SYNTHESIS — translate the decision into a clean production prompt.
    const finalPrompt=await callModel(apiKey,model,[
      {role:'system',content:CORE+' You are the final prompt synthesizer. Convert the supplied creative decision into one precise English video-generation prompt. Include subject, intent, shot, lens, camera path, motion, lighting, materials, atmosphere, action, continuity, reference-image fidelity and negative constraints. Do not add unsupported architecture. Return only the prompt.'},
      {role:'user',content:'INPUT:\n'+JSON.stringify(data)+'\n\nVISION:\n'+visionBlueprint+'\n\nCREATIVE DECISION:\n'+creativeDirection}
    ]);

    return res.status(200).json({
      prompt:finalPrompt,
      model,
      pipeline:['VISION','17 EXPERT AGENTS','CREATIVE DIRECTOR','SYNTHESIS','VIDEO PROMPT'],
      vision:visionBlueprint,
      expert_memo:expertDecision,
      creative_direction:creativeDirection
    });
  }catch(e){
    return res.status(500).json({error:'Creative Intelligence pipeline failed',detail:e.message});
  }
}
