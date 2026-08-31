# Iniciativa em tempo real + Painel da Mesa (`/mesa`)

Estado da iniciativa saiu de **localStorage-only** para o **backend** (Postgres),
com **push ao vivo por SSE**. O notebook do mestre (`/iniciativa`) edita; o tablet
da mesa (`/mesa`, rota pública) só acompanha e atualiza sozinho.

```
┌── Mestre (/iniciativa) ───────────┐        ┌── Mesa (/mesa) — sem login ──┐
│ useInitiative (React Query)        │        │ useInitiative (só leitura)    │
│  edita → cache otimista            │        │ useInitiativeStream           │
│  → PUT /api/initiative (cookie DM) │        │  → EventSource (withCreds)    │
└───────────────┬───────────────────┘        └───────────────▲──────────────┘
                │ PUT                                          │ SSE push
        ┌───────▼──────────────────────────────────────────────┴──────┐
        │ Express (Render)                                            │
        │  GET  /api/initiative        → { state, version }   público │
        │  PUT  /api/initiative        → salva + broadcast    requireDm│
        │  GET  /api/initiative/stream → text/event-stream    público │
        │  Prisma: Initiative (1 linha id "main", state Json, version)│
        └───────────────────────────────────────────────────────────┘
```

## Backend — `rpg-system_backend`

| Arquivo | Papel |
|---|---|
| `prisma/schema.prisma` | model `Initiative` — linha única `id "main"`, `state Json`, `version Int`, `updatedAt`. Migration `20260831200626_add_initiative`. |
| `src/schemas/initiative.schema.ts` | zod do blob: `combatantSchema` (inclui `hpRevealed?`) + `initiativeStateSchema` (`combatants`, `currentIndex`, `round`) + `EMPTY_INITIATIVE_STATE` |
| `src/services/initiative.service.ts` | `get()` (upsert garante a linha) · `save(state)` (upsert + `version++` + broadcast) · `Set<Response>` de assinantes SSE + `broadcast()` |
| `src/controllers/initiative.controller.ts` | `getInitiative` · `putInitiative` (valida com zod) · `streamInitiative` (headers SSE, snapshot inicial, heartbeat 25s, `removeSubscriber` no `req 'close'`) |
| `src/routes/initiative.routes.ts` | `GET /` e `GET /stream` públicos · `PUT /` com `requireDm` — registrado em `src/routes/index.ts` sob `/api/initiative` |

- **Estado como blob `Json`** — mesmo formato do front, um escritor só (o mestre), `last-write-wins`. `version` incrementa a cada `save` (base para um guard 409 futuro).
- **Broadcast em memória** — 1 dyno na Render, não precisa Redis. `save()` serializa `{ state, version }` e faz `res.write("event: state\ndata: …\n\n")` para cada assinante.
- **SSE atrás de Cloudflare + Render** funciona: `Cache-Control: no-cache, no-transform`, `X-Accel-Buffering: no`, sem compressão. Frame inicial sai na hora.

## Frontend — `rpg-system`

### Rotas e entrada
- `/mesa` declarada em `src/App.tsx` **fora do `AuthGuard`** (ao lado de `/login`) — pública, sem sessão.
- `src/pages/Login.tsx` — botão **"Abrir painel da mesa"** vai direto para `/mesa`.

### `src/hooks/useInitiative.ts`
- **React Query** (`queryKey: ['initiative']`), `initialData` vem do `localStorage` (`dndkeeper_initiative_v2` — a chave antiga `dndkeeper_initiative` é apagada no load; o formato antigo era rejeitado pelo zod do backend).
- **`mutate(transform)`**: aplica a mudança no cache **na hora** (`setQueryData`, síncrono → chamadas em sequência compõem) + `saveLocal` + agenda **1 PUT com debounce de 500 ms** (`scheduleFlush`). Rajada de cliques = 1 requisição.
- `push` (`useMutation`): no `onSuccess` grava o estado do servidor no cache; expõe `saveFailed` (badge "Sem sincronizar" no `/iniciativa`).
- `refetchInterval: 30_000` + `refetchOnWindowFocus/Reconnect` como rede de segurança do SSE.
- API pública **inalterada** para os consumidores: `combatants`, `currentIndex`, `round`, `addCombatant`, `addCombatants`, `removeCombatant`, `adjustHp`, `updateInitiative`, `setConditions`, `setImageUrl`, `setHpRevealed`, `nextTurn`, `goToTop`, `reset`, `saveFailed`.

### `src/hooks/useInitiativeStream.ts`
- Abre `EventSource(`${VITE_BACKEND_URL}/api/initiative/stream`, { withCredentials: true })`, joga cada `event: state` no cache `['initiative']`.
- Retorna `{ connected, lastEventAt }`. Em `error` só marca `connected: false` (o `EventSource` reconecta e reenvia o estado; sem `invalidateQueries` para não gerar enxurrada de GET).
- Chamado **explicitamente** por `/iniciativa` e `/mesa` — não roda dentro de `useInitiative`.

### Esconder HP de monstro — por combatente
- `Combatant.hpRevealed?: boolean` (front `types/initiative.ts`, back `combatantSchema`). **Monstro nasce oculto**; PC sempre mostra HP real.
- `/iniciativa` → `CombatantRow` tem um botão de olho (só para `!isPlayer` com HP): 👁 amarelo = revelado · 👁‍🗨 apagado = oculto. Fia `setHpRevealed(id, !hpRevealed)`.
- `src/utils/initiative.ts` → `isCombatantHpHidden(c)` = `!c.isPlayer && !c.hpRevealed` (regra em um lugar só).
- Oculto no `/mesa`: mostra **faixa de saúde** no lugar do número/barra.

