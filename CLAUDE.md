# DnDKeeper

Ferramenta web para auxiliar o mestre na gestão de campanhas de D&D. Permite organizar sons, artes, personagens e iniciativa durante as sessões. Projetada para ser acessada pelo mestre e pelos jogadores em produção.

## Stack

| Tecnologia | Versão | Detalhe |
|---|---|---|
| React | 19 | com StrictMode |
| Vite | 8 | bundler + dev server |
| TypeScript | 6 | strict mode ativado |
| Tailwind CSS | v4 | via `@tailwindcss/vite`, sem `tailwind.config.js` |
| React Router | v7 | com `BrowserRouter` no `main.tsx` |
| Axios | 1.15.0 | versão segura (1.14.1 e 0.30.4 foram comprometidas em supply chain attack) |
| React Hook Form | 7 | formulários com validação — sempre com `zodResolver` |
| Zod | 4 | schemas de validação em `src/schemas/` |
| @hookform/resolvers | 5 | ponte entre RHF e Zod |
| @tanstack/react-query | 5 | cache de estado de servidor — usado para dados que vêm do backend (NPCs, personagens, iniciativa) |

`@xyflow/react` está no `package.json` mas **não é importado em lugar nenhum de `src/`** — dependência morta, sobra do antigo grafo de relações entre NPCs (`NpcGraph`), removido junto com a migração de Conexões para `TreeView` (ver seção "Conexões" abaixo). Seguro remover com `npm remove @xyflow/react`.

## Linguagem

**Todo arquivo novo deve ser `.ts` ou `.tsx`. Nunca criar `.js` ou `.jsx`.**

## Estrutura do projeto

