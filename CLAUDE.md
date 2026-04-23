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
| @xyflow/react | latest | grafo de relações entre NPCs (Conexões) |

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
│   │   ├── Button.tsx                      # Botão de texto: variantes primary e secondary
│   │   ├── FactionBadge.tsx                # Badge colorido de facção usando FACTION_COLOR
│   │   ├── IconButton.tsx                  # Botão quadrado para ícones, com prop active
│   │   ├── SelectArrow.tsx                 # Seta customizada para selects (appearance-none + SVG absoluto)
│   │   ├── StatusDot.tsx                   # Bolinha colorida + label de status do NPC
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
│   │   │   └── ImageCard.tsx              # Card de imagem com hover, blur e ícone de expandir
│   │   ├── initiative/
│   │   │   ├── InitiativeBadge.tsx         # Badge de iniciativa editável inline (clique para editar)
│   │   │   └── InitiativeEmpty.tsx         # Estado vazio da página de iniciativa
│   │   ├── npc/
│   │   │   ├── NpcCard.tsx                 # Card de NPC — compõe Image + Body + Actions
│   │   │   ├── NpcCardActions.tsx          # Botões editar/deletar com estado de confirmação
│   │   │   ├── NpcCardBody.tsx             # Nome, StatusDot, FactionBadge, descrição e notas
│   │   │   ├── NpcCardImage.tsx            # Área de imagem com watermark de facção e overlay de morto
│   │   │   ├── NpcEmpty.tsx                # Estado vazio da página de NPCs — com ações
│   │   │   └── NpcFilters.tsx              # Filtros de status e facção com "Limpar filtros"
│   │   ├── MapHintBar.tsx                  # Barra de dicas do mapa
│   │   └── RandomTableCard.tsx             # Card de tabela aleatória — memoizado, onRoll estável via memo+useCallback
│   │
│   └── organisms/                          # Blocos complexos com estado ou múltiplas responsabilidades
│       ├── AddRelationModal.tsx            # Modal para criar conexão entre dois NPCs — usa RHF + Zod
│       ├── AuthGuard.tsx                   # Guarda de autenticação — redireciona para /login se não autenticado
│       ├── CharacterCard.tsx               # Card completo de personagem — HP, XP, notas, ações
│       ├── CharacterModal.tsx              # Modal de criação/edição de personagem — usa RHF + Zod
│       ├── CombatantRow.tsx                # Linha de combatente na iniciativa — status, HP, ajustes
│       ├── EncounterHistoryPanel.tsx       # Histórico de snapshots de combate — envio de XP por encontro ou em lote
│       ├── EncounterMonstersPanel.tsx      # Painel de monstros do encontro — nome, CR, quantidade
│       ├── EncounterPartyPanel.tsx         # Painel de membros do grupo — nome e nível, importação de personagens
│       ├── EncounterResultPanel.tsx        # Resultado do encontro — dificuldade, XP total, XP por jogador
│       ├── InitiativeAddForm.tsx           # Formulário de adição de combatente — usa RHF + Zod
│       ├── Lightbox.tsx                    # Modal de imagem expandida — navegação por clique e teclado (←→ Esc)
│       ├── MapCalibrationModal.tsx         # Modal de calibração da régua do mapa
│       ├── MapSvgOverlay.tsx               # Overlay SVG do mapa — linhas de régua
│       ├── MapToolbar.tsx                  # Toolbar do mapa — ferramentas de interação
│       ├── NpcGraph.tsx                    # Canvas de grafo de relações — @xyflow/react; ver seção "NPCs e Conexões"
│       ├── NpcImagePicker.tsx              # Seletor de imagem para NPCs — thumbnails LOCAL_ARTS + input de URL
│       ├── NpcModal.tsx                    # Modal de criação/edição de NPC — usa RHF + Zod
│       ├── NpcModalHeader.tsx              # Cabeçalho do NpcModal com título (isEditing) e botão fechar
│       ├── NpcRelationLegend.tsx           # Legenda de cores dos tipos de relação (rodapé do grafo)
│       ├── NpcRelationPanel.tsx            # Painel de conexões com botão deletar (canto superior direito do grafo)
│       └── Sidebar.tsx                     # Navegação lateral colapsável com logo e rotas
│
├── constants/
│   ├── arts.ts                             # LOCAL_ARTS (import.meta.glob), resolveImageUrl, toLocalArtUrl
│   ├── character.ts                        # HP_DELTA_OPTIONS — deltas dos botões de ajuste de HP
│   ├── dnd.ts                              # XP_THRESHOLDS, getLevel, getXpProgress
│   ├── encounter.ts                        # CR_XP, THRESHOLDS_PER_LEVEL, DIFFICULTY_LABEL/COLOR/BG/ORDER, getEncounterMultiplier
│   ├── initiative.ts                       # HP_DELTAS — deltas dos botões na iniciativa
│   ├── npc.constants.ts                    # FACTIONS, NPC_STATUS_LABEL/COLOR, FACTION_COLOR, FACTION_IMAGE, RELATION_TYPE_LABEL/COLOR
│   ├── randomTables.ts                     # RANDOM_TABLES + TABLE_CATEGORIES, TABLES_BY_CATEGORY, TABLES_BY_ID
│   └── routes.tsx                          # Fonte única das rotas: id, path, label, icon, element
│
├── hooks/
│   ├── useCharacters.ts                    # CRUD de personagens com persistência em localStorage
│   ├── useDriveImages.ts                   # Retorna { images, loading, error, sync } — sem auto-fetch
│   ├── useEncounter.ts                     # Estado do calculador — party, monsters, result (useMemo)
│   ├── useEncounterHistory.ts              # Snapshots de encontro com persistência em localStorage
│   ├── useInitiative.ts                    # Estado da iniciativa (combatentes, turno, rodada) + localStorage
│   ├── useMapInteraction.ts                # Hook de interação com o mapa (pan, zoom, drag)
│   ├── useMapRuler.ts                      # Hook de régua do mapa — calibração e medição em milhas
│   ├── useNpcRelations.ts                  # CRUD de relações entre NPCs + localStorage `dndkeeper_npc_relations`
│   └── useNpcs.ts                          # CRUD de NPCs + localStorage `dndkeeper_npcs`
│
├── pages/
│   ├── Artes.tsx                           # Galeria integrada ao Google Drive — sync manual, blur toggle, lightbox
│   ├── ArvoreGenealogica.tsx               # Grafo de conexões entre NPCs — @xyflow/react
│   ├── Characters.tsx                      # Gestão de personagens — HP, XP, modal de criação/edição
│   ├── Encounter.tsx                       # Calculadora de XP de encontro — party, monstros, resultado e histórico
│   ├── Initiative.tsx                      # Controle de turnos de combate — lista ordenada por iniciativa
│   ├── Login.tsx                           # Tela de login
│   ├── Mapa.tsx                            # Visualização de mapa com régua e ferramentas
│   ├── Npcs.tsx                            # Gestão de NPCs — filtros, grid de cards, modal de criação/edição
│   ├── RandomTables.tsx                    # Tabelas aleatórias — 17 tabelas em 6 categorias, rolar individualmente ou tudo
│   └── Sounds.tsx                          # (em construção)
│
├── schemas/
│   ├── auth.ts                             # authFormSchema — validação do formulário de login
│   ├── character.ts                        # characterFormSchema — validação do formulário de personagem
│   ├── initiative.ts                       # combatantFormSchema — validação do formulário de combatente
│   ├── npc.schema.ts                       # npcFormSchema — usa z.enum(FACTIONS as [Faction, ...Faction[]]) para preservar literal union
│   └── npcRelation.schema.ts               # npcRelationFormSchema — tipo e label da conexão
│
├── services/
│   ├── api.ts                              # Instância base do Axios (baseURL + API key global)
│   └── googleDrive.ts                      # googleDriveService.getImages() — lista imagens da pasta do Drive
│
├── types/
│   ├── character.ts                        # Character { id, name, playerName, characterClass, race, currentHP, maxHP, xp, imageUrl, notes }
│   ├── encounter.ts                        # PartyMember, MonsterEntry, CR, EncounterResult, EncounterSnapshot, EncounterPartyMemberSnapshot
│   ├── icon.ts                             # IconProps { size, className, strokeWidth }
│   ├── image.ts                            # DriveImage { id, name, url, fullUrl }
│   ├── initiative.ts                       # Combatant { ..., imageUrl? }, CombatantStatus
│   ├── npc.types.ts                        # Npc { id, name, faction, status, description, notes, imageUrl? }, Faction, NpcStatus
│   ├── npcRelation.types.ts                # NpcRelation { id, sourceId, targetId, type, label? }
│   ├── randomTables.ts                     # RollEntry { result, key }
│   └── route.ts                            # AppRoute { id, path, label, element, icon }
│
├── utils/
│   ├── character.ts                        # resolveHpBarColor(percentage) — cor dinâmica da barra de HP
│   ├── encounter.ts                        # calculateEncounter(party, monsters) → EncounterResult; spawnParticles(count) → Particle[]
│   ├── number.ts                           # clampNumber, formatNumber
│   └── random.ts                           # pickRandom<T>(entries) — sorteia um item de qualquer array
│
├── App.tsx                                 # Layout raiz: Sidebar + Routes
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
- Tipos de input/output são exportados via `z.input<>` e `z.output<>` do próprio schema
- Para campos numéricos, usar `z.union([z.string(), z.number()]).transform(...).pipe(z.number())` para evitar o tipo `unknown` que `z.coerce` gera no zod v4
- Para enums derivados de arrays de constantes, usar `z.enum(ARRAY as [Literal, ...Literal[]])` para preservar o union literal — nunca `as [string, ...string[]]` que descarta os tipos

