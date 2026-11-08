// Reglas de competiciones importadas y adaptadas del proyecto BTTS-LIGAS-HEALTH-RENDER.
// Se comprueban país y nombre conjuntamente para evitar confundir ligas homónimas.
export type FixtureLeague = { league:{name:string;country?:string|null;round?:string}; teams?:{home?:{name?:string};away?:{name?:string}} };
const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
type PreferredRule={league:RegExp;country:RegExp;score:number;label:string};
const CORE_PREFERRED: PreferredRule[] = [
  /* -------------------------
   * INGLATERRA
   * ---------------------- */

  {
    league: /^premier league$/,
    country: /england|inglaterra/,
    score: 100,
    label: "Premier League",
  },

  /* -------------------------
   * ESPAÑA
   * ---------------------- */

  {
    league:
      /^(la liga|laliga|laliga ea sports|primera division)$/,
    country: /spain|espana/,
    score: 100,
    label: "LaLiga",
  },

  {
    league:
      /^(segunda division|laliga hypermotion|la liga 2|segunda)$/,
    country: /spain|espana/,
    score: 98,
    label: "Segunda División",
  },

  /* -------------------------
   * ITALIA
   * ---------------------- */

  {
    league: /^serie a$/,
    country: /italy|italia/,
    score: 100,
    label: "Serie A",
  },

  /* -------------------------
   * ALEMANIA
   * ---------------------- */

  {
    league: /^bundesliga$/,
    country: /germany|alemania/,
    score: 100,
    label: "Bundesliga",
  },

  {
    league: /^2\.? bundesliga$/,
    country: /germany|alemania/,
    score: 97,
    label: "2. Bundesliga",
  },

  /* -------------------------
   * FRANCIA
   * ---------------------- */

  {
    league: /^ligue 1$/,
    country: /france|francia/,
    score: 100,
    label: "Ligue 1",
  },

  /* -------------------------
   * PAÍSES BAJOS
   * ---------------------- */

  {
    league: /^eredivisie$/,
    country: /netherlands|paises bajos/,
    score: 98,
    label: "Eredivisie",
  },

  {
    league: /^eerste divisie$/,
    country: /netherlands|paises bajos/,
    score: 96,
    label: "Eerste Divisie",
  },
];