```
src/
├── assets/
│   ├── logo.png
│   └── arts/                               # Imagens locais de personagens
│       ├── 1_dante.jpeg
│       ├── 1_samael.jpeg
│       ├── 3_buff.jpeg
│       └── 4_boff.jpeg
│
├── components/                             # Atomic Design
│   ├── atoms/                              # Primitivos sem dependência de outros componentes
│   │   ├── Button.tsx                      # Botão de texto: variantes primary/secondary, size md/sm, prop fullWidth
│   │   ├── CloseButton.tsx                 # Botão de fechar (X) padrão de modais/popups — prop tone (default/parchment), size
│   │   ├── IconButton.tsx                  # Botão quadrado para ícones, com prop active
│   │   ├── Input.tsx                       # Input de texto reutilizável — prop error troca borda para red-200
│   │   ├── NpcStatusStamp.tsx              # "Carimbo" de status do NPC (dossiê) — ver seção "NPCs"
│   │   ├── SelectArrow.tsx                 # Seta customizada para selects (appearance-none + SVG absoluto)
│   │   ├── TypeBadge.tsx                   # Badge PC / Monstro para combatentes
│   │   └── icons/                          # SVGs como componentes — props: size, className, strokeWidth
│   │       ├── ChevronLeftIcon.tsx
│   │       ├── ChevronRightIcon.tsx
│   │       ├── DiceIcon.tsx
│   │       ├── ExpandIcon.tsx
│   │       ├── EyeIcon.tsx
│   │       ├── EyeOffIcon.tsx
│   │       ├── ImageIcon.tsx
│   │       ├── LogOutIcon.tsx
│   │       ├── MapIcon.tsx
│   │       ├── MaskIcon.tsx                # Máscara teatral — ícone de NPC
│   │       ├── MusicIcon.tsx
│   │       ├── NetworkIcon.tsx             # Grafo de rede — ícone de Conexões
│   │       ├── PencilIcon.tsx
│   │       ├── PlusIcon.tsx
│   │       ├── RefreshIcon.tsx
│   │       ├── ScrollIcon.tsx
│   │       ├── SearchIcon.tsx              # Lupa — ícone de busca
│   │       ├── StarIcon.tsx
│   │       ├── SwordsIcon.tsx
│   │       ├── TrashIcon.tsx
│   │       ├── UsersIcon.tsx
│   │       └── XIcon.tsx
│   │
│   ├── molecules/                          # Combinações de atoms com lógica de apresentação simples
│   │   ├── characters/
│   │   │   ├── CharactersEmpty.tsx         # Estado vazio da página de personagens — com ações
│   │   │   └── GroupHpBar.tsx              # Barra de HP total do grupo — recebe totalHP, totalMaxHP, percentage
│   │   ├── encounter/
│   │   │   ├── DifficultyMeter.tsx         # Medidor de dificuldade do encontro — zonas coloridas + animação de partículas
│   │   │   └── StatCard.tsx                # Card de stat genérico — label, value, sub opcional
│   │   ├── gallery/
│   │   │   ├── GalleryEmpty.tsx            # Estado vazio genérico com ícone e mensagem
│   │   │   └── ImageCard.tsx               # Card de imagem com hover, blur e ícone de expandir
│   │   ├── initiative/
│   │   │   ├── ConditionBadge.tsx          # Badge âmbar de condição de combate (D&D 5e)
│   │   │   ├── InitiativeBadge.tsx         # Badge de iniciativa editável inline (clique para editar)
│   │   │   └── InitiativeEmpty.tsx         # Estado vazio da página de iniciativa
│   │   ├── npc/                            # Dossiê de NPCs — ver seção "NPCs"
│   │   │   ├── NpcContent.tsx              # Lista os NpcFactionChannel; estado vazio e "sem resultado" do filtro
│   │   │   ├── NpcDossierControls.tsx      # Busca (nome/facção/ficha) + filtro de status + "Limpar"
│   │   │   ├── NpcDossierRow.tsx           # Linha do dossiê — expande/recolhe pra ficha completa
│   │   │   ├── NpcEmpty.tsx                # Estado vazio da página de NPCs — com ação
│   │   │   └── NpcFactionChannel.tsx       # Agrupamento por facção com header, cor e contagem
│   │   ├── search/
│   │   │   ├── CharacterResult.tsx         # Linha de resultado de personagem na busca global — memoizado
│   │   │   ├── NpcResult.tsx               # Linha de resultado de NPC na busca global — memoizado
│   │   │   └── ResultSection.tsx           # Seção com título, contagem e lista de resultados
│   │   ├── MapHintBar.tsx                  # Barra de dicas do mapa
│   │   └── RandomTableCard.tsx             # Card de tabela aleatória — memoizado, onRoll estável via memo+useCallback
│   │
│   └── organisms/                          # Blocos complexos com estado ou múltiplas responsabilidades
│       ├── character/
│       │   ├── CharacterCard.tsx           # Card de personagem — composição: retrato, ações, HP, XP, notas
│       │   ├── CharacterCardActions.tsx    # Botões editar/remover do card — confirmação de exclusão própria
│       │   ├── CharacterHpControls.tsx     # HP do card — número editável inline, barra, botões de delta
│       │   ├── CharacterImagePicker.tsx    # Seletor de imagem para personagens — thumbnails LOCAL_ARTS + input de URL
│       │   ├── CharacterModal.tsx          # Modal de criação/edição de personagem — usa useCharacterForm
│       │   └── CharacterModalHeader.tsx    # Cabeçalho do CharacterModal com título e botão fechar
│       ├── connections/                    # Árvore de hierarquia de facção (SVG) — ver seção "Conexões"
│       │   ├── DownTree.tsx                # Árvore orientada pra baixo (ex.: Culto do Dragão) — raiz com visual próprio
│       │   ├── NodeImage.tsx               # Imagem circular recortada (clipPath) dentro de um TreeNode
│       │   ├── RightTree.tsx               # Árvore orientada pra direita (ex.: Harpers)
│       │   ├── TreeChevron.tsx             # Seta de expandir/recolher de um TreeNode
│       │   ├── TreeConnector.tsx           # Linha curva entre dois nós, colorida por status
│       │   ├── TreeDescendants.tsx         # Render recursivo dos descendentes — compartilhado por RightTree/DownTree
│       │   ├── TreeFilters.tsx             # Filtros SVG (glow, grayscale) compartilhados via <defs>
│       │   ├── TreeNode.tsx                # Nó circular — imagem, nome, status, chevron de expandir
│       │   ├── TreeView.tsx                # Componente de topo — canvas com pan/zoom, monta as árvores
│       │   └── treeLayout.utils.ts         # computeLayout — offsets das árvores no canvas
│       ├── encounter/
│       │   ├── EncounterHistoryPanel.tsx   # Histórico de snapshots de combate — envio de XP por encontro ou em lote
│       │   ├── EncounterMonstersPanel.tsx  # Painel de monstros do encontro — nome, CR, quantidade
│       │   ├── EncounterPartyPanel.tsx     # Painel de membros do grupo — nome e nível, importação de personagens
│       │   └── EncounterResultPanel.tsx    # Resultado do encontro — dificuldade, XP total, XP por jogador
│       ├── initiative/
│       │   ├── CombatantConditions.tsx     # Badges de condições ativas + botão que abre o ConditionModal — autocontido
│       │   ├── CombatantHpControls.tsx     # HP do combatente — label/barra + editor (CombatantHpEditor) ou botões de delta
│       │   ├── CombatantHpEditor.tsx       # Formulário de edição de HP atual/máximo (usado por CombatantHpControls)
│       │   ├── CombatantRow.tsx            # Card de combatente — só composição: imagem, iniciativa, ações, delega HP/condições/imagem
│       │   ├── ConditionModal.tsx          # Modal de seleção de condições D&D 5e — grid de 15 condições em PT
│       │   └── InitiativeAddForm.tsx       # Formulário de adição de combatente — usa useInitiativeAddForm
│       ├── map/
│       │   ├── MapCalibrationModal.tsx     # Modal de calibração da régua do mapa
│       │   ├── MapSvgOverlay.tsx           # Overlay SVG do mapa — linhas de régua
│       │   └── MapToolbar.tsx              # Toolbar do mapa — ferramentas de interação
│       ├── npc/
│       │   ├── NpcImagePicker.tsx          # Seletor de imagem para NPCs — thumbnails LOCAL_ARTS + input de URL
│       │   ├── NpcImagePositionPicker.tsx  # Seletor de posição da imagem do NPC (top/center/bottom)
│       │   ├── NpcModal.tsx                # Modal de criação/edição de NPC — usa useNpcForm
│       │   └── NpcModalHeader.tsx          # Cabeçalho do NpcModal com título (isEditing) e botão fechar
│       ├── AppLayout.tsx                   # Layout da aplicação — Sidebar + <Outlet/>, sem lógica de autenticação
│       ├── AuthGuard.tsx                   # Guarda de autenticação — só valida sessão e redireciona para /login; não monta layout
│       ├── Lightbox.tsx                    # Modal de imagem expandida — navegação por clique e teclado (←→ Esc)
│       └── Sidebar.tsx                     # Navegação lateral colapsável — logo, /search, rotas e logout
│
├── constants/
│   ├── arts.ts                             # LOCAL_ARTS (import.meta.glob), resolveImageUrl, toLocalArtUrl
│   ├── character.ts                        # HP_DELTA_OPTIONS — deltas dos botões de ajuste de HP
│   ├── dnd.ts                              # XP_THRESHOLDS, getLevel, getXpProgress
│   ├── encounter.ts                        # CR_XP, THRESHOLDS_PER_LEVEL, DIFFICULTY_LABEL/COLOR/BG/ORDER, getEncounterMultiplier
│   ├── initiative.ts                       # HP_DELTAS + CONDITIONS (15 condições D&D 5e em PT) + type Condition
│   ├── npc.constants.ts                    # FACTIONS, NPC_STATUS_LABEL/COLOR, FACTION_COLOR, FACTION_IMAGE, RELATION_TYPE_LABEL/COLOR
│   ├── randomTables.ts                     # RANDOM_TABLES + TABLE_CATEGORIES, TABLES_BY_CATEGORY, TABLES_BY_ID
│   └── routes.tsx                          # Fonte única das rotas: id, path, label, icon, element, dmOnly
│
├── contexts/
│   └── AuthContext.tsx                     # Autenticação — user (role: dm | guest), login, logout
│
├── hooks/
│   ├── useCharacterForm.ts                 # Lógica de formulário do CharacterModal — RHF + Zod
│   ├── useCharacters.ts                    # CRUD de personagens via `backendApi` (`/api/characters`) — async, sem localStorage
│   ├── useCombatantImagePicker.ts          # Estado do input inline de URL de imagem do CombatantRow (abrir/valor/confirmar)
│   ├── useDriveImages.ts                   # Retorna { images, loading, error, sync } — sem auto-fetch
│   ├── useEncounter.ts                     # Estado do calculador — party, monsters, result (useMemo)
│   ├── useEncounterHistory.ts              # Snapshots de encontro com persistência em localStorage
│   ├── useGlobalSearch.ts                  # Filtra NPCs e personagens por query — resultado dentro de useMemo
│   ├── useInitiative.ts                    # Estado da iniciativa via backend (`/api/initiative`, React Query) + cache local; ver docs/iniciativa-realtime.md
│   ├── useInitiativeStream.ts              # Assina o SSE `/api/initiative/stream` e empurra o estado no cache do React Query
│   ├── useInitiativeAddForm.ts             # Lógica de formulário do InitiativeAddForm — RHF + Zod
│   ├── useLocalStorageState.ts             # useState + localStorage genérico — ver seção "Persistência local"
│   ├── useMapImage.ts                      # Carregamento/tamanho da imagem do mapa + centralização inicial da view
│   ├── useMapInteraction.ts                # Hook de interação com o mapa (pan, zoom, drag)
│   ├── useMapRuler.ts                      # Hook de régua do mapa — calibração e medição em milhas
│   ├── useNpcForm.ts                       # Lógica de formulário do NpcModal — RHF + Zod
│   ├── useNpcs.ts                          # CRUD de NPCs via `backendApi` (`/api/npcs`) — async, sem localStorage
│   ├── useSearchInput.ts                   # Estado do input de busca com debounce (300ms) via useRef — sem useEffect
│   └── useTreeExpansion.ts                 # expandedIds/mountedIds/toggleExpanded — compartilhado por RightTree e DownTree (Conexões)
│
├── pages/
│   ├── Arts.tsx                            # Galeria integrada ao Google Drive — sync manual, blur toggle, lightbox
│   ├── Characters.tsx                      # Gestão de personagens — HP, XP, modal de criação/edição
│   ├── Connections.tsx                     # Árvore de hierarquia de facção — TreeView + FACTION_TREES (SVG próprio)
│   ├── Encounter.tsx                       # Calculadora de XP de encontro — party, monstros, resultado e histórico
│   ├── Initiative.tsx                      # Controle de turnos de combate — lista ordenada por iniciativa
│   ├── Login.tsx                           # Tela de login
│   ├── Map.tsx                             # Visualização de mapa com régua e ferramentas
│   ├── Npcs.tsx                            # Gestão de NPCs — filtros, cards agrupados por facção, modal de criação/edição
│   ├── RandomTables.tsx                    # Tabelas aleatórias — 17 tabelas em 6 categorias, rolar individualmente ou tudo
│   ├── Search.tsx                          # Busca global por URL (/search?q=) — NPCs e personagens (personagens só para DM)
│   ├── Sounds.tsx                          # (em construção)
│   └── Table.tsx                           # Painel público /mesa — acompanhamento ao vivo da iniciativa no tablet (ver docs/iniciativa-realtime.md)
│
├── schemas/
│   ├── auth.ts                             # authFormSchema — validação do formulário de login
│   ├── character.ts                        # characterFormSchema — validação do formulário de personagem
│   ├── initiative.ts                       # combatantFormSchema — validação do formulário de combatente
│   └── npc.schema.ts                       # npcFormSchema — usa z.enum(FACTIONS as [Faction, ...Faction[]]) para preservar literal union
│
├── services/
│   ├── api.ts                              # Instância base do Axios (baseURL + API key global)
│   ├── backendApi.ts                       # Instância Axios para o backend próprio
│   └── googleDrive.ts                      # googleDriveService.getImages() — lista imagens da pasta do Drive
│
├── styles/
│   └── form.ts                             # labelClass — classe CSS compartilhada para labels de formulário
│
├── types/
│   ├── character.ts                        # Character { id, name, playerName, characterClass, race, currentHP, maxHP, xp, imageUrl, notes }
│   ├── encounter.ts                        # PartyMember, MonsterEntry, CR, EncounterResult, EncounterSnapshot, EncounterPartyMemberSnapshot
│   ├── icon.ts                             # IconProps { size, className, strokeWidth }
│   ├── image.ts                            # DriveImage { id, name, url, fullUrl }
│   ├── initiative.ts                       # Combatant { ..., imageUrl?, conditions? }, CombatantStatus
│   ├── npc.types.ts                        # Npc { id, name, faction, status, description, notes, imageUrl? }, Faction, NpcStatus
│   ├── randomTables.ts                     # RollEntry { result, key }
│   └── route.types.ts                      # AppRoute { id, path, label, element, icon, dmOnly? }
│
├── utils/
│   ├── character.ts                        # resolveHpBarColor(percentage) — cor dinâmica da barra de HP
│   ├── encounter.ts                        # calculateEncounter(party, monsters) → EncounterResult; spawnParticles(count) → Particle[]
│   ├── image.ts                            # Utilitários de imagem
│   ├── mapLocations.ts                     # findLocationAt(coords, locations) — hit-test de localizações do mapa
│   ├── number.ts                           # clampNumber, formatNumber
│   └── random.ts                           # pickRandom<T>(entries) — sorteia um item de qualquer array
│
├── App.tsx                                 # Layout raiz: Sidebar + Routes (inclui /search fora do ROUTES)
├── main.tsx                                # Entry point: BrowserRouter + StrictMode
├── index.css                               # Tailwind @import + @theme com paleta de cores
└── vite-env.d.ts                           # Tipos das variáveis de ambiente (ImportMetaEnv)
```

