# Auditoria do frontend — DnDKeeper

Levantamento de tamanho de componentes, duplicação, tokens e arquitetura.
Base: `src/` (~11.000 linhas, 150+ arquivos). Data do levantamento: sessão atual.

## Resumo executivo

O projeto está **estruturalmente saudável**: atomic design respeitado, sem `fetch`
solto, sem hook fazendo auto-fetch com `useEffect`, sem atom importando de camada
acima. Nenhum componente é "gigante" de verdade — o maior tem 350 linhas.

Os problemas reais são de **consistência e reuso**, não de arquitetura quebrada:

| Severidade | Tema |
|---|---|
| 🔴 Alta | Helpers duplicados (URL do Drive ×3, % de HP ×3, cor de HP com escalas divergentes, data ×2) |
| 🟠 Média | Cores hex hardcoded fora do `@theme` (paletas "carta" e "conexões" inteiras); padrão "confirmar exclusão inline" reimplementado em 6 arquivos; `Button` com largura fixa forçando `w-auto!` em todo uso |
| 🟡 Baixa | Arquivos órfãos; `AuthGuard` acumula auth + layout; tipagem frouxa nos constants de árvore; lógica de filtro/estado inline em algumas páginas |

---

## 1. Componentes grandes

| Arquivo | Linhas | Diagnóstico |
|---|---|---|
| `constants/randomTables.ts` | 515 | ✅ só dados — ok |
| `components/organisms/connections/RightTree.tsx` | 350 | ⚠️ layout SVG recursivo + estado de highlight + medição. No limite; quebrar se crescer. |
| `components/organisms/map/MapToolbar.tsx` | 276 | ⚠️ muitos botões/modos numa lista só; extrair grupos (`RulerTools`, `DrawTools`). |
| `components/organisms/connections/DownTree.tsx` | 259 | ⚠️ irmão do RightTree; muita geometria repetida entre os dois (ver 2.8). |
| `pages/Map.tsx` | 251 | 🟡 7 `useState`, mas já delega 3 hooks (`useMapRuler/Interaction/Drawing`). O resto é carga de imagem — cabe um `useMapImage`. |
| `components/organisms/initiative/CombatantRow.tsx` | 240 | 🔴 faz muita coisa: `parseDriveUrl` local, cálculo de HP inline, estado de input de imagem, estado do modal de condição, botões de HP. Candidato nº1 a quebrar. |
| `components/organisms/character/CharacterCard.tsx` | 239 | 🟠 HP% inline, edição de HP inline, confirmação de exclusão inline. Mesmos sub-padrões do CombatantRow. |
| `pages/Npcs.tsx` | 190 | 🟡 busca + filtro + agrupamento por facção inline — cabe um `useNpcFilters`. |
| `hooks/useInitiative.ts` | 182 | 🟡 grande mas coeso (transformações puras + React Query). Aceitável; as puras (`withCombatant` etc.) poderiam ir para `utils/initiative.ts`. |

**Modelo do que fazer**: a refatoração recente de `pages/Table.tsx` (380 → 55 linhas,
side-effects em hooks genéricos, UI em `molecules/table` + `organisms/table`, HP
compartilhado em `HealthReadout`). Aplicar o mesmo tratamento em `CombatantRow` e
`CharacterCard`.

---

## 2. Duplicação de código

### 2.1 🔴 Parsing de URL do Google Drive — 3 implementações, 2 formatos de saída
| Local | Faz | Saída |
|---|---|---|
| `constants/arts.ts` → `resolveDriveUrl()` | `/file/d/{ID}` → thumbnail | `https://drive.google.com/thumbnail?id={ID}&sz=w800` |
| `services/googleDrive.ts` → `toImageUrl()` | monta a partir de `id` | `/drive-img?id={ID}&sz={size}` (proxy do Vite) |
| `components/organisms/initiative/CombatantRow.tsx` → `parseDriveUrl()` (local!) | `/d/{ID}` → proxy | `/drive-img?id={ID}&sz=w800` |

Dois formatos diferentes para a mesma coisa e uma cópia local escondida num componente.
**Ação**: um único `src/utils/driveUrl.ts` com `driveIdFromUrl(url)` + `driveThumbUrl(id, size)`
(sempre pelo proxy `/drive-img`). `resolveImageUrl` e o `NpcImagePicker`/`CombatantRow`
passam a usar isso.

### 2.2 🔴 Cálculo de percentual de HP — 3 cópias
- `components/organisms/character/CharacterCard.tsx:24` — `Math.round((currentHP / maxHP) * 100)`
- `components/organisms/initiative/CombatantRow.tsx:58` — `Math.round((hp / maxHp) * 100)`
- `utils/initiative.ts` → `combatantHpPercent()` — **criado na refatoração do Table, mas só o `/mesa` usa**

