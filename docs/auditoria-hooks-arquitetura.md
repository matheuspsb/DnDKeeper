# Auditoria — Performance, Estado, Hooks e Arquitetura

Complementa `docs/auditoria-frontend.md` (que cobriu duplicação de helpers, tokens de
cor e já foi corrigida no P0). Esta aqui foca no que foi pedido depois: **performance,
gestão de estado, uso de hooks nativos (falta/excesso/modernos do React 19), abstrações
faltando e componentes que violam SOLID/Clean Code**. Baseada em leitura direta do
código — cada achado tem arquivo e trecho reais, não suposição.

---

## 1. Performance

### 1.1 ✅ Resolvido — `memo()` desperdiçado no `MapToolbar` por causa de handlers instáveis
`components/organisms/map/MapToolbar.tsx` é `memo()`, mas `setBrushColor`/
`setBrushSize` em `hooks/useMapDrawing.ts` eram **funções simples, não `useCallback`**
— recebiam uma identidade nova a cada render de `useMapDrawing()`, ou seja, a cada
render de `Map.tsx`. Como `TransformWrapper` chama `onTransform` a cada frame de
pan/zoom, `Map.tsx` re-renderizava continuamente durante a interação — e o `memo()`
do `MapToolbar` não segurava nada porque os props de função mudavam toda vez.
**Resolvido no P0-2**: `useLatestRef` + os setters do `useState` nativo (sem wrapper
customizado) tornaram `setBrushColor`/`setBrushSize` estáveis entre renders — o
`memo()` do `MapToolbar` agora segura de verdade durante pan/zoom.

### 1.2 ✅ Falso positivo corrigido — `key={index}` no `MapSvgOverlay`
Verificação mais de perto: `components/organisms/map/MapSvgOverlay.tsx:128` usa
`key={index}` no `points.map(...)` da **régua** (no máximo 2 pontos, ordem sempre
fixa — `points[0]`/`points[1]`), onde índice é apropriado. O loop de `drawnPaths`
(os traços do desenho, que têm `.id` estável) **já usa `key={path.id}`** corretamente
(linha 61). Não há nada a corrigir aqui — registrado só para não reabrir a dúvida.

### 1.3 ✅ Resolvido — debounce manual trocado por `useDeferredValue`
Ver §5.1.

### 1.4 🟡 Parcialmente aceito — Reflow em cascata no `Map.tsx` durante pan/zoom
`onTransform` atualiza `currentScale` a cada frame → `Map.tsx` re-renderiza →
`MapSvgOverlay` (que desenha réguas/desenhos com SVG, e recebe `currentScale`) também
recalcula em cada frame — isso é esperado e necessário enquanto a régua/overlay
realmente depender da escala (mesmo raciocínio do §1.5: é o piso pra manter a régua
correta durante o zoom). A parte que **era** um problema — o resto da árvore
(`MapToolbar`, `MapHintBar`) recalculando junto sem necessidade — foi resolvida pelo
§1.1: com `memo()` do `MapToolbar` funcionando de verdade, ele não re-renderiza mais
só porque `Map.tsx` re-renderizou por causa do `currentScale`. Resta só §2.2 (duplicar
`currentScale` como estado independente do `transformRef`) como possível redução
futura, sem urgência.

### 1.5 ✅ Resolvido (piso aceito) — `mousemove` sem throttle disparava re-render a cada pixel
`mousemove` em `/mapa` chamava `setMousePos` em `hooks/useMapInteraction.ts` sem
nenhum throttle, e `mousePos` chegava em `MapSvgOverlay` como objeto novo a cada vez
(o `memo()` não segura, porque a prop *de fato* muda). Mais amplo que o §1.4 (que só
cobria zoom/pan) — mousemove dispara bem mais que frames de pan/zoom. **Fix**:
`useMapInteraction` guarda a posição mais recente num `ref` a cada evento e só chama
`setMousePos` uma vez por `requestAnimationFrame`; `handleMouseLeave` cancela o frame
pendente e zera na hora.

Medido com uma instrumentação temporária de render (removida depois de confirmar o
achado): os commits de `Map`/`MapSvgOverlay` durante movimento contínuo do mouse
ficaram estáveis em ~7ms de intervalo — ou seja, o throttle por
`requestAnimationFrame` está funcionando exatamente como projetado, capando em **1
commit por frame**; o número absoluto (~144/s) só parece alto porque reflete uma tela
de alta taxa de atualização (144Hz). Isso é o **piso teórico** pra um cursor
acompanhando o mouse via `state` do React sem lag artificial — decisão tomada:
aceitar como está (não vale o trade-off de throttle adicional visível, nem a
reescrita pra atualização imperativa/DOM direto que eliminaria os renders por
completo). `tsc`/`build`/`lint`/testes limpos — `useMapInteraction.test.ts` cobre o
throttle (múltiplas chamadas antes do frame viram 1 só atualização, com a posição
mais recente) e o cancelamento no mouse-leave/unmount.

### 1.6 ✅ Resolvido — prop drilling / re-renders desnecessários em Conexões, NPCs e Iniciativa
Checagem completa do item pendente do P3 (abaixo). Três achados, um por cluster:

- **Conexões (`/conexoes`) — o mais sério**: mesmo bug do §1.5, em
  `hooks/useCanvasInteraction.ts`. `onMouseMove` chamava `setPan(...)` a cada evento
  de `mousemove` durante o drag do canvas, sem throttle — e como `RightTree`/
  `DownTree` não eram `memo()`, cada pixel de arraste re-renderizava **todas** as
  árvores de facção inteiras (nós, conectores, imagens). Fix: mesmo padrão RAF do
  §1.5 (acumula delta num `ref`, aplica via `setPan` uma vez por frame,
  `cancelAnimationFrame` no unmount) **+** `RightTree`/`DownTree` agora `memo()` —
  seguro porque `treeLayout.utils.ts#computeLayout` usa `.filter()` (preserva
  referência dos objetos `HierarchyTree`, não clona) e `wasJustClick` já era
  `useCallback([], [])` estável. `TreeDescendants` (render recursivo dos
  descendentes) **não** foi memoizado nesta rodada: `expandedIds`/`mountedIds` em
  `useTreeExpansion.ts` são `Set` que ganham referência nova a cada toggle
  (`new Set(prev)`), então um `memo()` ali não seguraria nada de verdade sem uma
  mudança maior (passar booleano por nó em vez de `Set`) — aceito como está, o
  custo remanescente (re-render de uma árvore ao expandir um nó) é muito menor que
  o problema original (re-render de todas as árvores a cada pixel de drag).
- **NPCs (dossiê, `/npcs`) — impacto médio-alto**: `expandedId` mora em
  `NpcContent.tsx`, compartilhado por todas as facções — expandir uma ficha
  re-renderizava o dossiê inteiro porque `Npcs.tsx` recriava `openEdit`/
  `handleDelete` a cada render (inline, sem `useCallback`) e `NpcContent.tsx`
  criava uma closure `() => toggle(npc.id)` nova por NPC dentro do `.map()`. Fix:
  `openAdd`/`openEdit`/`handleDelete` viraram `useCallback` em `Npcs.tsx`;
  `NpcContent.tsx` ganhou um `handleToggle` estável (`useCallback([], [])`) e passa
  `onToggle`/`onEdit`/`onDelete`/`onImageClick` direto pros filhos (sem wrapper por
  item); `NpcDossierRow.tsx` mudou a assinatura das props de callback pra receber
  `id`/`npc` como argumento (em vez de closure sem argumento) e virou `memo()`.
- **Iniciativa (`/iniciativa`) — impacto menor**: `CombatantRow` não era `memo()` e
  `Initiative.tsx` criava um `handleAdjustHp(combatant, delta)` inline — ajustar o
  HP de um combatente re-renderizava a grade inteira. Complicador: `useInitiative()`
  devolve **todas** as suas funções (`removeCombatant`, `adjustHp`, `setHp` etc.)
  novas a cada render, nenhuma em `useCallback` — então um `useCallback` ingênuo em
  `Initiative.tsx` que dependesse delas continuaria instável. Fix: mesmo padrão de
  `useLatestRef<T>` já usado em `useMapDrawing`/`useInitiativeStream` (§4.4) — guarda
  a versão mais recente de tudo numa ref e expõe 7 wrappers estáveis
  (`handleRemove`, `handleAdjustHp`, `handleSetHp`, `handleUpdateInitiative`,
  `handleSetConditions`, `handleSetImageUrl`, `handleToggleHpReveal`) com
  `useCallback([])`; `CombatantRow.tsx` mudou a assinatura das props pra receber
  `id` como primeiro argumento e virou `memo()`. Escopo deliberadamente restrito a
  `Initiative.tsx` — não mexeu na API pública de `useInitiative.ts`.

`tsc --noEmit`/`build`/`lint`/testes limpos. Teste novo
`useCanvasInteraction.test.ts` cobre o throttle por `requestAnimationFrame` (mesmo
formato do `useMapInteraction.test.ts` do §1.5); `CombatantRow.test.tsx` atualizado
pras novas assinaturas `(id, ...)`.

---

## 2. Estado

### 2.1 🟠 `pages/Map.tsx` concentra 4 grupos de estado não relacionados
Um único componente guarda estado de **popup de localização** (`selectedLocation`) e
ainda orquestra 4 hooks (`useMapImage`, `useMapRuler`, `useMapInteraction`,
`useMapDrawing`). Nenhum desses grupos depende do outro para existir — é estado
colocado por conveniência, não por coesão. (O grupo de **carregamento de imagem** que
vivia solto aqui já foi extraído pro `useMapImage` no P1-7 — a decomposição restante
é o "god component" do §6.3.)

### 2.2 🟡 Aceito, sem ação — estado derivado guardado como estado independente
`currentScale` em `hooks/useMapImage.ts` é atualizado via `onTransform` pra alimentar
`getCursor()` e o overlay — é o mesmo dado que já vive em
`transformRef.current.state.scale`, só que copiado pro `state` do React. Isso
**parece** duplicação evitável, mas não tem como não ser: `transformRef` é uma ref
imperativa (mudar `.current` não re-renderiza nada), e o app *precisa* re-renderizar
quando a escala muda (pra recalcular espessura de traço, raio de marcador etc. no
`MapSvgOverlay`). Copiar o valor de uma ref imperativa pra `state` é o jeito padrão de fazer a ponte
entre uma lib imperativa (react-zoom-pan-pinch) e o modelo de render do React — não é
um bug, é o preço de usar essa lib. Sem ação.