## Variáveis de ambiente

Definidas em `.env.local` (nunca commitar — coberto pelo `.gitignore` via `*.local`).
O arquivo `.env.example` na raiz serve de template.

```bash
VITE_GOOGLE_API_KEY=AIza...
VITE_GOOGLE_DRIVE_FOLDER_ID=seu_folder_id_aqui
VITE_GOOGLE_DRIVE_MAP_FILE_ID=seu_map_file_id_aqui
VITE_BACKEND_URL=http://localhost:3002
```

Toda nova variável `VITE_*` deve ser declarada também em `src/vite-env.d.ts` dentro de `ImportMetaEnv`.

## Integração Google Drive

- Pasta pública do Drive lida via **Google Drive API v3** com API Key (sem OAuth)
- `services/api.ts` — instância Axios com `baseURL: https://www.googleapis.com/drive/v3`
- `services/googleDrive.ts` — `googleDriveService.getImages()` lista arquivos de imagem da pasta
- `hooks/useDriveImages.ts` — **não faz auto-fetch**; expõe `sync()` para chamada manual
- Imagens exibidas via URL de thumbnail do Google: `https://drive.google.com/thumbnail?id={id}&sz=w800`
- Lightbox usa tamanho maior: `sz=w2000`

## Imagens locais de personagens