**Ação**: `CharacterCard` e `CombatantRow` passam a chamar um helper compartilhado
(`hpPercent(current, max)` em `utils/character.ts`, e `combatantHpPercent` reusa ele).

### 2.3 🔴 Cor da barra de HP — 2 escalas que não batem
- `utils/character.ts` → `resolveHpBarColor()` — quebra em **75 / 25**
- `components/organisms/initiative/CombatantRow.tsx:64` — cor inline, quebra em **50 / 25**, hex soltos (`#4ade80`, `#facc15`, `#D72334`)

O mesmo personagem aparece com cor de HP diferente em `/personagens` e `/iniciativa`.
**Ação**: `CombatantRow` usa `resolveHpBarColor`. Se as faixas 50/25 forem intencionais
para combate, então parametrizar (`resolveHpBarColor(pct, thresholds?)`), não duplicar.

### 2.4 🟠 Formatação de data — 2 cópias
- `components/molecules/npc/NpcDossierRow.tsx:19` → `fmtDate` local (`toLocaleDateString('pt-BR', …)`)
- `components/organisms/encounter/EncounterHistoryPanel.tsx:16` → outro formatador local (com "hoje")

**Ação**: `src/utils/time.ts` já existe (`formatRelativeTime`) — adicionar `formatDate(iso)` e
`formatDateTime(iso)` ali.

### 2.5 🟠 Mapa `status → cor` — 4+ definições descoordenadas
- `constants/npc.constants.ts` → `NPC_STATUS_COLOR` **e** `NPC_STATUS_STAMP_COLOR` (2 no mesmo arquivo)
- `components/organisms/connections/TreeNode.tsx` → 3 mapas locais (`NODE`, `BACKGROUND_COLOR`, …)
- `components/organisms/connections/TreeConnector.tsx` → mais um

Alguma variação é legítima (contextos visuais diferentes), mas nenhum usa token do
`@theme` e há hex repetido (`#7f1d1d` para "morto" em 2 lugares).
**Ação**: mínimo — centralizar por domínio (`connections.constants.ts` ganha seus mapas);
ideal — as cores base viram tokens.

### 2.6 🟠 "Confirmar exclusão inline" — reimplementado 6×
`LetterCard`, `LetterSeedReset`, `NpcDossierRow`, `CharacterCard`, `CombatantRow`,
`MapCalibrationModal` — todos com `useState(isConfirming…)` + botões "Sim/Não".
**Ação**: um `<ConfirmButton onConfirm label confirmLabel />` (atom/molecule) ou
`useConfirm()` hook. Remove ~15 linhas de cada um dos 6.

### 2.7 🟡 Mapeamento `Character → Combatant` / `Character → PartyMember`
`pages/Initiative.tsx:handleImportCharacters` e o import do `/encontro` fazem
transformações parecidas do mesmo `Character`.
**Ação**: `utils/character.ts` → `characterToCombatant(c)` e `characterToPartyMember(c)`.

### 2.8 🟡 Geometria de árvore repetida entre `RightTree` e `DownTree`
Cálculo de offsets/altura de subárvore aparece nos dois com sinais trocados.
**Ação**: `treeLayout.utils.ts` já existe — mover o que dá para lá; deixar nos
componentes só a orientação.

---

## 3. Design tokens / cores hardcoded

`@theme` no `index.css` tem a paleta principal (`red-*`, `black-*`, `white-*`, `yellow`,
`ink-*`, `bone-*`, `wax`, `brass`). Mas:

| Área | Situação |
|---|---|
| `components/organisms/connections/TreeNode.tsx` | **12** hex inline (paleta roxa de facção, fundos por status) |
| `components/molecules/letter/LetterCard.tsx` + `LetterViewModal.tsx` | **16** hex inline — paleta "pergaminho" (`#2c1506`, `#9b6b32`…) inteira fora do tema |
| `components/organisms/map/MapToolbar.tsx` + `MapSvgOverlay.tsx` | **10** hex inline |
| `components/organisms/initiative/CombatantRow.tsx` | 4 (as cores de HP do 2.3) |
| `components/organisms/character/CharacterCard.tsx:213` | `#ECC83B` cravado (é o token `yellow`) |

**Ação**: paleta "carta" e "conexões" viram grupos no `@theme` (`--color-parchment-*`,
`--color-tree-*`) ou pelo menos constantes de módulo. `#ECC83B` inline → `bg-yellow`.

---

## 4. Arquitetura