### 2.3 ✅ Resolvido — padrão "ref espelha state" reimplementado à mão
`hooks/useMapDrawing.ts` tinha um `useRef` + setter customizado manuais só pra
`endStroke` (um `useCallback` com deps `[]`) conseguir ler o valor **mais recente** de
`brushColor`/`brushSize` sem depender deles (o que recriaria a função a cada mudança
de cor). Substituído pelo hook genérico `useLatestRef<T>` (§4.4/P1-4), reaproveitável
em qualquer lugar que precise da mesma coisa — `brushColorRef`/`brushSizeRef` agora
são só `useLatestRef(brushColor)`/`useLatestRef(brushSize)`.

### 2.4 ✅ Bem feito: `useEncounter`, `useInitiative` (transforms puras)
Vale registrar o que está certo para não jogar fora no meio de uma refatoração:
`useEncounter.ts` tem um setter por ação, todos `useCallback`, resultado derivado num
único `useMemo` — modelo limpo. `useInitiative.ts` isola cada transição de estado em
funções puras (`withCombatant`, `withHpDelta`, `withHpValues`, ...) fora do hook —
fácil de testar isoladamente mesmo sem teste escrito hoje.

---

## 3. Hooks nativos — falta e excesso

### 3.1 ✅ Resolvido — falta de `useId()`/`htmlFor` em labels de formulário
`<label>` e `<input>`/`<select>`/`<textarea>` em `CharacterModal`, `CharacterImagePicker`,
`NpcModal`, `NpcImagePicker` e `LetterModal` (6 arquivos, ~20 pares) paravam no visual
— sem associação programática. **Fix**: `id`/`htmlFor` explícitos usando o mesmo nome
já passado pra `register(fieldName)` do React Hook Form (ou `registration.name` nos
dois `*ImagePicker`, que recebem a registration já pronta via prop). Optei por **não**
usar `useId()` como o achado original sugeria: essas modais renderizam uma instância
por vez (nunca duas simultâneas na tela), então um id literal como `id="name"` é
igualmente correto e mais simples de ler/rastrear do que gerar um id opaco — `useId()`
resolve colisão entre *múltiplas instâncias do mesmo componente na tela*, que não é o
caso aqui. `NpcImagePositionPicker` ficou de fora — o `<label>` ali é título de um
grupo de botões, não de um campo de formulário (não tem o que parear via `htmlFor`);
`CombatantHpEditor` já estava correto (`<input>` como filho direto do `<label>`,
associação implícita). `tsc`/`build`/`lint`/testes limpos.

### 3.2 ✅ Resolvido — sincronização entre abas em `useLocalStorageState`
`hooks/useLocalStorageState.ts` (usado por `useEncounterHistory`, `useMapRuler` e
`useMapDrawing`) não reagia a mudanças feitas em **outra aba** na mesma chave. **Fix**:
reescrito com `useSyncExternalStore` (exatamente o hook nativo que o achado original
pedia) — `subscribe` registra o listener nativo `storage` (dispara só em documentos
diferentes do que fez a escrita, nunca no próprio) e devolve a função de limpeza,
sem `useEffect` manual: `useSyncExternalStore` já cuida de inscrever no mount e
desinscrever no unmount sozinho. O valor em si vive num `useRef` **por instância do
hook** (não um cache module-level) — evita tanto o `useEffect` quanto o risco de
vazar estado entre testes que reusam a mesma chave; `set()` e o listener de `storage`
compartilham essa ref e o mesmo callback de notificação (`onStoreChange`, guardado
numa ref própria) pra avisar o React de recalcular o snapshot, seja a mudança local
ou de outra aba. `newValue: null` (chave removida) volta pro valor inicial; conteúdo
corrompido é ignorado mantendo o valor atual. `tsc`/`build`/`lint`/testes limpos — 5
casos novos em `useLocalStorageState.test.ts` cobrem sync, chave diferente ignorada,
remoção em outra aba, conteúdo corrompido e serializer customizado.

### 3.3 ✅ Resolvido — `useCallback` que não protegia nada
`handleCalibrateToggle`/`handleMeasureToggle` em `pages/Map.tsx` tinham `useCallback`
com `ruler.mode` nas deps — recriando a função exatamente quando ela mais
"precisaria" ser estável (a cada toggle de modo da régua). Como `MapToolbar` também
recebe `rulerMode`/`isCalibrated` como props (que mudam nesse exato momento), ele
re-renderizava de qualquer jeito — o `useCallback` não evitava nada, só sugeria uma
garantia de estabilidade que não existia. Virou função comum.

### 3.4 🟡 Aceito, sem ação — setters triviais em `useCallback` consumidos por handlers não memoizados
Em `useMapDrawing.ts`, `startStroke`/`addToStroke`/`endStroke` são `useCallback`, mas
em `Map.tsx` eles são chamados de dentro de `handleMouseDown`/`handleMouseMove`
(funções comuns, recriadas a cada render). Isso não é um problema de verdade: esses
handlers só são usados como `onMouseDown`/`onMouseMove` inline num `<div>` comum, nunca
passados como prop pra um componente `memo()` — recriar um handler de evento DOM a
cada render não tem custo perceptível (React só troca o listener, não causa
re-render). "Consertar" isso significaria memoizar `handleMouseDown`/`handleMouseMove`
só por notação, sem nenhum ganho real. Sem ação.