- Artes ficam em `src/assets/arts/` e são carregadas via `import.meta.glob` em `constants/arts.ts`
- `LOCAL_ARTS` — array com `{ key, name, url }` onde `key` é o nome do arquivo (estável entre builds)
- `resolveImageUrl(imageUrl)` — converte qualquer formato para URL real:
  - `"local:1_dante.jpeg"` → URL com hash do Vite
  - `"/src/assets/arts/1_dante.jpeg"` → fallback para JSONs exportados antes da correção
  - qualquer outra string → retorna como está (URL externa)
- `toLocalArtUrl(key)` — gera a chave estável `"local:<filename>"`
- **Nunca salvar a URL com hash do Vite** como `imageUrl` — ela muda a cada build. Usar sempre `"local:<filename>"`.

## Formulários

- Todos os formulários usam **React Hook Form** com **`zodResolver`**
- Schemas ficam em `src/schemas/` — um arquivo por domínio
- Lógica de formulário extraída em hooks próprios: `useCharacterForm`, `useNpcForm`, `useInitiativeAddForm`
- Tipos de input/output são exportados via `z.input<>` e `z.output<>` do próprio schema
- Para campos numéricos, usar `z.union([z.string(), z.number()]).transform(...).pipe(z.number())` para evitar o tipo `unknown` que `z.coerce` gera no zod v4
- Para enums derivados de arrays de constantes, usar `z.enum(ARRAY as [Literal, ...Literal[]])` para preservar o union literal — nunca `as [string, ...string[]]` que descarta os tipos
- `labelClass` compartilhado em `src/styles/form.ts` — importar de lá, nunca redeclarar local

## Persistência local

- `hooks/useLocalStorageState.ts` — `useState` + `localStorage` genérico: `[value, setValue] = useLocalStorageState(key, initial, { serialize?, deserialize? })`. `setValue` aceita valor ou updater (igual `useState`) e já persiste sozinho. Default `JSON.stringify`/`JSON.parse`; passar `serialize`/`deserialize` custom quando não for JSON (ex.: `useMapRuler` guarda a calibração como número cru, não JSON)
  - Usado por `useEncounterHistory` (`dndkeeper_encounter_history`), `useMapRuler` (calibração, `dndkeeper_map_calibration`) e `useMapDrawing` (`paths`, `dndkeeper_map_drawings`)
- Hooks não fazem auto-fetch com `useEffect` — estado é carregado na inicialização via `useState(() => load())` (ou via `useLocalStorageState` acima)
- **Exceção**: `useNpcs`, `useCharacters` e `useInitiative` não usam só `localStorage` — o dado vem do backend via **React Query** (`@tanstack/react-query`)
  - `useInitiative` sincroniza com `backendApi` (`/api/initiative`) e mantém `localStorage` (`dndkeeper_initiative_v2`) só como cache de carga fria / fallback offline — ver **`docs/iniciativa-realtime.md`**
  - ver também seções "NPCs" e "Personagens"

## Paleta de cores

Definida via `@theme` no `index.css` e acessível como classes Tailwind.

