import type {Metadata} from 'next';
export const metadata:Metadata={title:'AccessCut — 72-second prototype demo',description:'Watch AccessCut compute accessible routes and compare single repairs in a real working prototype.'};
export default function Demo(){return <main style={{maxWidth:1100,padding:'40px 24px'}}>
 <a href="/" style={{color:'#24785a',fontWeight:700,textDecoration:'none'}}>← Open the interactive AccessCut prototype</a>
 <div className="eyebrow" style={{marginTop:35}}>PROTOTYPE WALKTHROUGH · ABOUT 72 SECONDS</div>
 <h1>One repair. More places within reach.</h1>
 <p style={{color:'#647480',lineHeight:1.7,marginBottom:24}}>A captioned recording of the working app: change the scenario, compare repairs, inspect routes, and export the evidence. No sign-in required.</p>
 <video controls playsInline preload="metadata" poster="/demo-poster.jpg" aria-label="AccessCut prototype walkthrough with on-screen captions" style={{width:'100%',borderRadius:12,background:'#173a31',border:'1px solid #dce3e7'}}><source src="/accesscut-demo.mp4" type="video/mp4"/>Your browser cannot play this video. <a href="/accesscut-demo.mp4">Download the MP4.</a></video>
 <div style={{display:'flex',flexWrap:'wrap',gap:12,margin:'20px 0 30px'}}><a className="button primary" href="/" style={{textDecoration:'none'}}>Try AccessCut</a><a className="button secondary" href="/accesscut-demo.mp4" download style={{textDecoration:'none'}}>Download video</a><a className="button secondary" href="https://github.com/AryanMashalkar/accesscut" style={{textDecoration:'none'}}>View source & tests</a></div>
 <section className="panel" style={{padding:24}}><h2>What the demo shows</h2><ol style={{paddingLeft:22,lineHeight:1.9,marginTop:14,color:'#536777'}}>
 <li>Three closures leave 3 of 6 destinations reachable for the step-free profile.</li>
 <li>Reopening Lift B restores the library and science center, raising access to 5 of 6.</li>
 <li>The repair list and route details explain the computed result.</li>
 <li>Applying the repair changes the simulated scenario.</li>
 <li>A wider wheelchair still cannot use a ramp narrower than its 110 cm minimum.</li>
 <li>Unverified widths remain excluded; the current analysis can be exported.</li>
 </ol><p style={{fontSize:14,color:'#647480',lineHeight:1.7,marginTop:15}}>Silent video with on-screen captions, recorded against the local production build. The campus is synthetic, and the interface is a planning demonstration—not real navigation guidance. The graph engine is checked against an independent shortest-path oracle across 288 scenarios.</p></section>
 </main>}
