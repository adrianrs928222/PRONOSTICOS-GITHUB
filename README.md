# FUTBOLYLICTS-AI — Quant Elite V4

Aplicación Next.js para analizar partidos reales con API-Football. No se incluyen claves ni datos de ejemplo disfrazados de reales.

## Instalar y ejecutar

```bash
npm install
npm run dev
```

Crea `.env.local` (no subir a GitHub):

```env
API_FOOTBALL_KEY=tu_clave_privada
API_DAILY_BUDGET=85
MAX_FIXTURES_PER_SCAN=12
```

## Render

- Language: Node
- Build: `npm install && npm run build`
- Start: `npm run start`
- Environment: `API_FOOTBALL_KEY`, `API_DAILY_BUDGET=85`, `MAX_FIXTURES_PER_SCAN=12`, `NODE_ENV=production`

## Alcance real

- Fecha seleccionable; analiza hasta `MAX_FIXTURES_PER_SCAN` partidos programados de ese día.
- Estadísticas local/visitante, Poisson, 1X2, doble oportunidad, BTTS y totales.
- Consulta cuotas de API-Football solo si están disponibles para ese partido y plan. Si no, presenta estimaciones sin cuota y sin EV.
- Combinadas multiliga de 2–5 selecciones de partidos distintos, con cuota variable y clasificación por puntuación heurística.
- Diagnóstico de partidas sin estadísticas, sin cuotas y errores de proveedor.
- Caché en memoria por endpoint, deduplicación de peticiones concurrentes y presupuesto local de llamadas.

## Advertencias técnicas y de calidad

**No es un modelo calibrado ni auditado históricamente.** Las notas 1–10 son heurísticas, no tasas de acierto comprobadas. El valor esperado depende de que las probabilidades estén bien calibradas. Los partidos se consideran independientes entre sí para las combinadas, supuesto aproximado. El mejor precio entre casas puede no estar disponible en la misma casa para todas las selecciones. No hay garantías de rentabilidad.

**Límite API:** el presupuesto y la caché son **por instancia** y se reinician al reiniciar Render. No garantizan limitar globalmente las llamadas de API-Football. Para producción con tráfico real: almacenamiento compartido (Redis/Postgres), cuotas persistentes, autenticación/rate limiting del endpoint, caché compartida, métricas y monitorización de errores. El servicio gratuito puede dormir y reiniciarse.

**Cobertura:** API-Football puede no incluir cuotas o estadísticas para ciertas ligas, fechas o planes. El motor no inventa datos. Para fechas con más partidos de los que permite el límite, no los analiza todos. El orden de fixtures es el del proveedor.

## Verificación

El código se entrega para desplegar y probar con tu clave. No se ha realizado un backtest de precisión o rentabilidad, ni se ha comprobado el despliegue con una clave real.


## V4.1 Ranking completo
- Genera y ordena hasta 120 combinadas candidatas de 2 a 12 partidos diferentes.
- La primera posicion corresponde al mayor score ajustado a riesgo, no a la mayor cuota.
- Permite expandir el ranking completo desde la interfaz.
- No garantiza cuotas para partidos sin cobertura de odds en API-Football.
- La enumeracion es de candidatas calculadas, no de todas las combinaciones matematicamente posibles.


## V4.2: ligas importadas del proyecto BTTS-LIGAS-HEALTH-RENDER

Se han incorporado las reglas de competiciones principales y secundarias del archivo `lib/config/competitions.ts` del proyecto aportado, adaptadas a `src/lib/competitions.ts`. Incluyen UEFA, España, Inglaterra, Italia, Alemania, Francia, Países Bajos, Portugal, Finlandia, Bulgaria, Dinamarca, Escocia, Colombia, Chile, MLS, México, Brasil, Argentina, China, Suiza y Bolivia; copas nacionales seleccionadas. Las coincidencias se comprueban con el país para evitar confusiones. Se excluyen amistosos, juveniles y filiales (salvo Jong en Eerste Divisie).

El endpoint devuelve `diagnostics.eligible`, `diagnostics.excludedLeagues` y `eligibleFixtures`. Analiza primero las competiciones prioritarias; no promete cuotas donde la API no devuelve precios. `MAX_FIXTURES_PER_SCAN` admite 1-120, pero subirlo consume más llamadas; empieza por 12-20 con un plan pequeño.

No se ha incorporado la integración con The Odds API del proyecto de origen porque el usuario solo dispone de API-Football. Tampoco se han copiado módulos de ML sin entrenamiento ni credenciales.