| Token | Hex | Uso |
|---|---|---|
| `red-100` | `#D72334` | Destaque, item ativo |
| `red-200` | `#B91324` | Variação |
| `red-400` | `#571623` | Tom escuro |
| `red-500` | `#4B0F21` | Tom mais escuro |
| `black-100` | `#34353E` | Bordas claras |
| `black-200` | `#27282F` | Bordas, fundos secundários |
| `black-300` | `#282A2E` | Fundos de card |
| `black-400` | `#1E1F23` | Fundo da sidebar |
| `black-500` | `#17181C` | Fundo principal |
| `white-100` | `#F5F5F5` | Texto principal |
| `white-200` | `#EDEDED` | Texto secundário |
| `white-300` | `#C0C0C0` | Texto desabilitado/ícones |
| `yellow` | `#ECC83B` | Accent — XP, badges PC |
| `btn-from` | `#D72334` | Gradient início — botão primary |
| `btn-to` | `#821325` | Gradient fim — botão primary |
| `btn-border` | `#AA1A2C` | Borda — botão primary |
| `btn-secondary-border` | `#B11C2D` | Borda — botão secondary |
| `btn-secondary-text` | `#CD2132` | Texto — botão secondary |

## Rotas

Definidas em `src/constants/routes.tsx`. Para adicionar uma página nova, basta incluir uma entrada no array `ROUTES`.
`/search` é declarada direto em `App.tsx` (fora do `ROUTES`, dentro do `AuthGuard`) pois não aparece na sidebar.
`/mesa` também é declarada em `App.tsx`, mas **fora do `AuthGuard`** — é pública, sem login.

| Path | Página | Acesso |
|---|---|---|
| `/` | redirect | → `/artes` |
| `/login` | Login | público |
| `/mesa` | Table | **público** — painel de acompanhamento da mesa (tablet/TV) |
| `/search` | Search | todos |
| `/artes` | Arts | todos — **path não renomear** (configurado na API do Drive) |
| `/npcs` | Npcs | todos |
| `/mapa` | Map | todos |
| `/conexoes` | Connections | todos |
| `/personagens` | Characters | mestre |
| `/iniciativa` | Initiative | mestre |
| `/encontro` | Encounter | mestre |
| `/tabelas` | RandomTables | mestre |
| `/sons` | Sounds | mestre (em construção) |

## Deploy

- Hospedado no **Vercel**
- `vercel.json` na raiz configura rewrite `"/(.*)" → "/index.html"` para SPAs com `BrowserRouter`
- Sem esse rewrite, rotas acessadas diretamente (ex: `/personagens`) retornam 404

## Busca Global

- Rota `/search?q=` — pesquisa NPCs e personagens por nome, facção, descrição e notas
- `useSearchInput` — `inputValue` (local, digitação sempre instantânea) + `query = useDeferredValue(inputValue)`; a URL é escrita a cada tecla (`setSearchParams(..., { replace: true })`), sem debounce manual — o `useDeferredValue` é quem evita que o filtro caro trave a digitação, não um timer
- `useGlobalSearch(query)` — recebe o `query` já deferido; filtra com `useMemo`, `total` calculado dentro do mesmo memo
- Personagens visíveis apenas para role `dm`; guests veem só NPCs
- `NpcResult` e `CharacterResult` são `memo()` — evitam re-render quando props não mudam
- `setSearchParams(..., { replace: true })` — evita poluição do histórico ao digitar

## Tabelas Aleatórias

- **17 tabelas** em 6 categorias: Encontros (Floresta, Dungeon, Cidade), Clima & Ambiente, Nomes de NPCs (Humano, Élfico, Anão, Antagonista), Loot & Tesouros (Comum, Raro/Mágico), NPCs (Personalidade, Aparência, Motivação, Defeito/Segredo), Narrativa (Gancho, Taverna, Complicação, Rumor, Missão Secundária)
- Dados em `constants/randomTables.ts` com três lookups pré-computados no final do módulo:
  - `TABLE_CATEGORIES` — array de categorias únicas, calculado uma vez no carregamento
  - `TABLES_BY_CATEGORY` — `Record<category, RandomTable[]>`, elimina `filter()` no render
  - `TABLES_BY_ID` — `Record<id, RandomTable>`, lookup O(1) ao rolar
- Animação de resultado: `@keyframes roll-in` + classe `.roll-result` em `index.css`; `key={roll.key}` no div força re-mount e re-anima sem trocar de elemento
- Padrão de performance para listas grandes de cards memoizados:
  - Estado combinado `Record<id, RollEntry>` — um `setState` por rolagem
  - `handleRoll(id: string)` com `useCallback([], [])` — estável para sempre via atualização funcional
  - `memo(RandomTableCard)` — re-renderiza apenas o card rolado
  - `useCallback` interno no card para o `onClick` — deps `[onRoll, table.id]`, ambas estáveis

## Estilo visual dos cards de iniciativa

- Layout **portrait** (vertical): grid `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` em `Initiative.tsx`
- Estrutura da página: `flex flex-col h-full` — conteúdo em `flex-1 overflow-y-auto`, formulário em `shrink-0` fixo no rodapé com `border-t`
- **Border beam no turno atual**: combatante ativo tem wrapper com `p-0.5 current-turn-border`; os 2px de padding expõem o gradiente animado como "borda"; inner div usa `bg-black-300 rounded-[10px]` para cobrir o gradiente em tudo exceto a borda
  - Implementado em `index.css` via `@property --border-angle` + `@keyframes border-beam` + `.current-turn-border` com `conic-gradient`
  - `@property` permite animar custom properties CSS com `transition`/`animation`
- **Imagem de fundo atmosférica**: `Combatant` tem campo `imageUrl?: string` (opcional); quando presente, renderiza a imagem como camada absoluta com overlay `bg-black-300/45`
  - Personagens importados herdam `imageUrl` automaticamente; monstros adicionados manualmente ficam sem imagem
  - Estrutura de duas camadas: `absolute inset-0` para imagem + overlay; `relative z-10` para o conteúdo