## Persistência local

- `useCharacters` — persiste em `localStorage` com chave `dndkeeper_characters`
- `useInitiative` — persiste em `localStorage` com chave `dndkeeper_initiative`
- `useEncounterHistory` — persiste em `localStorage` com chave `dndkeeper_encounter_history`
- `useNpcs` — persiste em `localStorage` com chave `dndkeeper_npcs`
- `useNpcRelations` — persiste em `localStorage` com chave `dndkeeper_npc_relations`
- Hooks não fazem auto-fetch com `useEffect` — estado é carregado na inicialização via `useState(() => load())`

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

| Path | Página | Status |
|---|---|---|
| `/` | redirect | → `/sons` |
| `/login` | Login | funcional |
| `/sons` | Sounds | em construção |
| `/artes` | Artes | funcional — **path não renomear** (configurado na API do Drive) |
| `/personagens` | Characters | funcional |
| `/iniciativa` | Initiative | funcional |
| `/encontro` | Encounter | funcional |
| `/tabelas` | RandomTables | em construção |
| `/npcs` | Npcs | funcional |
| `/arvore` | ArvoreGenealogica | funcional |
| `/mapa` | Mapa | funcional |

## Deploy

- Hospedado no **Vercel**
- `vercel.json` na raiz configura rewrite `"/(.*)" → "/index.html"` para SPAs com `BrowserRouter`
- Sem esse rewrite, rotas acessadas diretamente (ex: `/personagens`) retornam 404

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
- Estrutura da página: `flex flex-col h-full` — conteúdo em `flex-1 overflow-y-auto`, formulário em `shrink-0` fixo no rodapé com `border-t`; funciona sem alterar `App.tsx` porque `main` é flex child que estica à altura do pai (`min-h-screen`)
- **Border beam no turno atual**: combatante ativo tem wrapper com `p-0.5 current-turn-border`; os 2px de padding expõem o gradiente animado como "borda"; inner div usa `bg-black-300 rounded-[10px]` para cobrir o gradiente em tudo exceto a borda
  - Implementado em `index.css` via `@property --border-angle` + `@keyframes border-beam` + `.current-turn-border` com `conic-gradient`
  - `@property` permite animar custom properties CSS com `transition`/`animation`