---

## 4. Componentes, utils e abstrações faltando

### 4.1 🔴 Árvore de hierarquia (`RightTree`/`DownTree`) sem recursão — o achado mais caro do projeto
`components/organisms/connections/RightTree.tsx` (350 linhas) renderiza **4 níveis
fixos** (L1→L2→L3→L4), cada um com um bloco quase idêntico de:
- 1 loop pra desenhar os `TreeConnector` daquele nível,
- 1 loop pra desenhar os `TreeNode` daquele nível,
- as mesmas condições `mountedIds.has(...)`, `expandedIds.has(...)`, `visibility`.

`DownTree.tsx` (259 linhas) repete a mesma receita, mas só até **L2** — ou seja, a
"mesma" árvore em orientações diferentes suporta profundidades diferentes hoje, por
acidente de implementação, não por design. Adicionar um 5º nível (ou dar profundidade
igual às duas orientações) significa copiar mais um bloco de ~40 linhas em cada
arquivo.

**Isso é o problema central de arquitetura do projeto**: uma árvore é um dado
recursivo, mas está sendo renderizada com repetição manual por nível — viola DRY,
Open/Closed (extensão = copy-paste) e dificulta consertar bug de um nível sem
esquecer o mesmo bug nos outros 3.

**Abstração que falta**: um componente recursivo único —
```tsx
function TreeLevel({ nodes, depth, parentX, parentY, expandedIds, mountedIds, onToggle, direction }) { ... }
```
que se auto-invoca para `node.children`, parametrizado por um array de
`{ radius, imageRadius, spacingY, fontSize }` por profundidade (dado, não código
repetido). `getChildY`/`getGrandchildY`/`getGreatGrandchildY`/`getLevel4Y` em
`RightTree.tsx` já são a mesma fórmula com nomes diferentes — viram uma função
`getLevelY(parentY, index, count, spacing)` única. `expandedIds`/`mountedIds` +
`toggleExpanded` (idênticos nos dois arquivos) viram um hook `useTreeExpansion()`.
Resultado esperado: os ~600 linhas de `RightTree.tsx` + `DownTree.tsx` somados
encolhem para uma fração disso, com profundidade ilimitada de graça.

### 4.2 ✅ Feito — hit-test do mapa extraído do componente de página
`pages/Map.tsx#handleMapClick` fazia o hit-test inline, misturado com o roteamento de
clique entre régua/desenho/popup. **Resolvido no P1-7**: `findLocationAt(coords,
MAP_LOCATIONS)` em `utils/mapLocations.ts` — testável sem montar o componente.

