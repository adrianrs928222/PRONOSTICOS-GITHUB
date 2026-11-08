const ROOT='https://v3.football.api-sports.io';
const TTL:Record<string,number>={'/fixtures':1800,'/teams/statistics':43200,'/odds':1800,'/injuries':3600,'/fixtures/lineups':1200};
const cache=new Map<string,{expires:number,data:any}>();
const inflight=new Map<string,Promise<any>>();
const daily={day:'',used:0,failures:0,cacheHits:0};
function today(){return new Date().toISOString().slice(0,10)}
function reset(){if(daily.day!==today()){daily.day=today();daily.used=0;daily.failures=0;daily.cacheHits=0}}
export function apiUsage(){reset();return {...daily,budget:Number(process.env.API_DAILY_BUDGET||85),note:'Contador por instancia. Para límites globales entre reinicios/réplicas se necesita almacenamiento persistente.'}}
export async function football(path:string,params:Record<string,string|number>={}){
 reset();const key=process.env.API_FOOTBALL_KEY;if(!key||key==='replace_with_your_api_sports_key')throw Error('Falta API_FOOTBALL_KEY en Render');
 const u=new URL(ROOT+path);for(const [k,v] of Object.entries(params))u.searchParams.set(k,String(v));const id=u.toString();
 const hit=cache.get(id);if(hit&&hit.expires>Date.now()){daily.cacheHits++;return hit.data}
 if(inflight.has(id)){daily.cacheHits++;return inflight.get(id)!}
 const budget=Number(process.env.API_DAILY_BUDGET||85);if(daily.used>=budget)throw Error('Presupuesto local de llamadas agotado; espera al siguiente día UTC o revisa API_DAILY_BUDGET');
 const task=(async()=>{daily.used++;try{const res=await fetch(u,{headers:{'x-apisports-key':key},cache:'no-store',signal:AbortSignal.timeout(14000)});if(!res.ok)throw Error('API-Football HTTP '+res.status);const json=await res.json();if(json.errors&&Object.keys(json.errors).length)throw Error('API-Football: '+JSON.stringify(json.errors));const data=json.response;cache.set(id,{data,expires:Date.now()+(TTL[path]||1800)*1000});if(cache.size>1500){const first=cache.keys().next().value;if(first)cache.delete(first)}return data}catch(e){daily.failures++;throw e}finally{inflight.delete(id)}})();inflight.set(id,task);return task;
}