- **Imagem de fundo atmosférica**: `Combatant` tem campo `imageUrl?: string` (opcional); quando presente, renderiza a imagem como camada absoluta com overlay `bg-black-300/82` — os 18% que vazam criam o efeito sem comprometer a legibilidade
  - Personagens importados herdam `imageUrl` automaticamente; monstros adicionados manualmente ficam sem imagem
  - Estrutura de duas camadas: `absolute inset-0` para imagem + overlay; `relative z-10` para o conteúdo
- Botões de ajuste de HP visíveis em **todos** os combatentes (não só o atual)
- `resolveImageUrl` de `constants/arts.ts` é usada em `CombatantRow` para resolver `local:filename` igual ao `CharacterCard`

## Estilo visual dos cards de personagem

- Layout **portrait** (vertical): imagem no topo (`h-64`, `object-cover object-top`), conteúdo abaixo
- Grid em `Characters.tsx`: `grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Hover do card: `hover:-translate-y-1 hover:shadow-xl` com `transition-all duration-300`
- Imagem com zoom suave no hover: `group-hover:scale-105` com `duration-500`
- **Gradiente inferior da imagem**: posicionado em `-bottom-3` (não `bottom-0`) para evitar gap de 1px entre o clip do `overflow-hidden` e o gradiente durante a animação de escala — bug de compositing de GPU
- **Separação de layers**: a `<img>` fica dentro de um `<div class="absolute inset-0 overflow-hidden">` próprio; o gradiente e os overlays ficam como irmãos fora desse wrapper — evita que o gradiente participe do contexto de compositing da animação e elimina o flicker
- Botões de ação (editar/deletar) ficam invisíveis por padrão e aparecem com `group-hover:opacity-100`; usam `bg-red-100 text-white-100` sem borda
- Inputs `type="number"` sem setas nativas — regra global em `@layer base` no `index.css`

## Calculadora de Encontro

- Página `/encontro` — calcula dificuldade e XP de um encontro com base no grupo e nos monstros
- **Fluxo**: party (nível por membro) + monsters (CR + quantidade) → `calculateEncounter()` → `EncounterResult`
- `calculateEncounter` em `utils/encounter.ts` soma o XP bruto dos monstros, aplica o multiplicador por quantidade (`getEncounterMultiplier`) e compara com os thresholds do grupo para determinar a dificuldade
- Os thresholds por nível ficam em `THRESHOLDS_PER_LEVEL` (`constants/encounter.ts`); são somados por membro do grupo
- **Histórico**: cada encontro pode ser salvo como `EncounterSnapshot` via `useEncounterHistory`
  - `EncounterSnapshot` tem flag `xpSent: boolean` para controlar se o XP já foi enviado aos personagens
  - Envio distribui `xpPerPlayer` para cada membro da party via `useCharacters.addXp`
  - É possível enviar snapshots individuais ou todos os pendentes de uma vez ("Enviar Tudo")
- **`DifficultyMeter`**: detecta mudança de dificuldade durante o render (comparação com estado anterior via `useState`), chama `spawnParticles` de `utils/encounter.ts` e anima partículas via CSS custom properties `--dx`/`--dy` + classe `.encounter-particle` em `index.css`
  - `DIFFICULTY_ORDER` em `constants/encounter.ts` é usado para determinar se a dificuldade subiu ou desceu (quantidade de partículas difere)
- A página de encontro **não usa RHF** — os painéis de party e monstros usam inputs controlados diretamente

## NPCs e Conexões

- `/npcs` — CRUD de NPCs com filtros por status e facção; grid de cards com imagem, facção, status e notas
- `/arvore` — grafo de relações entre NPCs usando `@xyflow/react` (`NpcGraph`)
- **Facções** (6): Zhentarim, Culto do Dragão, Irmandade Carmesim, Harpers, Confraria da Lâmina Velada, Independente — definidas em `FACTIONS` (`constants/npc.constants.ts`)
- **Relações bidirecionais**: `addRelation` cria dois registros (A→B e B→A); `deleteRelation` remove os dois — o grafo deduplica via `seen` set antes de criar as edges
- **NpcGraph — armadilhas do @xyflow/react**:
  - Nodes customizados precisam de handles `type="source"` **e** `type="target"` com IDs únicos; sem handles `target`, nenhuma edge programática é renderizada
  - `useNodesState`/`useEdgesState` só usam o valor inicial — mudanças de prop precisam de `useEffect` com `setNodes`/`setEdges`
  - O container do ReactFlow precisa de altura explícita; `flex-1` sozinho colapsa — usar `style={{ minHeight: 0 }}`
  - Edge type `smoothstep` roteia pelo par de handles mais próximo automaticamente
- **Select customizado**: usar `appearance-none` no `<select>` + `<SelectArrow />` posicionado absolutamente — nunca confiar na seta nativa do browser

## Convenções

- **TypeScript sempre** — nenhum arquivo `.js`/`.jsx`
- **Dados estáticos** ficam em `src/constants/`, nunca inline em componentes
- **SVGs** são sempre componentes em `src/components/atoms/icons/` usando `IconProps`
- **Estilos globais** extras entram dentro de `@layer base {}` no `index.css` — estilos fora de `@layer` sobrescrevem utilities do Tailwind
- **BrowserRouter** vive no `main.tsx`; `App.tsx` só contém layout e rotas
- **Serviços REST** usam instância do Axios de `services/api.ts`, nunca `fetch` direto
- **Hooks** não fazem auto-fetch com `useEffect` — expõem funções de trigger explícitas ou carregam estado na inicialização
- **Nomes de arquivo em inglês** — exceto `Artes.tsx` (path da rota está configurado na API)
