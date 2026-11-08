export type Selection={fixtureId:number;match:string;league:string;kickoff:string;market:string;odd:number|null;bookmaker:string;probability:number;fairOdd:number;ev:number|null;confidence:number;homeGoals:number;awayGoals:number;sample:number;status:'valor'|'exploratoria'|'sin_cuota';uncertainty:number};
export type Combo={items:Selection[];odd:number;probability:number;ev:number;confidence:number;robustEv:number;score:number;label:string};
export function poisson(k:number,lambda:number){let p=Math.exp(-lambda);for(let i=1;i<=k;i++)p*=lambda/i;return p}
export function markets(home:number,away:number){let h=0,d=0,a=0,btts=0,over05=0,over15=0,over25=0,under25=0,under35=0;for(let x=0;x<=14;x++)for(let y=0;y<=14;y++){const p=poisson(x,home)*poisson(y,away);if(x>y)h+=p;else if(x===y)d+=p;else a+=p;if(x&&y)btts+=p;if(x+y>=1)over05+=p;if(x+y>=2)over15+=p;if(x+y>=3)over25+=p;if(x+y<=2)under25+=p;if(x+y<=3)under35+=p}return {'1':h,'X':d,'2':a,'1X':h+d,'X2':d+a,'12':h+a,'BTTS Yes':btts,'BTTS No':1-btts,'Over 0.5':over05,'Over 1.5':over15,'Over 2.5':over25,'Under 2.5':under25,'Under 3.5':under35} as Record<string,number>}
const clamp=(x:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,x));
// Deliberately prefer a plausible chance of success over spectacular theoretical EV.
// EV is shown, but uncalibrated model EV cannot establish a profitable edge.
export function combinations(s:Selection[],max=12):Combo[]{
 const groups=new Map<number,Selection[]>();for(const x of s){if(x.odd===null||!Number.isFinite(x.odd)||x.odd<=1||x.probability<=0||x.probability>=1)continue;const g=groups.get(x.fixtureId)||[];g.push(x);groups.set(x.fixtureId,g)}
 const quality=(x:Selection)=>{const lower=clamp(x.probability-x.uncertainty,0,1);return Math.log(Math.max(lower,.000001))+.05*Math.log(Math.max(x.odd!,1))+.012*x.confidence};
 const ordered=[...groups.values()].map(g=>g.sort((a,b)=>quality(b)-quality(a)).slice(0,3)).sort((a,b)=>quality(b[0])-quality(a[0])).slice(0,40);
 type Beam={items:Selection[],odd:number,p:number,lower:number};let beam:Beam[]=[{items:[],odd:1,p:1,lower:1}];const out:Combo[]=[];
 for(const group of ordered){const next=[...beam];for(const b of beam)for(const x of group){if(b.items.length>=max)continue;const items=[...b.items,x],odd=b.odd*x.odd!,p=b.p*x.probability,lower=b.lower*clamp(x.probability-x.uncertainty,0,1);if(items.length>=2){const ev=p*odd-1,robustEv=lower*odd-1;const confidence=clamp(Math.min(...items.map(v=>v.confidence))-Math.max(0,items.length-2)*.3-Math.max(0,-Math.log10(Math.max(p,.0000001))-.5)*.9,1,10);
 // Rank by conservative success probability, data quality, and modest edge bonus.
 // Extreme low-probability combinations cannot outrank reasonable candidates by EV alone.
 const score=100*lower+2*confidence+Math.min(3,Math.max(-3,robustEv))*1.5-Math.max(0,items.length-3)*.8;
 out.push({items,odd,probability:p,ev,robustEv,confidence:Math.round(confidence*10)/10,score,label:p<.01?'Riesgo extremo · probabilidad inferior al 1%':robustEv>0?'Valor estimado bajo supuestos no calibrados':ev>0?'Valor teórico incierto':'Sin ventaja estimada'})}
 next.push({items,odd,p,lower})}beam=next.sort((a,b)=>b.lower-a.lower).slice(0,350)}
 const unique=new Map<string,Combo>();for(const c of out){const id=c.items.map(x=>x.fixtureId+':'+x.market).sort().join('|');if(!unique.has(id)||unique.get(id)!.score<c.score)unique.set(id,c)}return [...unique.values()].sort((a,b)=>b.score-a.score).slice(0,120)
}