### 4.3 ✅ Feito — `useMapImage` extraído
`imageReady`, `imageError`, `imgSize`, `minScale`, `currentScale` + o `useEffect` que
centraliza a view quando a imagem carrega formavam uma unidade coesa ("carregar e
enquadrar a imagem do mapa") que morava solta em `Map.tsx`. **Resolvido no P1-7**:
`hooks/useMapImage.ts`.

### 4.4 ✅ Feito — `useLatestRef<T>` genérico
Generaliza o padrão do §2.3 (`brushColorRef`/`brushSizeRef`):
```ts
function useLatestRef<T>(value: T) {
  const ref = useRef(value)
  ref.current = value
  return ref
}
```
Sem `useEffect`, sem setter customizado — atribuição direta no corpo do render é
segura para esse uso (ler o valor mais recente dentro de um callback estável).
**Feito no P1-4/P0-2**, aplicado em `useMapDrawing` (§2.3) e reaproveitado depois em
`useInitiativeStream` (guarda o `shouldSkip` mais recente sem recriar o `EventSource`
a cada render, ver `docs/iniciativa-realtime.md`).

### 4.5 ✅ Feito — `useLocalStorageState<T>` genérico
`hooks/useLocalStorageState.ts`: `[value, setValue] = useLocalStorageState(key, initial, { serialize?, deserialize? })` — `setValue` aceita valor ou updater e persiste sozinho. Aplicado em
`useEncounterHistory`, na calibração de `useMapRuler` (com `serialize`/`deserialize`
customizados, já que aquele valor era guardado cru, não em JSON) e nos `paths` de
`useMapDrawing`. Os três perderam o `load`/`save`/`persist` manual. Reescrito com
`useSyncExternalStore` no P4-2 (§3.2) — os três ganharam sync entre abas de graça, por
usarem o hook compartilhado.

### 4.6 ✅ Resolvido — `useConfirm()` (não `<ConfirmButton>`)
`CharacterCardActions.tsx`, `NpcDossierRow.tsx`, `LetterCard.tsx` e
`LetterSeedReset.tsx` reimplementavam a mesma máquina de estados (`useState<boolean>`
+ "clique arma, clique de novo confirma ou cancela") com nomes ligeiramente
diferentes (`isConfirmingDelete`/`confirmingDelete`/`confirmDelete`/`confirm`).
**Fix**: `hooks/useConfirm.ts` — `{ armed, arm, disarm, confirm(action) }`, extrai só a
**lógica de estado**, não o JSX. Optei por hook, não `<ConfirmButton>`: os 4 usos têm
apresentações visuais bem diferentes (par de botões ícone, linha de texto
"remover? sim não", um único botão que arma no 1º clique e confirma no 2º, botões
`Button` cheios com texto de aviso) — um componente rígido não caberia nos 4 sem
customização pesada, e o ganho real (não duplicar o `useState` + a lógica de
arm/disarm/confirm) já vem só do hook. **`MapCalibrationModal.tsx` saiu da lista**: ao
reler o código, não é o mesmo padrão — é um modal de entrada de dados com
Cancelar/Confirmar sempre visíveis (sem estado de "armado"), não uma confirmação de
ação destrutiva; incluí-lo no audit anterior foi impreciso. `CombatantHpEditor.tsx`
segue de fora pelo mesmo motivo já registrado (formulário legítimo, não confirmação).
`tsc`/`build`/`lint`/testes limpos — `useConfirm.test.ts` cobre a lógica isolada;
`NpcDossierRow.test.tsx`, `LetterCard.test.tsx` e `LetterSeedReset.test.tsx` são novos
(não tinham teste antes) e cobrem o fluxo arm→confirm/cancel de cada um.

---

## 5. Hooks modernos do React 19 — onde encaixam de verdade

O projeto está em **React 19** mas usa só a API "React 18 e anterior"
(`useState`/`useEffect`/`useMemo`/`useCallback`/`useRef`). Nenhum uso de
`useOptimistic`, `useTransition`, `useDeferredValue`, `useActionState`,
`useFormStatus` ou `use()`. Nem todos se aplicam — indicando onde cada um realmente
ajudaria, sem forçar:

### 5.1 ✅ Feito — `useDeferredValue` na busca
`Npcs.tsx` (busca do dossiê) e o par `useSearchInput`/`useGlobalSearch` (`/search`)
agora usam `useDeferredValue` no valor usado pro filtro em vez de debounce manual:
input responde na hora, o React posterga o recálculo caro só quando necessário, e o
`useRef`/`setTimeout` manual saiu de `useSearchInput.ts`.

### 5.2 `useTransition` — operações em lote
"Importar personagens" (`addCombatants` em `Initiative.tsx`), "Enviar Tudo" no
histórico de encontro (`EncounterHistoryPanel`), e trocar de filtro/agrupamento no
dossiê de NPCs são atualizações que re-renderizam listas inteiras. Envolver o
`setState`/`mutate` correspondente em `startTransition` mantém a UI (cliques,
digitação) responsiva enquanto a lista grande recalcula.

### 5.3 `useOptimistic` — alternativa mais simples ao que `useInitiative` já faz na mão
`useInitiative.ts` implementa manualmente "atualiza a UI na hora, manda pro servidor
depois, reverte se falhar" via `queryClient.setQueryData` + `push.mutate` +
`scheduleFlush`. Isso é **legítimo** (é o padrão do React Query, uma lib de cache de
servidor) — não é um bug. Mas vale registrar que `useOptimistic` é a ferramenta que o
React passou a oferecer nativamente pra exatamente esse problema, pra quem não quiser
carregar uma lib de cache só por causa disso. Não é uma recomendação de trocar (React
Query já está bem empregado aqui, ver `useNpcs`/`useCharacters`), é uma nota de
conhecimento.

### 5.4 `useActionState`/`useFormStatus` — não se aplica, e está correto não usar
Todos os formulários usam **React Hook Form + Zod**, convenção documentada no
`CLAUDE.md` e seguida à risca (`useNpcForm`, `useCharacterForm`,
`useInitiativeAddForm`, `useAddRelationForm`). Trocar por `useActionState` seria
regressão — RHF já cobre validação, estado de campo e submit de forma mais rica do
que a API nativa de formulários. **Não mexer aqui.**

### 5.5 `use()` — baixa prioridade
Só compensaria se o projeto adotasse Suspense para dados assíncronos. Hoje os dados de
servidor passam por React Query (`isLoading`/`isError` explícitos), que é um padrão
igualmente válido e já consistente em todo o código. Não há necessidade concreta.

---

## 6. Arquitetura

### 6.1 ✅ Resolvido — `RightTree`/`DownTree` — ver §4.1 (é arquitetural, não só duplicação de código)

### 6.2 ✅ Resolvido — `AuthGuard` mistura duas responsabilidades
`components/organisms/AuthGuard.tsx` fazia **gate de autenticação** (`if (!user) return
<Navigate>`) **e** montava o **layout da aplicação** (`<Sidebar/>` +
`<main><Outlet/></main>`) — dois motivos de mudança diferentes. **Resolvido no P2-8**:
`<AppLayout>` (Sidebar + Outlet) separado por fora, `<AuthGuard>` só valida sessão e
delega o `<Outlet/>`.

### 6.3 🟠 `pages/Map.tsx` ainda é um "god component" de página
Coordena viewport, hit-test de localizações, roteamento de clique entre 3 modos
(régua, desenho, popup) e calcula cursor (`getCursor()`) — o carregamento de imagem já
saiu pro `useMapImage` (P1-7), mas o resto continua junto, ~200 linhas. Nenhum desses
pedaços depende essencialmente dos outros — dá pra extrair pro molde que
`pages/Table.tsx` já recebeu (380 → 55 linhas, ver `docs/iniciativa-realtime.md`).
**`Table.tsx` é hoje o melhor exemplo do projeto de composição fina — vale usar como
molde para `Map.tsx`.**

### 6.4 ✅ Resolvido — CLAUDE.md desatualizado sobre Conexões
O `CLAUDE.md` documentava `/arvore` com `NpcGraph`/`@xyflow/react` como o grafo de
Conexões, mas a rota real é `/conexoes` e a página usa `TreeView` + `FACTION_TREES`
(hierarquia estática de facção, SVG próprio) — `@xyflow/react` não é importado em
lugar nenhum de `src/` (dependência morta). **Resolvido no P2-9**: seção de Conexões
reescrita documentando `TreeView`/`FACTION_TREES` como o componente ativo e
`@xyflow/react` registrado como dependência morta, segura pra remover.

---

## 7. Complexidade alta / SOLID / Clean Code — ranking

| # | Arquivo | Linhas | Responsabilidades misturadas | Prioridade |
|---|---|---|---|---|
| 1 | ~~`RightTree.tsx` + `DownTree.tsx`~~ | ~~350 + 259~~ → 103 + 105 | ✅ resolvido — recursão via `TreeDescendants` compartilhado | ~~🔴 Alta~~ |
| 2 | `pages/Map.tsx` | ~200 | viewport, hit-test, roteamento de clique, cursor (carga de imagem já saiu — ver P1-7) | 🟠 Média |
| 3 | ~~`CombatantRow.tsx`~~ | ~~261~~ → 154 | ✅ resolvido — HP e condições viram `CombatantHpControls`/`CombatantConditions`; imagem vira `useCombatantImagePicker` | ~~🟠 Média~~ |
| 4 | ~~`CharacterCard.tsx`~~ | ~~238~~ → 123 | ✅ resolvido — ações (editar/excluir) e HP viram `CharacterCardActions`/`CharacterHpControls` | ~~🟡 Baixa-Média~~ |
| 5 | `useInitiative.ts` | 220 | query + mutation genérica + debounce/flush + mutation de spotlight, tudo num hook só | 🟡 Baixa (já bem fatorado em funções puras) |

`CombatantRow` e `CharacterCard` decompostos (ver P2-10) seguindo o precedente já
aberto por `CombatantHpEditor.tsx` (extraído do próprio `CombatantRow`) e por todo o
pacote `components/{molecules,organisms}/table/` extraído de `pages/Table.tsx`.

---

## 8. Plano priorizado

### P0 — maior redução de código, menor risco
1. ✅ **Feito** — `TreeDescendants` recursivo + `getSpreadPosition` único +
   `useTreeExpansion()` compartilhado colapsaram `RightTree.tsx`/`DownTree.tsx`
   de 609 para 398 linhas somadas (103 + 105 + 147 de componente recursivo
   compartilhado + 14 de geometria + 29 do hook de expansão). Toda posição foi
   verificada por equivalência algébrica com as fórmulas originais antes da
   troca; `tsc`/`build`/`lint` limpos. Preservado: profundidade assimétrica
   (RightTree permite drill-down manual até L2, DownTree só até L1; L3/L4
   sempre em cascata automática nos dois), o visual próprio da raiz do
   `DownTree` (o "?" com glow do mestre do culto não revelado, que não passou a
   usar `TreeNode`) e o suporte a `hideRoot` (não usado por nenhuma árvore hoje,
   mas preservado no tipo). Não verificado com screenshot ao vivo — a rota
   exige sessão (DM ou convidado) que não pude simular sem automação de DOM;
   pedir confirmação visual abrindo `/conexoes` e expandindo cada nível nas
   duas árvores.
2. ✅ **Feito** — `useLatestRef` + setters nativos do `useState` em
   `useMapDrawing.ts` destravaram o `memo()` do `MapToolbar` (ver commit
   "perf: stabilize brush setters...")

### P1 — abstrações reutilizáveis
4. ✅ **Feito** — `useLatestRef<T>` (§4.4) criado e aplicado em `useMapDrawing`
   (parte do P0-2)
5. ✅ **Feito** — `useLocalStorageState<T>` (§4.5): unifica `useEncounterHistory`,
   a calibração do mapa e os `paths` do desenho. `tsc`/`build`/`lint` limpos
6. ✅ **Feito** — `useDeferredValue` na busca (§5.1): `useSearchInput.ts`
   (`/search`) e o filtro do dossiê de NPCs (`Npcs.tsx`) não usam mais debounce
   manual — o input fica sempre imediato, só o recálculo da lista fica de
   baixa prioridade. `tsc`/`build`/`lint` limpos
7. ✅ **Feito** — `useMapImage` (§4.3) extrai `imageReady`/`imageError`/`imgSize`/
   `minScale`/`currentScale` + o `useEffect` de centralização de `Map.tsx` para
   `hooks/useMapImage.ts`; `findLocationAt` (§4.2) extrai o hit-test de
   `handleMapClick` para `utils/mapLocations.ts`. `Map.tsx` cai de 251 para
   ~200 linhas, sem mudar comportamento. `tsc`/`build`/`lint`/testes limpos —
   `useMapImage.test.ts` e `mapLocations.test.ts` cobrem os dois, incluindo o
   edge case de `handleImageLoad` disparar antes do `containerRef`/
   `transformRef` existirem (efeito não roda, `imageReady` continua `false`).

### P2 — arquitetura
8. ✅ **Feito** — `<AppLayout>` (Sidebar + `<Outlet/>`) separado de `<AuthGuard>`
   (§6.2): `AuthGuard` agora só valida sessão (`isLoading`/redirect) e devolve
   `<Outlet/>`; `App.tsx` aninha `<Route element={<AuthGuard />}><Route
   element={<AppLayout />}>...</Route></Route>`. Mesmo comportamento visual —
   spinner de loading continua sem sidebar, layout só aparece autenticado.
   `tsc`/`build`/`lint`/testes limpos — `AuthGuard.test.tsx` mocka `useAuth`
   para cobrir loading/redirect/passthrough; `AppLayout.test.tsx` mocka
   `Sidebar` pra testar só a composição própria do layout.
9. ✅ **Feito** — seção de Conexões no `CLAUDE.md` (§6.4) atualizada: documenta
   `TreeView`/`FACTION_TREES` como o componente ativo, `NpcGraph`/`@xyflow/react`
   registrado como dependência morta
10. ✅ **Feito** — `CombatantRow`/`CharacterCard` decompostos no molde do
    `Table.tsx`/`CombatantHpEditor` (§7):
    - `CombatantRow.tsx` (261→154 linhas): extraídos `CombatantHpControls.tsx`
      (label/barra + editor-ou-delta, dono do toggle de edição) e
      `CombatantConditions.tsx` (badges + botão + `ConditionModal`, autocontido
      — o modal é overlay `fixed`, então não importa em que ponto da árvore ele
      é montado). A entrada de URL de imagem virou hook
      `useCombatantImagePicker` em vez de componente: o botão-gatilho e a
      linha de input não são vizinhos no DOM (o botão mora na fileira de ícones
      do topo, a linha de input aparece abaixo), então só a lógica/estado saiu
      do componente — o JSX de cada pedacinho ficou onde estava, sem introduzir
      wrapper que quebrasse o layout flex existente.
    - `CharacterCard.tsx` (238→123 linhas): extraídos `CharacterCardActions.tsx`
      (editar + excluir com confirmação inline, hoje usando `useConfirm` —
      ver P4-5/§4.6) e `CharacterHpControls.tsx` (número editável + barra +
      botões de delta, dono do próprio `isEditingHp`). O bloco de XP ficou
      inline (é só leitura, sem estado — não há SRP a resolver ali).
    - `tsc --noEmit`/`build`/`lint`/testes limpos. Testes novos cobrem cada
      peça isoladamente (`CombatantHpControls.test.tsx`,
      `CombatantConditions.test.tsx`, `useCombatantImagePicker.test.ts`,
      `CharacterCardActions.test.tsx`, `CharacterHpControls.test.tsx`) mais um
      smoke/integração por componente pai (`CombatantRow.test.tsx`,
      `CharacterCard.test.tsx`) validando que a composição continua
      funcionando de ponta a ponta (clique no delta, no ícone de imagem, na
      confirmação de exclusão etc.).

### Backlog (do audit anterior)
1. ✅ **Feito** — `useNpcFilters` extraído de `Npcs.tsx`. `Npcs.tsx` (195
   linhas) tinha lógica de negócio (busca/filtro via `searchParams`,
   agrupamento por facção, texto `meta` com pluralização inline) misturada
   com estado de UI (modal de criação/edição, navegação do lightbox
   calculada numa IIFE dentro do `return`) e um ternário aninhado
   (`isLoading ? ... : isError ? ... : ...`, anti-padrão `no-nested-ternary`)
   — tudo no mesmo componente. Split em 3 hooks novos, mesmo padrão de
   `useSearchInput.ts`/`useGlobalSearch.ts` (busca via URL + helper de módulo
   pra matching):
   - `useNpcFilters.ts` — `query`/`statusFilter`/`filtered`/
     `groupedByFaction`/`hasActiveFilters`/`meta`, mais
     `setQuery`/`setStatusFilter`/`clearFilters`.
   - `useNpcModal.ts` — estado do modal de criação/edição
     (`isOpen`/`editingNpc`/`openAdd`/`openEdit`/`close`/`handleSave`),
     dono das mutations `useAddNpc`/`useUpdateNpc`.
   - `useNpcLightbox.ts` — navegação prev/next do lightbox, removendo a IIFE
     que calculava o índice ativo dentro do JSX.
   - `useNpcDelete()` — não virou arquivo próprio: ficou dentro de
     `useNpcs.ts`, mesmo padrão já usado em `useCharacters.ts`
     (`useAdjustCharacterHp`/`useAddCharacterXp` sentados ao lado dos hooks
     CRUD puros, não em arquivos separados). É a própria `useMutation` de
     exclusão — não existe mais um `useDeleteNpc` separado por baixo, porque
     não tinha nenhum outro consumidor além deste hook (diferente de
     `useAddNpc`/`useUpdateNpc`, usadas direto por `useNpcModal`); manter os
     dois só duplicava a mesma mutation atrás de duas funções. Sem `useState`
     próprio: `useMutation` já expõe `isError` reativo, então `error` é
     derivado direto disso e `handleDelete` é o próprio `mutate` (sem
     wrapper `async/try/catch`) — `mutate` já bate com a assinatura
     `(id: string) => void` que `NpcDossierRow` espera, e uma nova tentativa
     limpa o erro sozinha porque `mutate()` reseta o status da mutation pra
     `pending` antes de resolver de novo.

   `Npcs.tsx` ficou só como camada de composição chamando os 4 hooks; o
   ternário aninhado virou 3 blocos `{condição && <X/>}` independentes,
   mesmo idioma já usado em `NpcDossierControls`/`CombatantRow`/`NpcModal`.
   Interfaces de `NpcContent`/`NpcDossierRow`/`NpcDossierControls`/
   `NpcFactionChannel`/`NpcEmpty` não mudaram. `tsc --noEmit`/`build`/
   `lint`/testes limpos — `useNpcFilters.test.tsx`, `useNpcModal.test.tsx`,
   `useNpcLightbox.test.ts` e `useNpcs.test.tsx` (só `useNpcDelete`) novos
   cobrem filtro por texto/status, agrupamento por facção, pluralização do
   `meta`, criar vs. editar (POST vs. PATCH), navegação prev/next pulando
   NPCs sem imagem, e sucesso/falha/nova tentativa na exclusão.

### P3 — prop drilling e re-renders desnecessários
1. ✅ **Feito** — `mousemove` sem throttle em `/mapa` (§1.5).
2. ✅ **Feito** — Conexões, NPCs e Iniciativa checados e corrigidos (§1.6).

### P4 — itens de baixa prioridade / cosméticos
1. ✅ **Feito** — `id`/`htmlFor` em labels de formulário (§3.1): 6 arquivos,
   ~20 pares label+campo. `id` literal (mesmo nome do `register()`), não
   `useId()` — justificativa em §3.1.
2. ✅ **Feito** — sincronização entre abas em `useLocalStorageState` (§3.2):
   reescrito com `useSyncExternalStore` (sem `useEffect` manual) + evento
   nativo `storage`; valor guardado num `useRef` por instância do hook, não
   num cache module-level. Beneficia `useEncounterHistory`, `useMapRuler` e
   `useMapDrawing` de graça, por usarem o hook compartilhado.
3. ✅ **Feito** — `useCallback` que não protegia nada em `Map.tsx` (§3.3):
   `handleCalibrateToggle`/`handleMeasureToggle` viraram função comum.
4. 🟡 **Aceito, sem ação** — `currentScale` duplicado (§2.2) e setters em
   `useCallback` consumidos por handlers não memoizados (§3.4): ambos
   avaliados e considerados corretos como estão — sem mudança de código.
5. ✅ **Feito** — `useConfirm()` (§4.6, backlog do audit anterior): hook de
   estado extraído, aplicado em `CharacterCardActions`, `NpcDossierRow`,
   `LetterCard` e `LetterSeedReset`. `MapCalibrationModal` removido da lista
   por não ser o mesmo padrão (ver §4.6).

`tsc`/`build`/`lint`/testes limpos em todos os itens 1-3 e 5.

---

## 9. Testes automatizados — cobertura dos refactors deste documento

Todo item marcado ✅ **Feito** acima (P0-1, P0-2, P1-4, P1-5, P1-6) agora tem
suíte Vitest colocada ao lado do arquivo, cobrindo caso normal e edge case —
ver seção "Testes" do `CLAUDE.md` para o setup. Destaque:
- `useMapDrawing.test.ts` tem um teste de regressão dedicado que muda a cor/
  espessura do pincel **depois** de `startStroke` e **antes** de `endStroke`,
  provando que `useLatestRef` (P0-2/P1-4) captura o valor mais recente e não
  reintroduz o bug de closure obsoleta que quebrava o `memo()` do
  `MapToolbar`.
- `TreeDescendants.test.tsx` usa um harness com o `useTreeExpansion` real
  (não um dublê) para validar expand/collapse, `clickable: false`,
  `hideParentConnector` e o corte de recursão ao passar do último nível do
  array `levels` — o comportamento que unificou `RightTree`/`DownTree` (P0-1).
  `RightTree.test.tsx`/`DownTree.test.tsx` cobrem só o smoke de composição
  (raiz + primeiro nível) e as funções de span/largura, já que a recursão em
  si é responsabilidade do `TreeDescendants`.
- `useLocalStorageState.test.ts` cobre serializer customizado, JSON corrompido
  e `localStorage.setItem` lançando (modo privado/quota) sem quebrar o hook
  (P1-5).
- `useSearchInput.test.tsx` usa `waitFor` para confirmar que `query` (o valor
  `useDeferredValue`) só reflete o `inputValue` depois do React postergar o
  recálculo (P1-6).

Toda a suíte passa (`npm test`), junto com `npm run build` e `npm run lint`.

---

## O que está bom (não mexer)

- `useEncounter.ts`, `Table.tsx` + `components/{molecules,organisms}/table/` — modelo
  de composição fina a seguir
- React Query em `useNpcs`/`useCharacters`/`useInitiative` — padrão de cache
  consistente, sem invalidate/refetch desnecessário
- React Hook Form + Zod em todos os formulários — não trocar por `useActionState`
- Nenhum `fetch()` solto, nenhum atom importando de camada acima, hooks sem
  auto-fetch com `useEffect` — convenções do `CLAUDE.md` realmente seguidas
