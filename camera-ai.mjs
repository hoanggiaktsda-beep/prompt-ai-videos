// HOANGGIA CAMERA AI V1.1 — photography-purpose and mount-aware equipment selector
const STYLES=[
["interior","Nội thất","Không gian, phòng khách, showroom","14–35mm; phối cảnh tự nhiên"],
["architecture","Kiến trúc","Mặt tiền, biệt thự, công trình","Góc rộng / Tilt-Shift; đường đứng thẳng"],
["bokeh","Xóa phông","Chủ thể sắc nét, hậu cảnh mềm","Khẩu lớn; 35–135mm"],
["furniture","Sản phẩm nội thất","Sofa, bàn, ghế, giường","35–85mm; bảo toàn tỷ lệ"],
["macro","Chi tiết vật liệu","Da, vải, gỗ, đá, đường may","Macro lấy nét gần"],
["cinematic","Cinematic Luxury","Chiều sâu, cảm xúc điện ảnh","24–85mm; ánh sáng có chủ đích"]
];
const db=[
["Sony","FE",["A7R V","A1 II","A7 IV","A7CR","A7S III","A9 III","A7 III","A7C II","A7R IV","A7R III"],[
["FE 16–35mm F2.8 GM II","interior architecture"],["FE 12–24mm F2.8 GM","interior architecture"],["FE 20mm F1.8 G","interior architecture cinematic"],["FE 24mm F1.4 GM","interior architecture cinematic"],["FE 35mm F1.4 GM","interior furniture bokeh cinematic"],["FE 50mm F1.4 GM","furniture bokeh cinematic"],["FE 50mm F1.2 GM","furniture bokeh cinematic"],["FE 85mm F1.4 GM II","furniture bokeh cinematic"],["FE 135mm F1.8 GM","bokeh furniture"],["FE 90mm F2.8 Macro G OSS","macro"],["FE 70–200mm F2.8 GM OSS II","bokeh furniture"],["FE 24–70mm F2.8 GM II","interior furniture cinematic"]]],
["Canon","RF",["EOS R5 Mark II","EOS R5","EOS R6 Mark II","EOS R6 Mark III","EOS R3","EOS R1","EOS R8","EOS R6","EOS R5 C","EOS R"],[
["RF 15–35mm F2.8 L IS USM","interior architecture"],["RF 14–35mm F4 L IS USM","interior architecture"],["RF 10–20mm F4 L IS STM","interior architecture"],["RF 24mm F1.8 Macro IS STM","interior cinematic"],["RF 35mm F1.4 L VCM","interior furniture bokeh cinematic"],["RF 50mm F1.2 L USM","furniture bokeh cinematic"],["RF 85mm F1.2 L USM","furniture bokeh cinematic"],["RF 100mm F2.8 L Macro IS USM","macro"],["RF 24–70mm F2.8 L IS USM","interior furniture cinematic"],["RF 70–200mm F2.8 L IS USM","bokeh furniture"],["TS-E 17mm f/4L + ngàm EF–EOS R","architecture"],["TS-E 24mm f/3.5L II + ngàm EF–EOS R","architecture"]]],
["Nikon","Z",["Z8","Z9","Z7 II","Z6 III","Z6 II","Zf","Z5","Z5 II","Z7","Z6"],[
["NIKKOR Z 14–24mm f/2.8 S","interior architecture"],["NIKKOR Z 17–28mm f/2.8","interior architecture"],["NIKKOR Z 20mm f/1.8 S","interior architecture cinematic"],["NIKKOR Z 24mm f/1.8 S","interior cinematic"],["NIKKOR Z 35mm f/1.8 S","interior furniture bokeh cinematic"],["NIKKOR Z 50mm f/1.8 S","furniture bokeh cinematic"],["NIKKOR Z 85mm f/1.2 S","furniture bokeh cinematic"],["NIKKOR Z MC 105mm f/2.8 VR S","macro"],["NIKKOR Z MC 50mm f/2.8","macro"],["NIKKOR Z 24–70mm f/2.8 S","interior furniture cinematic"],["PC NIKKOR 19mm f/4E ED + ngàm FTZ (kiểm tra điều khiển)","architecture"]]],
["Fujifilm","GF",["GFX100 II","GFX100S II","GFX100","GFX100S","GFX50S II","GFX50R"],[
["FUJINON GF20–35mm F4 R WR","interior architecture"],["FUJINON GF30mm F3.5 R WR","interior architecture"],["FUJINON GF23mm F4 R LM WR","interior architecture"],["FUJINON GF45mm F2.8 R WR","interior furniture cinematic"],["FUJINON GF55mm F1.7 R WR","furniture bokeh cinematic"],["FUJINON GF80mm F1.7 R WR","furniture bokeh cinematic"],["FUJINON GF110mm F2 R LM WR","bokeh furniture"],["FUJINON GF120mm F4 R LM OIS WR Macro","macro"]]],
["Hasselblad","XCD",["X2D 100C","907X 100C","X1D II 50C","X1D 50C"],[
["XCD 4/21","interior architecture"],["XCD 4/28P","interior architecture"],["XCD 3.5/30","interior architecture"],["XCD 2.5/38V","interior furniture cinematic"],["XCD 2.5/55V","furniture bokeh cinematic"],["XCD 1.9/80","furniture bokeh cinematic"],["XCD 2.5/90V","furniture bokeh cinematic"],["XCD 3.5/120 Macro","macro"]]],
["Leica","L",["SL3","SL2","SL2-S","SL3-S"],[
["Super-Vario-Elmarit-SL 14–24mm f/2.8 ASPH.","interior architecture"],["Super-Vario-Elmar-SL 16–35mm f/3.5–4.5 ASPH.","interior architecture"],["Summicron-SL 35mm f/2 ASPH.","interior furniture cinematic"],["Summilux-SL 50mm f/1.4 ASPH.","furniture bokeh cinematic"],["APO-Summicron-SL 75mm f/2 ASPH.","furniture bokeh cinematic"],["APO-Macro-Elmarit-TL 60mm f/2.8 ASPH. (crop mode)","macro"]]],
["Phase One","XF",["XF IQ4 150MP","XF IQ4 100MP"],[
["Schneider Kreuznach 35mm LS f/3.5","interior architecture"],["Schneider Kreuznach 55mm LS f/2.8","interior furniture"],["Schneider Kreuznach 80mm LS f/2.8","furniture cinematic"],["Schneider Kreuznach 120mm LS f/4 Macro","macro"],["Schneider Kreuznach 150mm LS f/2.8","bokeh furniture"]]]
];