- **Condições de combate**: `Combatant` tem campo `conditions?: string[]`
  - 15 condições D&D 5e em português definidas em `constants/initiative.ts` como `CONDITIONS`
  - `ConditionBadge` (âmbar) exibe condições ativas no card; botão com borda tracejada abre `ConditionModal`
  - `ConditionModal` tem estado local para permitir cancelar sem salvar; só chama `onSave` ao confirmar
  - `useInitiative` expõe `setConditions(id, conditions[])`
- **Esconder HP de monstro na mesa**: `Combatant.hpRevealed?` — monstro nasce oculto; olho no `CombatantRow` alterna. No `/mesa` oculto vira faixa de saúde (`getHealthBand`)
- Botões de ajuste de HP visíveis em **todos** os combatentes (não só o atual)
- `resolveImageUrl` de `constants/arts.ts` é usada em `CombatantRow` para resolver `local:filename`
- **Estado é sincronizado com o backend** (não é mais só `localStorage`) e transmitido ao vivo para o `/mesa` via SSE — ver **`docs/iniciativa-realtime.md`**

## Painel da Mesa (`/mesa`)

- Rota **pública** (declarada em `App.tsx` fora do `AuthGuard`) — tela só de acompanhamento para o tablet/TV da mesa, sem login. Botão "Abrir painel da mesa" no `Login.tsx`
- `pages/Table.tsx` é só composição; blocos em `components/{molecules,organisms}/table/`, side-effects em hooks genéricos (`useTicker`, `useDelayedFlag`, `useValueChangePulse`, `useFullscreen`, `useScrollIntoViewOnChange`)
- PWA: `public/manifest.webmanifest` (`display: standalone`, `start_url: /mesa`) + botão de tela cheia + `min-h-dvh` para fugir da barra de URL do Chrome no tablet
- Detalhes completos em **`docs/iniciativa-realtime.md`**

## Estilo visual dos cards de personagem