### Está bom ✅
- Camadas atomic respeitadas (nenhum atom importa molecule/organism)
- Sem `fetch()` direto — tudo via axios (`services/api.ts`, `services/backendApi.ts`)
- Hooks não fazem auto-fetch com `useEffect` (os `useEffect` em hooks são subscrições/timers legítimos: `useInitiativeStream`, `useTicker`, `useFullscreen`, `useCanvasInteraction`…)
- React Query aplicado de forma consistente em `useNpcs`, `useCharacters`, `useInitiative` (cache direto no `onSuccess`, sem invalidate/refetch desnecessário)
- Lógica de formulário isolada em hooks (`useNpcForm`, `useCharacterForm`, `useInitiativeAddForm`, `useAddRelationForm`) — modais só de UI
- Rotas como fonte única (`constants/routes.tsx`)

### A melhorar
| # | Item | Nota |
|---|---|---|
| 4.1 | `AuthGuard` faz **gate de auth + layout** (`<Sidebar/> + <main>`) | Separar em `<AppLayout>` (Sidebar + Outlet) e deixar `AuthGuard` só redirecionando. SRP. |
| 4.2 | `Button` (atom) tem `w-[280px]` cravado no `base` | Todo uso não-full-width precisa de `className="w-auto!"` (`Initiative.tsx` faz isso 3×). Largura não é responsabilidade do atom — tirar do `base`, quem quer 280px passa. |
| 4.3 | Constants de árvore com tipagem frouxa | `DownTree.tsx:75` — `FACTION_COLOR[tree.root.faction as keyof typeof FACTION_COLOR] ?? '#7c3aed'`. O `as` + fallback mágico indica que `faction` deveria ser tipado como `Faction`. |
| 4.4 | Estado/lógica inline em páginas | `Npcs.tsx` (busca/filtro/agrupamento) e `Map.tsx` (carga de imagem) — extrair `useNpcFilters` e `useMapImage`. |
| 4.5 | `index.html` aponta `/src/main.jsx`, arquivo real é `main.tsx` | Funciona por acaso no dev; corrigir para `main.tsx`. |
| 4.6 | Funções puras dentro de `constants/` | `getHealthBand` (novo) e os lookups pré-computados de `randomTables.ts` estão em `constants/`. Aceitável pelo padrão do projeto, mas `getHealthBand` é lógica — poderia ir para `utils/`. Consistência: decidir e documentar. |

---

## 5. Arquivos órfãos (definidos, nunca importados)

| Arquivo | Origem provável |
|---|---|
| `components/atoms/FactionBadge.tsx` | substituído no redesign de NPCs (agora usa `FACTION_COLOR` direto) |
| `components/atoms/StatusDot.tsx` | substituído por `NpcStatusStamp` no redesign |
| `components/atoms/icons/SkullIcon.tsx` | o usado é `SkullBadge` |

**Ação**: deletar os 3. (Confirmar com `grep -rn` antes.)

---

## 6. Plano priorizado

### P0 — barato, alto impacto (1 PR)
1. `utils/driveUrl.ts` — unifica os 3 parsers de URL do Drive (2.1)
2. `utils/character.ts` — `hpPercent()` compartilhado; `CombatantRow` e `CharacterCard` param de calcular inline (2.2, 2.3)
3. `utils/time.ts` — `formatDate()` / `formatDateTime()`; remove os 2 formatadores locais (2.4)
4. Deletar `FactionBadge`, `StatusDot`, `SkullIcon` (§5)
5. Tirar `w-[280px]` do `base` do `Button`; ajustar chamadas full-width (4.2)

### P1 — reuso (1–2 PRs)
6. `<ConfirmButton>` / `useConfirm()` — aplica nos 6 (2.6)
7. `useNpcFilters` — tira a lógica de `Npcs.tsx` (4.4)
8. Refatorar `CombatantRow` no molde do `Table` (extrair `useCombatantImageInput`, `CombatantHpControls`, usar `HealthReadout`) (§1)
9. `characterToCombatant` / `characterToPartyMember` em `utils/character.ts` (2.7)

### P2 — consistência visual / arquitetura
10. Tokenizar paletas "carta" e "conexões" no `@theme` (§3)
11. `<AppLayout>` separado do `AuthGuard` (4.1)
12. Consolidar mapas `status → cor` (2.5); tipar `faction` nos constants de árvore (4.3)

### P3 — só se crescer
13. Quebrar `RightTree`/`DownTree` (geometria comum → `treeLayout.utils`) e `MapToolbar` (grupos de ferramentas)

---

## 7. O que **não** é problema (não mexer)

- Tamanho geral do bundle/arquivos — está ok
- `randomTables.ts` com 515 linhas — é dado puro com lookups pré-computados, padrão documentado
- `useInitiative` com 182 linhas — coeso; as transformações puras justificam o tamanho
- Uso de React Query, padrão de modais, `constants/routes.tsx` — manter