const HG_DRONE_CATALOG_YEAR=2026;
const HG_DRONES=[["DJI",[["Mavic 4 Pro",["28mm wide","70mm medium tele","168mm tele"]],["Inspire 3 X9-8K Air",["DL 18mm","DL 24mm","DL 35mm","DL 50mm","DL 75mm"]],["Matrice 4E",["24mm wide","70mm medium tele","168mm tele"]],["Matrice 4T",["24mm wide","70mm medium tele","168mm tele","thermal"]],["Air 3S",["24mm wide","70mm medium tele"]]]],["Autel Robotics",[["EVO II Pro V3",["29mm wide"]],["EVO Max 4T",["wide","zoom","thermal"]]]],["Skydio",[["X10",["wide","narrow","tele","thermal"]]]],["Freefly Systems",[["Astro Sony ILX-LR1",["Sony 24mm","Sony 35mm","Sony 50mm"]]]],["Parrot",[["ANAFI Ai",["integrated wide"]],["ANAFI USA",["wide","zoom","thermal"]]]],["Yuneec",[["H850-RTK E90X",["E90X wide"]]]]];
const el=id=>document.getElementById(id);
const make=(tag,txt)=>{const n=document.createElement(tag);if(txt)n.textContent=txt;return n};
const opt=(v,t)=>{const n=make("option",t);n.value=v;return n};
const $panel=el("hgCameraAI");
if($panel){
 const mode=el("hgCamMode"),style=el("hgCamStyle"),brand=el("hgCamBrand"),body=el("hgCamBody"),lens=el("hgCamLens"),aperture=el("hgCamAperture"),focus=el("hgCamFocus"),lock=el("hgCamLock"),all=el("hgCamAll"),summary=el("hgCamSummary");
 STYLES.forEach(s=>style.append(opt(s[0],s[1]+" — "+s[2])));
 brand.replaceChildren(opt("","— Chọn hãng máy —"),...db.map(d=>opt(d[0],d[0])));
 brand.value="Sony";
 const purpose=()=>STYLES.find(s=>s[0]===style.value)||STYLES[0];
 const domain=el("hgVideoDomain");
 const categoryStyle={architecture:"architecture",interior:"interior",product:"furniture",cinema:"cinematic"};
 const bodyRank={
  architecture:/A7R|R5|Z8|Z9|GFX|X2D|IQ4|SL3/i,
  interior:/A7R|R5|Z8|GFX|X2D|SL3/i,
  product:/A7R|R5|Z8|GFX|X2D|IQ4|SL3/i,
  cinema:/A7S|A1|R5 C|R5 Mark|Z6 III|Z8|SL2-S|SL3-S/i
 };
 const recommendedBrands={
  architecture:["Fujifilm","Sony","Canon","Nikon","Hasselblad","Leica","Phase One"],
  interior:["Sony","Canon","Nikon","Fujifilm","Hasselblad","Leica","Phase One"],
  product:["Hasselblad","Fujifilm","Sony","Canon","Nikon","Phase One","Leica"],
  cinema:["Sony","Canon","Nikon","Leica","Fujifilm","Hasselblad","Phase One"]
 };
 const shotProfiles={
  flycam:{styles:['architecture','cinematic','interior'],mm:[10,40],body:/A7S|A1|A7 IV|R5 C|R5 Mark|R6|Z6|Z8|Z9|SL3-S|GFX100 II/i},
  hero:{styles:["furniture","cinematic","interior"],mm:[24,85],body:/A7R|A1|R5|Z8|Z9|GFX|X2D|SL3|IQ4/i},
  reveal:{styles:["architecture","interior","cinematic"],mm:[10,40],body:/A7R|A1|R5|Z8|Z9|GFX|X2D|SL3|IQ4/i},
  detail:{styles:["macro","furniture","bokeh"],mm:[50,200],body:/A7R|R5|Z8|Z9|GFX|X2D|IQ4|SL3/i},
  walk:{styles:["interior","architecture","cinematic"],mm:[14,40],body:/A7S|A1|A7 IV|R5 C|R5 Mark|R6|Z6|Z8|Z9|SL3-S|SL2-S|GFX100 II/i},
  orbit:{styles:["furniture","cinematic","bokeh"],mm:[24,105],body:/A7S|A1|A7 IV|R5 C|R5 Mark|R6|Z6|Z8|Z9|SL3-S|SL2-S|GFX100 II/i},
  static:{styles:["architecture","interior","furniture"],mm:[14,85],body:/A7R|R5|Z8|Z9|GFX|X2D|IQ4|SL3/i}
 };
 let selectedShots=[];
 const droneMode=()=>selectedShots.includes("flycam");
 const droneBrands=()=>HG_DRONES.map(x=>x[0]);
 const setEquipmentBrands=()=>{
  const names=droneMode()?droneBrands():(recommendedBrands[domain?.value]||recommendedBrands.interior);
  const old=brand.value;
  brand.replaceChildren(...names.map(x=>opt(x,x)));
  brand.value=names.includes(old)?old:names[0];
 };

 const lensRange=name=>{
  const nums=(name.match(/\d+(?:\.\d+)?/g)||[]).map(Number);
  // Strip aperture numbers by extracting focal length before f/F when possible.
  const focal=name.split(/\s[fF]\s*\/?\d|\sF\d/)[0];
  const values=(focal.match(/\d+(?:\.\d+)?/g)||[]).map(Number).filter(n=>n>=10&&n<=400);
  return values.length?[Math.min(...values),Math.max(...values)]:[0,0];
 };
 const lensFitsShot=(entry,key)=>{
  const profile=shotProfiles[key];if(!profile)return true;
  const [lo,hi]=lensRange(entry[0]);
  const focalMatch=lo>0&&hi>=profile.mm[0]&&lo<=profile.mm[1];
  const tagMatch=entry[1].split(" ").some(tag=>profile.styles.includes(tag));
  return focalMatch&&tagMatch;
 };
 const bodyFitsShot=(name,key)=>!shotProfiles[key]||shotProfiles[key].body.test(name);
 const recommendedStyle=()=>selectedShots.length?(shotProfiles[selectedShots.at(-1)]?.styles[0]||style.value):style.value;
 const updateShotSelection=keys=>{
  selectedShots=Array.isArray(keys)?keys.filter(k=>shotProfiles[k]):[];
  style.value=selectedShots.length?recommendedStyle():(categoryStyle[domain?.value]||"interior");
  all.checked=false;setEquipmentBrands();refresh(true);
 };
 let lastDomain="";
 const applyDomain=()=>{
  const domainKey=domain?.value||"interior";
  if(domainKey===lastDomain)return;
  lastDomain=domainKey;
  const desired=categoryStyle[domainKey]||"interior";
  style.value=desired;
  const brands=droneMode()?droneBrands():(recommendedBrands[domainKey]||recommendedBrands.interior);
  const oldBrand=brand.value;
  brand.replaceChildren(...brands.map(name=>opt(name,name)));
  brand.value=brands.includes(oldBrand)?oldBrand:brands[0];
  const d=current();
  const recommended=d[2].find(x=>bodyRank[domainKey]?.test(x));
  if(recommended)body.dataset.hgPreferred=recommended;
  all.checked=false;
  refresh(true);
 };

 const suggestedAperture=()=>{
   const scene=(document.getElementById("brief")?.value||"")+" "+(document.getElementById("sceneDirection")?.value||"")+" "+(document.getElementById("purpose")?.value||"");
   const normalized=scene.toLocaleLowerCase("vi");
   const kind=/(vật liệu|texture|vân da|đường may|macro|chi tiết)/i.test(normalized)?"macro":/(ngoại thất|mặt tiền|kiến trúc|tòa nhà|biệt thự)/i.test(normalized)?"architecture":/(sofa|ghế|bàn|giường|sản phẩm)/i.test(normalized)?"furniture":style.value;
   const target=focus.value==="subject"?"f/2.8":focus.value==="all"?"f/8":({bokeh:"f/1.8",macro:"f/8",architecture:"f/8",interior:"f/8",furniture:"f/5.6",cinematic:"f/2.8"}[kind]||"f/5.6");
   const chosen=db.find(d=>d[0]===brand.value)?.[3].find(x=>x[0]===lens.value);
   const raw=chosen?.[0]||"";
   const m=raw.match(new RegExp("[fF]\\/?([0-9]+(?:\\.[0-9]+)?)"));
   const min=m?Number(m[1]):2.8;
   const selected=Math.max(min,Number(target.slice(2)));
   const allowed=[1.4,1.8,2,2.8,4,5.6,8,11,16];
   const nearest=allowed.find(n=>n>=selected)||16;
   return {value:"f/"+nearest,reason:kind==="macro"?"Giữ rõ chi tiết vật liệu":kind==="architecture"?"Ưu tiên chiều sâu và đường nét kiến trúc":kind==="furniture"?"Cân bằng độ nét sản phẩm và hậu cảnh":kind==="bokeh"?"Ưu tiên xóa phông chủ thể":kind==="cinematic"?"Tạo chiều sâu điện ảnh":"Giữ độ nét không gian nội thất"};
 };
 const resolvedAperture=()=>aperture.value==="auto"?suggestedAperture().value:aperture.value;

 const current=()=>db.find(d=>d[0]===brand.value)||db[0];
 function refresh(useRecommendation=false){
   const oldBody=body.value,oldLens=lens.value;
   if(droneMode()){
    const manufacturer=HG_DRONES.find(x=>x[0]===brand.value);
    const models=manufacturer?.[1]||[];
    body.replaceChildren(...models.map(x=>opt(x[0],brand.value+" "+x[0])));
    if(!useRecommendation&&models.some(x=>x[0]===oldBody))body.value=oldBody;
    const cameras=models.find(x=>x[0]===body.value)?.[1]||[];
    lens.replaceChildren(...cameras.map(x=>opt(x,x)));
    if(!useRecommendation&&cameras.includes(oldLens))lens.value=oldLens;
    summary.textContent="FLYCAM "+HG_DRONE_CATALOG_YEAR+" · "+brand.value+" "+body.value+" · "+lens.value+" · "+(/Inspire|Astro/.test(body.value)?"Ống kính theo cấu hình máy":"Camera tích hợp, không thay lens vật lý");
    el("hgCamManual").hidden=mode.value==="auto";
    el("hgCamAuto").hidden=mode.value!=="auto";
    el("hgCamAuto").textContent=summary.textContent;
    return;
   }
   const d=current();
   const bodies=d[2].filter(x=>!selectedShots.length||selectedShots.some(k=>bodyFitsShot(x,k)));
   const availableBodies=bodies.length?bodies:d[2];
   body.replaceChildren(...availableBodies.map(x=>opt(x,d[0]+" "+x)));
   if(availableBodies.includes(oldBody)&&!useRecommendation)body.value=oldBody;
   else if(useRecommendation){const preferred=availableBodies.find(x=>bodyRank[domain?.value]?.test(x));if(preferred)body.value=preferred;}
   const filtered=d[3].filter(x=>selectedShots.length?selectedShots.some(k=>lensFitsShot(x,k)):(all.checked||x[1].split(" ").includes(style.value)));
   lens.replaceChildren(...filtered.map(x=>opt(x[0],d[0]+" "+x[0])));
   if(filtered.some(x=>x[0]===oldLens)&&!useRecommendation)lens.value=oldLens;
   summary.textContent=(mode.value==="auto"?"AI đề xuất: ":"Đang chọn: ")+d[0]+" "+body.value+" · "+d[0]+" "+(lens.value||"Chưa có lens phù hợp")+" · "+resolvedAperture()+(aperture.value==="auto"?" (AI tự đề xuất: "+suggestedAperture().reason+")":"")+". "+purpose()[3]+".";
   el("hgCamManual").hidden=mode.value==="auto";
   el("hgCamAuto").hidden=mode.value!=="auto";
   el("hgCamAuto").textContent="Gợi ý theo mục đích: "+purpose()[3]+". "+d[0]+" "+body.value+" · "+(lens.value||"Chưa có lens")+". Có thể chuyển MANUAL PRO để tùy chỉnh.";
 }
 [mode,style,lens,aperture,focus,lock,all].forEach(n=>n.addEventListener("change",()=>refresh()));
 brand.addEventListener("change",()=>refresh(true));
 body.addEventListener("change",()=>refresh(true));
 domain?.addEventListener("change",applyDomain);
 window.hgCameraAI={
  getSnapshot:()=>({mode:mode.value,style:style.value,brand:brand.value,body:body.value,lens:lens.value,aperture:aperture.value,resolvedAperture:resolvedAperture(),focus:focus.value,lock:lock.checked,showAll:all.checked}),
  restore(v){if(!v||typeof v!=="object")return;for(const [n,k] of [[mode,"mode"],[style,"style"],[brand,"brand"]])if(typeof v[k]==="string"&&[...n.options].some(o=>o.value===v[k]))n.value=v[k];refresh();for(const [n,k] of [[body,"body"],[lens,"lens"],[aperture,"aperture"],[focus,"focus"]])if(typeof v[k]==="string"&&[...n.options].some(o=>o.value===v[k]))n.value=v[k];lock.checked=v.lock!==false;all.checked=v.showAll===true;refresh()},
  setShotPriorities:keys=>updateShotSelection(keys),
  reset(){mode.value="auto";style.value="interior";brand.value="Sony";aperture.value="auto";focus.value="all";lock.checked=true;all.checked=false;refresh()},
  getPrompt(lang="vi"){
   if(droneMode())return body.value&&lens.value?(lang==="en"?"Aerial drone equipment: ":"Thiết bị flycam: ")+brand.value+" "+body.value+"; "+lens.value+".":"";
   const s=purpose(),d=current(),chosen=d[3].find(x=>x[0]===lens.value);
   if(!chosen)return "";
   const focusText={auto:"AI-selected subject focus",subject:"sharp main subject with softly blurred background",all:"deep focus across the scene"}[focus.value];
   const lockText=lock.checked?"Preserve original viewpoint, framing, geometry, vertical lines and furniture proportions.":"Adjust photographic viewpoint only if explicitly required; preserve architecture and furniture proportions.";
   const en="CAMERA AI V1.1: Photography purpose: "+({interior:"interior",architecture:"architecture",bokeh:"background bokeh",furniture:"furniture product",macro:"material macro",cinematic:"cinematic luxury"}[s[0]])+". Camera body: "+d[0]+" "+body.value+" ("+d[1]+" mount). Lens: "+d[0]+" "+lens.value+". Aperture target: "+resolvedAperture()+(aperture.value==="auto"?" (AI recommendation based on scene and focus)":"")+" (respect physical lens aperture limits). Focus: "+focusText+". "+lockText+" Optical rendering is a photographic simulation, not a claim of actual camera capture.";
   return lang==="en"?en:"THIẾT LẬP CAMERA AI V1.1 (mô phỏng nhiếp ảnh): "+s[1]+". Thân máy: "+d[0]+" "+body.value+" (ngàm "+d[1]+"). Ống kính: "+d[0]+" "+lens.value+". Khẩu độ mục tiêu: "+resolvedAperture()+(aperture.value==="auto"?" (AI tự đề xuất: "+suggestedAperture().reason+")":"")+" (giới hạn theo thông số thực của lens). Lấy nét: "+({auto:"AI tự chọn chủ thể",subject:"nét chủ thể, mờ hậu cảnh",all:"nét toàn bộ không gian"}[focus.value])+". "+(lock.checked?"Khóa góc nhìn, bố cục, hình học, đường đứng và tỷ lệ nội thất.":"Chỉ thay góc nhìn khi có yêu cầu; bảo toàn kiến trúc và tỷ lệ nội thất.")+" Đây là mô phỏng quang học, không phải ảnh chụp bằng thiết bị thật.";
  }
 };
 if(domain)applyDomain();else refresh();
}
