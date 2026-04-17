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
│   │   ├── IconButton.tsx                  # Botão quadrado para ícones, com prop active
│   │   ├── TypeBadge.tsx                   # Badge PC / Monstro para combatentes
│   │   └── icons/                          # SVGs como componentes — props: size, className, strokeWidth
│   │       ├── ChevronLeftIcon.tsx
│   │       ├── ChevronRightIcon.tsx
│   │       ├── DiceIcon.tsx
│   │       ├── ExpandIcon.tsx
│   │       ├── EyeIcon.tsx
│   │       ├── EyeOffIcon.tsx
│   │       ├── ImageIcon.tsx
│   │       ├── MusicIcon.tsx
│   │       ├── PencilIcon.tsx
│   │       ├── PlusIcon.tsx
│   │       ├── RefreshIcon.tsx
│   │       ├── SwordsIcon.tsx
│   │       ├── TrashIcon.tsx
│   │       ├── UsersIcon.tsx
│   │       └── XIcon.tsx
│   │
│   ├── molecules/                          # Combinações de atoms com lógica de apresentação simples
│   │   ├── CharactersEmpty.tsx             # Estado vazio da página de personagens — com ações
│   │   ├── GalleryEmpty.tsx                # Estado vazio genérico com ícone e mensagem
│   │   ├── GroupHpBar.tsx                  # Barra de HP total do grupo — recebe totalHP, totalMaxHP, percentage
│   │   ├── ImageCard.tsx                   # Card de imagem com hover, blur e ícone de expandir
│   │   ├── InitiativeBadge.tsx             # Badge de iniciativa editável inline (clique para editar)
│   │   ├── InitiativeEmpty.tsx             # Estado vazio da página de iniciativa
│   │   └── RandomTableCard.tsx             # Card de tabela aleatória — memoizado, onRoll estável via memo+useCallback
│   │
│   └── organisms/                          # Blocos complexos com estado ou múltiplas responsabilidades
│       ├── CharacterCard.tsx               # Card completo de personagem — HP, XP, notas, ações
│       ├── CharacterModal.tsx              # Modal de criação/edição de personagem — usa RHF + Zod
│       ├── CombatantRow.tsx                # Linha de combatente na iniciativa — status, HP, ajustes
│       ├── InitiativeAddForm.tsx           # Formulário de adição de combatente — usa RHF + Zod
│       ├── Lightbox.tsx                    # Modal de imagem expandida — navegação por clique e teclado (←→ Esc)
│       └── Sidebar.tsx                     # Navegação lateral colapsável com logo e rotas
│
├── constants/
│   ├── arts.ts                             # LOCAL_ARTS (import.meta.glob), resolveImageUrl, toLocalArtUrl
│   ├── character.ts                        # HP_DELTA_OPTIONS — deltas dos botões de ajuste de HP
│   ├── dnd.ts                              # XP_THRESHOLDS, getLevel, getXpProgress
│   ├── initiative.ts                       # HP_DELTAS — deltas dos botões na iniciativa
│   ├── randomTables.ts                     # RANDOM_TABLES + TABLE_CATEGORIES, TABLES_BY_CATEGORY, TABLES_BY_ID
│   └── routes.tsx                          # Fonte única das rotas: id, path, label, icon, element
│
├── hooks/
│   ├── useCharacters.ts                    # CRUD de personagens com persistência em localStorage
│   ├── useDriveImages.ts                   # Retorna { images, loading, error, sync } — sem auto-fetch
│   └── useInitiative.ts                    # Estado da iniciativa (combatentes, turno, rodada) + localStorage
│
├── pages/
│   ├── Artes.tsx                           # Galeria integrada ao Google Drive — sync manual, blur toggle, lightbox
│   ├── Characters.tsx                      # Gestão de personagens — HP, XP, modal de criação/edição
│   ├── Initiative.tsx                      # Controle de turnos de combate — lista ordenada por iniciativa
│   ├── RandomTables.tsx                    # Tabelas aleatórias — 17 tabelas em 6 categorias, rolar individualmente ou tudo
│   └── Sounds.tsx                          # (em construção)
│
├── schemas/
│   ├── character.ts                        # characterFormSchema — validação do formulário de personagem
│   └── initiative.ts                       # combatantFormSchema — validação do formulário de combatente
│
├── services/
│   ├── api.ts                              # Instância base do Axios (baseURL + API key global)
│   └── googleDrive.ts                      # googleDriveService.getImages() — lista imagens da pasta do Drive
│
├── types/
│   ├── character.ts                        # Character { id, name, playerName, characterClass, race, currentHP, maxHP, xp, imageUrl, notes }
│   ├── icon.ts                             # IconProps { size, className, strokeWidth }
│   ├── image.ts                            # DriveImage { id, name, url, fullUrl }
│   ├── initiative.ts                       # Combatant { ..., imageUrl? }, CombatantStatus
│   ├── randomTables.ts                     # RollEntry { result, key }
│   └── route.ts                            # AppRoute { id, path, label, element, icon }
│
├── utils/
│   ├── character.ts                        # resolveHpBarColor(percentage) — cor dinâmica da barra de HP
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

## Persistência local

- `useCharacters` — persiste em `localStorage` com chave `dndkeeper_characters`
- `useInitiative` — persiste em `localStorage` com chave `dndkeeper_initiative`
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
| `/sons` | Sounds | em construção |
| `/artes` | Artes | funcional — **path não renomear** (configurado na API do Drive) |
| `/personagens` | Characters | funcional |
| `/iniciativa` | Initiative | funcional |
| `/tabelas` | RandomTables | em construção |

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

## Convenções

- **TypeScript sempre** — nenhum arquivo `.js`/`.jsx`
- **Dados estáticos** ficam em `src/constants/`, nunca inline em componentes
- **SVGs** são sempre componentes em `src/components/atoms/icons/` usando `IconProps`
- **Estilos globais** extras entram dentro de `@layer base {}` no `index.css` — estilos fora de `@layer` sobrescrevem utilities do Tailwind
- **BrowserRouter** vive no `main.tsx`; `App.tsx` só contém layout e rotas
- **Serviços REST** usam instância do Axios de `services/api.ts`, nunca `fetch` direto
- **Hooks** não fazem auto-fetch com `useEffect` — expõem funções de trigger explícitas ou carregam estado na inicialização
- **Nomes de arquivo em inglês** — exceto `Artes.tsx` (path da rota está configurado na API)
