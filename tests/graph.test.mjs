import {test} from 'node:test';
import assert from 'node:assert/strict';
import {analyze,nodes,edges,profiles,initialScenario,validateScenario} from '../lib/accesscut.ts';

// Independent Floyd-Warshall oracle: all origins, every closure subset, all profiles.
test('shortest routes and repair gains agree with an independent all-pairs oracle in 288 scenarios',()=>{
 const repairable=edges.filter(e=>e.repairable);
 for(const profile of Object.keys(profiles))for(let mask=0;mask<8;mask++){
  const closed=repairable.filter((_,i)=>mask&(1<<i)).map(e=>e.id),p=profiles[profile];
  const distances=nodes.map((a,i)=>nodes.map((b,j)=>i===j?0:Infinity));
  for(const e of edges){if(closed.includes(e.id)||e.width===null||e.width<p.width||(e.steps&&!p.steps))continue;const a=nodes.findIndex(n=>n.id===e.from),b=nodes.findIndex(n=>n.id===e.to);distances[a][b]=distances[b][a]=e.meters;}
  for(let k=0;k<nodes.length;k++)for(let i=0;i<nodes.length;i++)for(let j=0;j<nodes.length;j++)distances[i][j]=Math.min(distances[i][j],distances[i][k]+distances[k][j]);
  for(const [i,origin] of nodes.entries()){
   const s={profile,origin:origin.id,closed},result=analyze(s);
   for(const d of result.destinations){const expected=distances[i][nodes.findIndex(n=>n.id===d.id)];assert.equal(d.meters,Number.isFinite(expected)?expected:null);assert.equal(d.reachable,Number.isFinite(expected));if(d.reachable){let current=origin.id,total=0;for(const id of d.path){const e=edges.find(e=>e.id===id);assert.ok(e.from===current||e.to===current);assert.ok(!closed.includes(id));total+=e.meters;current=e.from===current?e.to:e.from;}assert.equal(current,d.id);assert.equal(total,d.meters);}}
   for(const repair of result.repairs){const after=analyze({...s,closed:closed.filter(id=>id!==repair.id)});assert.equal(repair.gain,after.reachable-result.reachable);assert.ok(repair.gain>=0);}
  }
 }
});
test('hero scenario restores two destinations with Lift B',()=>{const r=analyze(initialScenario);assert.equal(r.reachable,3);assert.equal(r.repairs[0].id,'lift-b');assert.equal(r.repairs[0].gain,2);assert.deepEqual(r.repairs[0].restored,['Library','Science center']);});
test('opening a narrow connection does not override wheelchair constraints',()=>{const r=analyze({...initialScenario,profile:'wide-chair'});assert.equal(r.repairs.find(r=>r.id==='north-ramp').gain,0);assert.match(r.repairs.find(r=>r.id==='garden-gate').stillExcluded,/110 cm/);});
test('unknown widths remain excluded when every closure is repaired',()=>{const r=analyze({...initialScenario,closed:[]});assert.ok(r.excluded.some(e=>e.id==='survey'));assert.equal(r.reachable,6);assert.deepEqual(r.repairs,[]);});
test('invalid scenarios fail explicitly and duplicate closures are normalized',()=>{for(const value of [null,{}, {...initialScenario,profile:'__proto__'}, {...initialScenario,origin:'missing'}, {...initialScenario,closed:['stairs']}])assert.throws(()=>validateScenario(value));assert.deepEqual(validateScenario({...initialScenario,closed:['lift-b','lift-b']}).closed,['lift-b']);});