const TRUSTED_SECONDARY: PreferredRule[] = [
  /* -------------------------
   * INGLATERRA
   * ---------------------- */

  {
    league: /^championship$/,
    country: /england|inglaterra/,
    score: 94,
    label: "Championship",
  },

  /* -------------------------
   * PORTUGAL
   * ---------------------- */

  {
    league: /^primeira liga$/,
    country: /portugal/,
    score: 94,
    label: "Primeira Liga",
  },

  /* -------------------------
   * FINLANDIA
   * ---------------------- */
  {
    league: /^veikkausliiga$/,
    country: /finland|finlandia/,
    score: 91,
    label: "Finlandia Veikkausliiga",
  },

  /* -------------------------
   * BRASIL SERIE B
   * ---------------------- */
  {
    league: /^(serie b|brasileirao serie b|brasileiro serie b)$/,
    country: /brazil|brasil/,
    score: 91,
    label: "Brasil Serie B",
  },

  /* -------------------------
   * BULGARIA
   * ---------------------- */
  {
    league: /^(first league|parva liga|efbet liga)$/,
    country: /bulgaria/,
    score: 89,
    label: "Bulgaria First League",
  },

  /* -------------------------
   * DINAMARCA
   * ---------------------- */
  {
    league: /^(superliga|superligaen|danish superliga)$/,
    country: /denmark|dinamarca/,
    score: 91,
    label: "Dinamarca Superliga",
  },

  /* -------------------------
   * ESCOCIA
   * ---------------------- */
  {
    league: /^(premiership|scottish premiership)$/,
    country: /scotland|escocia/,
    score: 92,
    label: "Scottish Premiership",
  },

  /* -------------------------
   * COLOMBIA
   * ---------------------- */
  {
    league: /^(primera a|categoria primera a|liga betplay dimayor)$/,
    country: /colombia/,
    score: 91,
    label: "Colombia Primera A",
  },

  /* -------------------------
   * CHILE
   * ---------------------- */
  {
    league: /^(primera division|primera division de chile|liga de primera)$/,
    country: /chile/,
    score: 91,
    label: "Chile Primera División",
  },

  /* -------------------------
   * ESTADOS UNIDOS
   * ---------------------- */

  {
    league:
      /major league soccer|^mls$/,
    country:
      /usa|united states|estados unidos/,
    score: 92,
    label: "MLS",
  },

  /* -------------------------
   * MÉXICO
   * ---------------------- */

  {
    league: /^liga mx$|liga mx/,
    country: /mexico/,
    score: 92,
    label: "Liga MX",
  },

  /* -------------------------
   * BRASIL
   * ---------------------- */

  {
    league: /^serie a$/,
    country: /brazil|brasil/,
    score: 92,
    label: "Brasil Serie A",
  },

  /* -------------------------
   * ARGENTINA
   * ---------------------- */

  {
    league:
      /^(primera division|liga profesional)$/,
    country: /argentina/,
    score: 91,
    label: "Argentina Primera",
  },

  /* -------------------------
   * CHINA
   * ---------------------- */

  {
    league:
      /^(chinese super league|super league)$/,
    country: /china/,
    score: 92,
    label: "Chinese Super League",
  },

  /* -------------------------
   * SUIZA
   * ---------------------- */

  {
    league:
      /^(swiss super league|super league)$/,
    country:
      /switzerland|suiza|suisse|schweiz/,
    score: 91,
    label: "Swiss Super League",
  },

  /* -------------------------
   * BOLIVIA
   * ---------------------- */

  {
    league:
      /^(division profesional|primera division)$/,
    country: /bolivia/,
    score: 90,
    label: "Bolivia División Profesional",
  },
];


const cups: Array<[RegExp,RegExp]> = [
[/copa del rey/i,/spain|espana/i],[/fa cup|efl cup|league cup/i,/england|inglaterra/i],
[/coppa italia/i,/italy|italia/i],[/dfb.pokal/i,/germany|alemania/i],
[/coupe de france/i,/france|francia/i],[/taca de portugal/i,/portugal/i],
[/knvb beker/i,/netherlands|paises bajos/i],[/copa do brasil/i,/brazil|brasil/i]
];
const uefa=[[/^(uefa )?champions league$/i,115],[/^(uefa )?europa league$/i,111],[/^(uefa )?(europa )?conference league$/i,107]] as const;
const banned=/\b(women|woman|ladies|femenino|femenina|youth|juvenil|academy|friendly|amistoso|amistosa|u-?1[6789]|u-?2[013])\b/i;
const reserves=/\b(reserves?|b team|team b|ii)\b|^jong\b/i;
export function leagueDecision(f:FixtureLeague){
 const name=normalize(f.league?.name||'');const country=normalize(f.league?.country||'');
 const all=[name,f.teams?.home?.name||'',f.teams?.away?.name||''].join(' ');
 if(banned.test(all))return {allowed:false,priority:0,label:'Excluida: juvenil, femenina o amistoso'};
 if(reserves.test(all)&&!(name==='eerste divisie'&&/netherlands|paises bajos/.test(country)))return {allowed:false,priority:0,label:'Excluida: filial'};
 for(const [rx,priority] of uefa)if(rx.test(name))return {allowed:true,priority,label:f.league.name};
 const rule=[...CORE_PREFERRED,...TRUSTED_SECONDARY].find(r=>r.league.test(name)&&r.country.test(country));
 if(rule)return {allowed:true,priority:rule.score,label:rule.label};
 if(!/qualifying|qualification|preliminary|prelim|pre.qualifying/i.test(f.league?.round||'')){
 for(const [rx,region] of cups)if(rx.test(name)&&region.test(country))return {allowed:true,priority:88,label:f.league.name};
 }
 return {allowed:false,priority:0,label:'Competición no incluida'};
}