- Layout **portrait** (vertical): imagem no topo (`h-64`, `object-cover object-top`), conteúdo abaixo
- Grid em `Characters.tsx`: `grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Hover do card: `hover:-translate-y-1 hover:shadow-xl` com `transition-all duration-300`
- Imagem com zoom suave no hover: `group-hover:scale-105` com `duration-500`
- **Gradiente inferior da imagem**: posicionado em `-bottom-3` (não `bottom-0`) para evitar gap de 1px entre o clip do `overflow-hidden` e o gradiente durante a animação de escala — bug de compositing de GPU
- **Separação de layers**: a `<img>` fica dentro de um `<div class="absolute inset-0 overflow-hidden">` próprio; o gradiente e os overlays ficam como irmãos fora desse wrapper
- Botões de ação (editar/deletar) ficam invisíveis por padrão e aparecem com `group-hover:opacity-100`
- Inputs `type="number"` sem setas nativas — regra global em `@layer base` no `index.css`

## Calculadora de Encontro

- Página `/encontro` — calcula dificuldade e XP de um encontro com base no grupo e nos monstros
- **Fluxo**: party (nível por membro) + monsters (CR + quantidade) → `calculateEncounter()` → `EncounterResult`
- `calculateEncounter` em `utils/encounter.ts` soma o XP bruto dos monstros, aplica o multiplicador por quantidade (`getEncounterMultiplier`) e compara com os thresholds do grupo para determinar a dificuldade
- Os thresholds por nível ficam em `THRESHOLDS_PER_LEVEL` (`constants/encounter.ts`); são somados por membro do grupo
- **Histórico**: cada encontro pode ser salvo como `EncounterSnapshot` via `useEncounterHistory`
  - `EncounterSnapshot` tem flag `xpSent: boolean` para controlar se o XP já foi enviado aos personagens
  - Envio distribui `xpPerPlayer` para cada membro da party via `useAddCharacterXp` (lê o `xp` atual do cache do React Query, soma o delta e faz `PATCH`)
  - É possível enviar snapshots individuais ou todos os pendentes de uma vez ("Enviar Tudo")
- **`DifficultyMeter`**: detecta mudança de dificuldade durante o render, chama `spawnParticles` de `utils/encounter.ts` e anima partículas via CSS custom properties `--dx`/`--dy` + classe `.encounter-particle` em `index.css`
- A página de encontro **não usa RHF** — os painéis de party e monstros usam inputs controlados diretamente

## Personagens

- `/personagens` — CRUD de personagens do grupo; grid de cards com HP, XP e anotações
- Personagens são persistidos no **backend** (`rpg-system_backend`, Express + Prisma/Postgres) via **React Query**, mesmo padrão dos NPCs — não em `localStorage`
  - `GET /api/characters` é público; `POST`/`PATCH`/`DELETE` exigem sessão de DM (cookie `rpg_session`, `withCredentials: true` no `backendApi`)
  - `src/hooks/useCharacters.ts` — `characterKeys.all` + `useCharacters()` (`useQuery`, expõe `data`/`isLoading`/`isError`) + `useAddCharacter`/`useUpdateCharacter`/`useDeleteCharacter` (`useMutation`, um hook por operação)
  - `useAddCharacterXp` — mutation dedicada para somar XP: lê o personagem atual do cache (`queryClient.getQueryData`), soma o delta e envia só `{ xp }` via `PATCH`; usada pelo envio de XP da Calculadora de Encontro
  - Cada mutation atualiza o cache direto via `queryClient.setQueryData(characterKeys.all, ...)` no `onSuccess`, sem invalidar/refetch
  - `useCharacterForm` segue o mesmo padrão de `useNpcForm`: `onSave` assíncrono, `catch` mapeia erros `400` (`{ error, details }`) em `setError` por campo, erro genérico vira `saveError` exibido no modal; botão de salvar mostra `isSubmitting`
  - Não existe endpoint de bulk import/replace — a feature de exportar/importar JSON (que existia na versão com `localStorage`) foi removida junto com a migração, mesmo racional da remoção do reset de seed dos NPCs
  - **Ajuste de HP com debounce**: `useAdjustCharacterHp` evita bater no backend a cada clique nos botões de ±HP (`Characters.tsx` e `Initiative.tsx`). Atualiza o cache do React Query na hora (feedback visual instantâneo) e agenda o `PATCH` real num `setTimeout` de 8s guardado por `characterId` num `useRef(new Map())`; cada novo clique no mesmo personagem cancela o timer anterior e reagenda — só sai 1 request quando passam 8s sem novo ajuste naquele personagem. Não usa `useEffect`; o timer sobrevive ao unmount do componente porque vive no event loop, não no ciclo de vida do React
  - `imageUrl` é opcional (`Character.imageUrl?: string`), igual ao `Npc`
- Importação de personagens em `/iniciativa` (`handleImportCharacters`) e `/encontro` (`importFromCharacters`) lê os dados de `useCharacters().data`, sem mudanças de padrão

## NPCs

- `/npcs` — CRUD de NPCs estilo "dossiê": busca (nome/facção/ficha) + filtro de status, linhas **agrupadas por facção** que expandem pra ficha completa (`NpcDossierRow`), status como "carimbo" (`NpcStatusStamp`)
  - A busca fica na URL (`?q=`) sem debounce manual; o filtro (`useMemo`) usa `useDeferredValue(query)` — o input do `NpcDossierControls` continua ligado ao `query` imediato (nunca trava), só o recálculo da lista é que fica de baixa prioridade
- NPCs são persistidos no **backend** (`rpg-system_backend`, Express + Prisma/Postgres) via **React Query**, não em `localStorage`
  - `GET /api/npcs` é público; `POST`/`PATCH`/`DELETE` exigem sessão de DM (cookie `rpg_session`, `withCredentials: true` no `backendApi`)
  - `QueryClientProvider` fica no `main.tsx`, por fora do `BrowserRouter`/`AuthProvider`; `QueryClient` configurado com `retry: 1` nas queries
  - `src/hooks/useNpcs.ts` — `npcKeys.all` (query key factory) + `useNpcs()` (`useQuery`, expõe `data`/`isLoading`/`isError`) + `useAddNpc`/`useUpdateNpc`/`useDeleteNpc` (`useMutation`, um hook por operação — não um hook monolítico)
  - Cada mutation atualiza o cache direto via `queryClient.setQueryData(npcKeys.all, ...)` no `onSuccess` (append/map/filter) em vez de invalidar e refazer o fetch
  - Componentes chamam `mutation.mutateAsync(...)` e tratam erro com `try/catch` — RHF/`useNpcForm` usa o `catch` para mapear erros `400` do backend (`{ error, details: { campo: [mensagem] } }`) em `setError` por campo; erro genérico (rede, 401/403/404) vira `saveError` exibido no modal
  - Não existe endpoint de "resetar pro seed" — a feature de reset foi removida (`NpcSeedReset`/`npcSeed.ts` não existem mais)
  - `Npc` ganhou `createdAt`/`updatedAt` (ISO date), preenchidos pelo backend — nunca enviar no payload de criação/edição
- **Facções** (6): Zhentarim, Culto do Dragão, Irmandade Carmesim, Harpers, Confraria da Lâmina Velada, Independente — definidas em `FACTIONS` (`constants/npc.constants.ts`)
- **Select customizado**: usar `appearance-none` no `<select>` + `<SelectArrow />` posicionado absolutamente — nunca confiar na seta nativa do browser; aplicar também em filtros de página (ex: `NpcDossierControls`)

## Conexões

- `/conexoes` — árvore de hierarquia das facções em SVG. **Não é mais** um grafo de relações entre NPCs — essa feature (`NpcGraph`, `@xyflow/react`, `useNpcRelations`, `AddRelationModal`) foi removida por completo; `@xyflow/react` continua no `package.json` mas não é importado em lugar nenhum
- `pages/Connections.tsx` monta `<TreeView trees={FACTION_TREES} />`; `FACTION_TREES` (`constants/connections.constants.ts`) lista a árvore de cada facção, com dados fixos em `constants/cult.ts` (tipos `HierarchyTree`/`HierarchyNode`), `constants/harpers.ts`, `constants/zhentarim.ts`, `constants/az.ts`
- Cada árvore declara `direction: 'right' | 'down' | 'left'` — `TreeView` separa em `rightTrees`/`downTrees`/`leftTrees` e usa `treeLayout.utils.ts#computeLayout` pra calcular os offsets das árvores no canvas compartilhado (`useCanvasInteraction` cuida do pan/zoom); árvores `left` nascem em X negativo, à esquerda do bloco de `down`-trees, crescendo ainda mais pra esquerda a partir da raiz
- Imagem de nó vai direto pro `<image href>` do SVG (`NodeImage.tsx`), **sem** passar por `resolveImageUrl()` — pra usar um asset local (não uma URL do Drive) num `imageUrl` de árvore, importar o arquivo como módulo (`import img from '../assets/...'`) e usar a string resolvida pelo Vite direto; `toLocalArtUrl()` (de `constants/arts.ts`) não serve aqui, gera só o placeholder `"local:..."` pensado pra Character/Npc
- **`components/organisms/connections/`**:
  - `RightTree.tsx` / `DownTree.tsx` / `LeftTree.tsx` — só as constantes de geometria da própria árvore (raios, espaçamentos) e o bloco da **raiz**, que cada uma desenha do seu próprio jeito (o `DownTree` do Culto tem um "?" com glow pro mestre ainda não revelado — não passa por `TreeNode`, é conteúdo específico daquela árvore). `LeftTree` é o espelho horizontal do `RightTree` (mesmos raios/espaçamentos, offsets negativos)
  - `TreeDescendants.tsx` — render **recursivo** dos descendentes (conector + nó + próxima profundidade), compartilhado pelas três orientações. Raio, espaçamento e se o nível é clicável vêm de um array `TreeLevelStyle[]` passado por cada árvore — não é código repetido por nível
  - `treeGeometry.ts#getSpreadPosition` — posição de um nó no eixo de espalhamento, centralizada no pai; mesma fórmula em qualquer profundidade/orientação
  - `hooks/useTreeExpansion.ts` — `expandedIds`/`mountedIds`/`toggleExpanded`, compartilhado por todas as árvores
  - `TreeNode.tsx` / `TreeConnector.tsx` / `NodeImage.tsx` / `TreeChevron.tsx` / `TreeFilters.tsx` — peças visuais de um nó/conector
