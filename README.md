# FUTBOLYLICTS-AI — Quant Terminal

Proyecto Next.js 15 + React 19 + TypeScript. Interfaz responsive, API-Football real, probabilidades Poisson, comparación con cuotas prepartido y constructor de combinadas.

## Instalar

Requiere Node.js 20 o superior.

```bash
npm install
cp .env.example .env.local
# Edita .env.local y añade tu clave API_FOOTBALL_KEY
npm run dev
```

Abre http://localhost:3000. Para verificar compilación: `npm run build`.

## Despliegue en Render

Servicio Web Node, repositorio GitHub, Build Command `npm install && npm run build`, Start Command `npm run start`, variable de entorno `API_FOOTBALL_KEY` con tu clave real. Usa Node 20+ y configura un servicio de pago si tu volumen de consultas lo exige. Nunca publiques `.env.local`.

## Límites importantes

- Datos de partidos y cuotas se consultan realmente a API-Football, siempre que tu plan los cubra. Sin cuota disponible, no se genera pronóstico.
- La API no garantiza cobertura de todos los partidos, mercados o casas.
- La estimación usa promedios de goles de temporada y Poisson. **No es un modelo entrenado o calibrado históricamente**. No incluye ML L2, xG independiente, lesiones ni alineaciones en esta versión.
- El EV es **teórico** y muy sensible a errores de modelo; la puntuación de confianza 1–10 es una heurística de calidad de datos, no una tasa de acierto. Se limita a 8 hasta realizar calibración real.
- El cálculo de combinadas multiplica probabilidades y supone independencia entre partidos. No cubre dependencias sistémicas. El EV conservador resta 3,5 puntos porcentuales a cada selección, lo que **no equivale a una garantía estadística**.
- Para validación real de producción hacen falta almacenamiento histórico, backtesting temporal, calibración, monitorización, límites de consultas y controles de acceso. No se debe publicitar como herramienta con rentabilidad demostrada.
- El endpoint `/api/analyze` consume varias peticiones por encuentro; restringe su acceso y añade caché persistente/rate limiting antes de exponerlo públicamente.