### Faixas de saúde — `src/constants/initiative.ts`
```ts
HEALTH_BANDS = [
  { minPercent: 100, label: 'Ileso',       color: '#22c55e' },
  { minPercent: 65,  label: 'Ferido',      color: '#a3e635' },
  { minPercent: 35,  label: 'Machucado',   color: '#ecc83b' },
  { minPercent: 1,   label: 'Cambaleante', color: '#d72334' },
  { minPercent: 0,   label: 'Caído',       color: '#9ca3af' },
]
getHealthBand(hpPercentage) // clampa 0–100 e faz .find(pct >= minPercent)
```
Tabela de dados — mexer numa faixa não toca na lógica.

## Painel da Mesa — `/mesa`

`src/pages/Table.tsx` é só composição (~55 linhas). Peças:

| Camada | Arquivo | O quê |
|---|---|---|
| page | `pages/Table.tsx` | orquestra hooks + monta os blocos |
| organism | `components/organisms/table/TablePanelHeader.tsx` | rodada (com "pop"), botão tela cheia, `LiveStatus` |
| organism | `components/organisms/table/CurrentTurnHero.tsx` | destaque do turno atual (retrato de fundo, nome, condições, HP) |
| organism | `components/organisms/table/InitiativeOrderList.tsx` | grade da ordem + auto-scroll do turno atual |
| organism | `components/organisms/table/CombatantOrderCard.tsx` | linha compacta (mapa `status → classe`) |
| molecule | `components/molecules/table/HealthReadout.tsx` | **compartilhado** herói/card: faixa · número+barra · só o tipo |
| molecule | `components/molecules/table/CombatantConditions.tsx` | chips de condição (`sm` / `lg`) |
| molecule | `components/molecules/table/CombatantAvatar.tsx` | miniatura (imagem ou inicial) |
| molecule | `components/molecules/table/LiveStatus.tsx` | bolinha "ao vivo / reconectando" + "atualizado há Xs" |
| molecule | `components/molecules/table/OfflineNotice.tsx` | faixa amarela de queda de conexão |
| molecule | `components/molecules/table/RoundFlash.tsx` | overlay "RODADA N" |
| molecule | `components/molecules/table/TableEmptyState.tsx` | "Combate não iniciado" |

### Hooks genéricos (extraídos da página)
| Hook | Uso aqui |
|---|---|
| `hooks/useTicker(ms)` | relógio de 1 s para "atualizado há Xs" |
| `hooks/useDelayedFlag(active, ms)` | mostra o `OfflineNotice` só após 4 s de queda (não pisca) |
| `hooks/useValueChangePulse(value, {durationMs, enabled})` | dispara o `RoundFlash` na virada de rodada (ignora mount, respeita reduced-motion) |
| `hooks/useFullscreen()` | `{ supported, active, toggle }` do botão de tela cheia |
| `hooks/useScrollIntoViewOnChange(key)` | ref que rola o item atual para o centro quando `currentIndex` muda |

### Utils
- `utils/initiative.ts` — `combatantHpPercent`, `isCombatantHpHidden`, `combatantKindLabel`
- `utils/time.ts` — `formatRelativeTime(deltaMs)`
- `utils/motion.ts` — `prefersReducedMotion()`

## Tela cheia / PWA (tablet)

Objetivo: sumir com a barra de URL do Chrome no tablet.

- **Botão "Tela cheia"** no cabeçalho do `/mesa` → `requestFullscreen()`. Só aparece se suportado.
- **`min-h-dvh`** no root do `/mesa` (mede a altura visível, desconta a barra dinamicamente).
- **Web App Manifest** — `public/manifest.webmanifest` (`display: standalone`, `start_url: /mesa`, `orientation: landscape`, cores `#17181c`, ícone `/logo.png` 1024²) + `<link rel="manifest">`, `apple-touch-icon`, `theme-color`, `mobile-web-app-capable`, `viewport-fit=cover` no `index.html`.
- **Recomendado**: "Adicionar à tela inicial" no Chrome do tablet → abre em `/mesa` modo app, **sem barra nenhuma**.

## Resiliência

- `localStorage` (`dndkeeper_initiative_v2`) = cache de carga fria + fallback offline. Se o backend cair no meio da sessão, o `/iniciativa` continua funcionando local e mostra "Sem sincronizar".
- `version` + `last-write-wins`. Guard de concorrência (409 para 2 abas do mestre) **ainda não** implementado.
- **Render free**: o dyno dorme após ~15 min. A conexão SSE aberta segura ele acordado durante o jogo. Aquecer abrindo `/iniciativa` ~5 min antes.

## Deploy

- **Backend**: garantir `npx prisma migrate deploy` no *build/release* da Render (o `package.json` **não** roda sozinho). Sem isso a tabela `Initiative` não existe em produção.
- **Frontend**: Vercel. `VITE_BACKEND_URL` = URL da Render. Render `CLIENT_URL` = origem exata da Vercel (sem barra no fim) — necessário para o CORS do SSE com cookie.
- Os dois repos precisam subir juntos para features que tocam o schema (ex.: `hpRevealed`) — sem o backend, o zod remove o campo no PUT.

## Checklist da sessão

1. Aquecer o dyno da Render (abrir `/iniciativa`) ~5 min antes.
2. Tablet em `/mesa` → confirmar "● ao vivo".
3. Tela cheia (botão) ou app instalado.
4. Dano de teste no `/iniciativa` → reflete no `/mesa` em <1 s.

## Pendências (Fase 3+)

- Retry automático do PUT com backoff + re-flush ao reconectar
- Guard de versão (409) contra edições concorrentes
- Presence: "N telas assistindo" no `/iniciativa`
- `render.yaml` com `preDeployCommand: npx prisma migrate deploy`
- Screen Wake Lock no `/mesa` (tela não apagar), som/vibração no turno de um jogador