- **Profundidade de interação é assimétrica por design, não limitação técnica**: em `RightTree` (ex.: Harpers) dá pra expandir manualmente até o 2º nível (filho e neto); em `DownTree` (ex.: Culto) só o 1º nível (filho) é clicável — os níveis mais fundos sempre aparecem em cascata automática quando o ancestral clicável expande. Configurado por `clickable: false` no `TreeLevelStyle[]` de cada árvore
- Detalhes da refatoração que unificou `RightTree`/`DownTree` em `docs/auditoria-hooks-arquitetura.md` (§4.1)

## Testes

- **Vitest** (não Jest) — compartilha o pipeline de transformação do Vite, sem config duplicada
- `npm test` roda a suíte uma vez (`vitest run`); `npm run test:watch` fica observando
- Config em `vitest.config.ts` (`environment: 'jsdom'`, `setupFiles: './vitest.setup.ts'`) — **`test.globals` não está ativado**, então todo teste importa `describe`/`it`/`expect`/`vi` explicitamente de `'vitest'`
- `vitest.setup.ts` registra `@testing-library/jest-dom/vitest` (matchers) e um `afterEach(cleanup)` do `@testing-library/react` — **sem esse `cleanup()` explícito, renders de testes anteriores no mesmo arquivo continuam no DOM** (já que `globals` está desligado, o auto-cleanup do RTL não se registra sozinho) e quebram `getByText` com `getMultipleElementsFoundError` em arquivos com vários `it()` que renderizam os mesmos rótulos
- Arquivos de teste ficam **colocados** ao lado do arquivo testado: `foo.ts` → `foo.test.ts` (ou `.test.tsx` quando o teste usa JSX, ex.: um wrapper `MemoryRouter`)
- Camadas cobertas hoje: utils puros (`src/utils/*.test.ts`), hooks via `renderHook` (`src/hooks/*.test.ts(x)`) e componentes via `render`/`fireEvent` (`src/components/**/*.test.tsx`)
- Para datas/horários, usar `vi.useFakeTimers()` + `vi.setSystemTime(...)` em vez de mockar `Date` na mão
- Para simular falha de `localStorage` (quota excedida, modo privado), usar `vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw ... })`
- SVG: atributos de apresentação como `visibility="hidden"` não são entendidos por `toBeVisible()` do jest-dom da mesma forma que CSS — testes de árvore (`TreeDescendants.test.tsx`) sobem a cadeia de `parentElement` checando o atributo manualmente

## Convenções

- **TypeScript sempre** — nenhum arquivo `.js`/`.jsx`
- **Dados estáticos** ficam em `src/constants/`, nunca inline em componentes
- **SVGs** são sempre componentes em `src/components/atoms/icons/` usando `IconProps`
- **Estilos globais** extras entram dentro de `@layer base {}` no `index.css` — estilos fora de `@layer` sobrescrevem utilities do Tailwind
- **BrowserRouter** vive no `main.tsx`; `App.tsx` só contém layout e rotas
- **Serviços REST** usam instância do Axios de `services/api.ts`, nunca `fetch` direto
- **Hooks** não fazem auto-fetch com `useEffect` — expõem funções de trigger explícitas ou carregam estado na inicialização
- **Lógica de formulário** extraída em hooks (`useXxxForm`) — componentes de modal só contêm UI
- **Botão de fechar (X) de modal/popup**: usar `<CloseButton onClick={onClose} />` (atom), não recriar `<button><XIcon/></button>` na mão — `size`/`tone="parchment"` cobrem os casos que fogem do padrão (ícone maior, tema de carta)
- **Nomes de arquivo em inglês** — todos os arquivos novos em inglês; paths de rota não renomear (podem estar configurados em serviços externos)
- **Fragments**: usar `<>` em vez de `<Fragment>` salvo quando precisar de `key`
- **Ao finalizar qualquer tarefa** (feature, refactor, fix): rodar `npx tsc --noEmit`, `npm run lint` e `npm test` (suíte inteira) antes de dar por concluído — nunca só o arquivo/teste tocado isoladamente, pra pegar regressão em qualquer outro ponto do app
  - `npx tsc --noEmit` é o único dos três que pega erro de **tipo** (ex.: matcher do jest-dom não reconhecido, prop com tipo errado) — `vite build` não faz checagem completa de tipos (só transpila) e `eslint`/`vitest` não substituem isso
