export type Node = {id:string;name:string;x:number;y:number;destination?:boolean};
export type Edge = {id:string;from:string;to:string;name:string;meters:number;steps:boolean;width:number|null;repairable?:boolean};
export const version='northbridge-synthetic-v1';
export const nodes:Node[]=[
 {id:'gate',name:'South entrance',x:130,y:490},{id:'plaza',name:'Arrival plaza',x:280,y:490},{id:'west',name:'West walk',x:280,y:310},{id:'north',name:'North courtyard',x:280,y:130},{id:'hub',name:'East terrace',x:510,y:310},{id:'upper',name:'Upper terrace',x:510,y:130},
 {id:'library',name:'Library',x:710,y:130,destination:true},{id:'science',name:'Science center',x:740,y:310,destination:true},{id:'arts',name:'Arts studios',x:510,y:490,destination:true},{id:'cafe',name:'Student café',x:110,y:310,destination:true},{id:'hall',name:'Assembly hall',x:100,y:130,destination:true},{id:'garden',name:'Learning garden',x:730,y:490,destination:true}];
export const edges:Edge[]=[
 {id:'arrival',from:'gate',to:'plaza',name:'Arrival path',meters:80,steps:false,width:180},
 {id:'west-walk',from:'plaza',to:'west',name:'West promenade',meters:110,steps:false,width:150},
 {id:'north-walk',from:'west',to:'north',name:'Courtyard walk',meters:120,steps:false,width:150},
 {id:'cafe-path',from:'west',to:'cafe',name:'Café entrance',meters:70,steps:false,width:110},
 {id:'hall-door',from:'north',to:'hall',name:'Assembly entrance',meters:85,steps:false,width:100},
 {id:'lift-b',from:'west',to:'hub',name:'Lift B',meters:95,steps:false,width:120,repairable:true},
 {id:'north-ramp',from:'north',to:'upper',name:'North ramp',meters:160,steps:false,width:100,repairable:true},
 {id:'terrace',from:'hub',to:'upper',name:'Terrace connection',meters:90,steps:false,width:130},
 {id:'library-path',from:'upper',to:'library',name:'Library approach',meters:85,steps:false,width:120},
 {id:'science-path',from:'hub',to:'science',name:'Science approach',meters:100,steps:false,width:140},
 {id:'arts-path',from:'plaza',to:'arts',name:'Arts approach',meters:100,steps:false,width:120},
 {id:'stairs',from:'arts',to:'hub',name:'Terrace stairs · 12 steps',meters:65,steps:true,width:150},
 {id:'garden-gate',from:'arts',to:'garden',name:'Garden gate',meters:110,steps:false,width:90,repairable:true},
 {id:'survey',from:'science',to:'garden',name:'East walk · width unverified',meters:100,steps:false,width:null}];
export const profiles={'step-free':{name:'Step-free',steps:false,width:90},'wide-chair':{name:'Wide wheelchair',steps:false,width:110},walking:{name:'Walking',steps:true,width:60}};
export type Profile=keyof typeof profiles;
export type Scenario={profile:Profile;origin:string;closed:string[]};
export const initialScenario:Scenario={profile:'step-free',origin:'gate',closed:['lift-b','north-ramp','garden-gate']};
export function validateScenario(value:unknown):Scenario{
 if(!value||typeof value!=='object')throw new Error('A scenario object is required.');const s=value as Scenario;
 if(!Object.hasOwn(profiles,s.profile))throw new Error('Unknown access profile.');
 if(!nodes.some(n=>n.id===s.origin))throw new Error('Unknown origin.');
 if(!Array.isArray(s.closed)||s.closed.length>edges.length||s.closed.some(id=>!edges.some(e=>e.id===id&&e.repairable)))throw new Error('Closures must reference repairable connections.');
 return {profile:s.profile,origin:s.origin,closed:[...new Set(s.closed)]};
}
export function exclusion(e:Edge,s:Scenario):string|null{
 if(s.closed.includes(e.id))return 'Reported unavailable';if(e.steps&&!profiles[s.profile].steps)return 'Steps are incompatible with this profile';
 if(e.width===null)return 'Width is unverified; excluded conservatively';if(e.width<profiles[s.profile].width)return `${e.width} cm width is below the ${profiles[s.profile].width} cm minimum`;return null;
}
export function routes(s:Scenario){
 const distance:Record<string,number>={},previous:Record<string,{node:string;edge:string}>={};const pending=new Set(nodes.map(n=>n.id));distance[s.origin]=0;
 while(pending.size){let current:string|undefined,best=Infinity;for(const id of pending)if((distance[id]??Infinity)<best){best=distance[id];current=id;}if(!current)break;pending.delete(current);
  for(const e of edges){if(exclusion(e,s))continue;const next=e.from===current?e.to:e.to===current?e.from:null;if(!next||!pending.has(next))continue;const candidate=best+e.meters;if(candidate<(distance[next]??Infinity)){distance[next]=candidate;previous[next]={node:current,edge:e.id};}}
 }
 return nodes.filter(n=>n.destination).map(n=>{const path:string[]=[];let cursor=n.id;while(previous[cursor]){path.unshift(previous[cursor].edge);cursor=previous[cursor].node;}return {id:n.id,name:n.name,reachable:distance[n.id]!==undefined,meters:distance[n.id]??null,path};});
}
export function analyze(input:Scenario){const start=performance.now(),s=validateScenario(input),destinations=routes(s),reachable=destinations.filter(d=>d.reachable).length;
 const repairs=s.closed.map(id=>{const edge=edges.find(e=>e.id===id)!,repaired={...s,closed:s.closed.filter(e=>e!==id)},after=routes(repaired),restored=after.filter(d=>d.reachable&&!destinations.find(b=>b.id===d.id)!.reachable);return {id,name:edge.name,gain:restored.length,restored:restored.map(d=>d.name),reachableAfter:after.filter(d=>d.reachable).length,stillExcluded:exclusion(edge,repaired)};}).sort((a,b)=>b.gain-a.gain||a.name.localeCompare(b.name));
 return {version,scenario:s,reachable,total:destinations.length,destinations,repairs,excluded:edges.flatMap(e=>{const reason=exclusion(e,s);return reason?[{id:e.id,name:e.name,reason}]:[];}),computeMs:Math.round((performance.now()-start)*100)/100};
}
export type Analysis=ReturnType<typeof analyze>;
