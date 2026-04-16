# DnDKeeper

Ferramenta web para auxiliar o mestre na gestão de campanhas de D&D. Permite organizar sons, artes e personagens durante as sessões. Projetada para ser acessada pelo mestre e pelos jogadores em produção.

## Stack

| Tecnologia | Versão | Detalhe |
|---|---|---|
| React | 19 | com StrictMode |
| Vite | 8 | bundler + dev server |
| TypeScript | 5 | strict mode ativado |
| Tailwind CSS | v4 | via `@tailwindcss/vite`, sem `tailwind.config.js` |
| React Router | v7 | com `BrowserRouter` no `main.tsx` |
| Axios | 1.15.0 | versão segura (1.14.1 e 0.30.4 foram comprometidas em supply chain attack) |

## Linguagem

**Todo arquivo novo deve ser `.ts` ou `.tsx`. Nunca criar `.js` ou `.jsx`.**

## Estrutura do projeto

```
src/
├── assets/
│   └── logo.png
│
├── components/                         # Atomic Design
│   ├── atoms/                          # Primitivos sem dependência de outros componentes
│   │   ├── Button.tsx                  # Botão de texto: variantes primary e secondary
│   │   ├── IconButton.tsx              # Botão quadrado para ícones, com prop active
│   │   └── icons/                      # SVGs como componentes — props: size, className, strokeWidth
│   │       ├── ChevronLeftIcon.tsx
│   │       ├── ChevronRightIcon.tsx
│   │       ├── ExpandIcon.tsx
│   │       ├── EyeIcon.tsx
│   │       ├── EyeOffIcon.tsx
│   │       ├── ImageIcon.tsx
│   │       ├── MusicIcon.tsx
│   │       ├── RefreshIcon.tsx
│   │       ├── UsersIcon.tsx
│   │       └── XIcon.tsx
│   │
│   ├── molecules/                      # Combinações de atoms com lógica de apresentação simples
│   │   ├── GalleryEmpty.tsx            # Estado vazio com ícone e mensagem customizável
│   │   └── ImageCard.tsx               # Card de imagem com hover, blur e ícone de expandir
│   │
│   └── organisms/                      # Blocos complexos com estado ou múltiplas responsabilidades
│       ├── Lightbox.tsx                # Modal de imagem expandida — navegação por clique e teclado (←→ Esc)
│       └── Sidebar.tsx                 # Navegação lateral colapsável com logo e rotas
│
├── constants/
│   └── routes.tsx                      # Fonte única das rotas: id, path, label, icon, element
│
├── hooks/
│   └── useDriveImages.ts               # Retorna { images, loading, error, sync } — sem auto-fetch
│
├── pages/
│   ├── Artes.tsx                       # Galeria integrada ao Google Drive — sync manual, blur toggle, lightbox
│   ├── Sons.tsx                        # (em construção)
│   └── Personagens.tsx                 # (em construção)
│
├── services/
│   ├── api.ts                          # Instância base do Axios (baseURL + API key global)
│   └── googleDrive.ts                  # googleDriveService.getImages() — lista imagens da pasta do Drive
│
├── types/
│   ├── icon.ts                         # IconProps { size, className, strokeWidth }
│   ├── image.ts                        # DriveImage { id, name, url, fullUrl }
│   └── route.ts                        # AppRoute { id, path, label, element, icon }
│
├── App.tsx                             # Layout raiz: Sidebar + Routes
├── main.tsx                            # Entry point: BrowserRouter + StrictMode
├── index.css                           # Tailwind @import + @theme com paleta de cores
└── vite-env.d.ts                       # Tipos das variáveis de ambiente (ImportMetaEnv)
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
| `yellow` | `#ECC83B` | Accent (reservado) |
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
| `/sons` | Sons | em construção |
| `/artes` | Artes | funcional |
| `/personagens` | Personagens | em construção |

## Convenções

- **TypeScript sempre** — nenhum arquivo `.js`/`.jsx`
- **Dados estáticos** ficam em `src/constants/`, nunca inline em componentes
- **SVGs** são sempre componentes em `src/components/atoms/icons/` usando `IconProps`
- **Estilos globais** extras entram dentro de `@layer base {}` no `index.css` — estilos fora de `@layer` sobrescrevem utilities do Tailwind
- **BrowserRouter** vive no `main.tsx`; `App.tsx` só contém layout e rotas
- **Serviços REST** usam instância do Axios de `services/api.ts`, nunca `fetch` direto
- **Hooks** não fazem auto-fetch com `useEffect` — expõem funções de trigger explícitas
