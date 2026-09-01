# ⚔️ DnDKeeper

Ferramenta web para mestres de D&D gerenciarem sessões ao vivo — artes, mapas, NPCs, personagens, iniciativa, cartas e calculadora de encontro, tudo em um só lugar. Inclui um **painel de mesa** que espelha a iniciativa em tempo real num tablet/TV para os jogadores.

> Acesse em produção: **[dnd-keeper-tawny.vercel.app](https://dnd-keeper-tawny.vercel.app/)**

---

## ✨ Funcionalidades

| Módulo | Descrição | Status |
| --- | --- | --- |
| 📺 **Painel da Mesa** (`/mesa`) | Tela pública (sem login) para o tablet/TV da mesa — acompanha a iniciativa ao vivo via SSE: turno atual, HP, condições, rodada. Tela cheia + PWA | ✅ |
| ⚔️ **Iniciativa** | Turnos com border-beam animado, imagens atmosféricas e condições (D&D 5e). Estado **sincronizado com o backend** e transmitido ao `/mesa`. Esconder HP de monstro por combatente + editar HP atual/máx inline | ✅ |
| 🎭 **NPCs** | CRUD estilo "dossiê" — busca por nome/facção/ficha, agrupamento por facção, carimbo de status, imagens | ✅ |
| 👥 **Personagens** | Gestão de HP, XP, notas e imagem dos PCs (backend, com debounce no ajuste de HP) | ✅ |
| ✉️ **Cartas** (`/cartas`) | Cartas e documentos revelados aos jogadores, com visual de pergaminho | ✅ |
| 🗺️ **Mapa** | Visualizador interativo com pan/zoom ilimitado, fit automático e régua de distância | ✅ |
| 🖼️ **Artes** | Galeria sincronizada com Google Drive (agrupada por subpasta), lightbox, blur toggle | ✅ |
| 🕸️ **Conexões** (`/conexoes`) | Árvore de hierarquia das facções (Culto do Dragão, Harpers) em SVG | ✅ |
| 🎲 **Tabelas Aleatórias** | 17 tabelas em 6 categorias — encontros, NPCs, loot, clima e mais | ✅ |
| ⚖️ **Calculadora de Encontro** | Dificuldade e XP por grupo, com histórico e envio automático de XP aos personagens | ✅ |
| 🔍 **Busca Global** (`/search`) | Pesquisa NPCs e personagens via URL (`?q=`), com debounce | ✅ |
| 🎵 **Sons** | Loops de ambiente e efeitos sonoros | 🚧 |

---

## 🛠️ Stack

| Tecnologia | Versão | Detalhe |
| --- | --- | --- |
| React | 19 | com StrictMode |
| TypeScript | 6 | strict mode |
| Vite | 8 | bundler + dev server |
| Tailwind CSS | v4 | via `@tailwindcss/vite`, sem `config.js` |
| React Router | v7 | `BrowserRouter` + `useSearchParams` |
| React Hook Form + Zod | 7 / 4 | formulários com `zodResolver` |
| TanStack Query | v5 | cache de estado do servidor (NPCs, personagens, iniciativa) |
| Axios | 1.15.0 | versão segura (1.14.1 foi comprometida) |
| react-zoom-pan-pinch | 4 | pan/zoom do mapa |
| SSE (`EventSource`) | — | stream ao vivo da iniciativa para o `/mesa` |

**Backend:** repositório separado **`rpg-system_backend`** — Express + Prisma + PostgreSQL, hospedado na Render. Serve `/api/npcs`, `/api/characters` e `/api/initiative` (`GET` público, `POST/PATCH/PUT/DELETE` exigem sessão de mestre via cookie `rpg_session`) e o stream `GET /api/initiative/stream`.

---

## 🚀 Rodando localmente

**Pré-requisitos:** Node.js 22+

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/rpg-system.git
cd rpg-system

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves (veja a seção abaixo)

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em `http://localhost:3001`.

> NPCs, Personagens e Iniciativa dependem do backend (`rpg-system_backend`) rodando em `http://localhost:3002`. Aponte `VITE_BACKEND_URL` para ele ou para a instância hospedada.

---

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz (nunca commite esse arquivo — coberto pelo `.gitignore` via `*.local`):

```env
# Chave da Google Drive API
# Crie em: console.cloud.google.com → APIs e Serviços → Credenciais
VITE_GOOGLE_API_KEY=AIza...

# ID da pasta do Google Drive com as artes
# Extraia de: drive.google.com/drive/folders/ESTE_TRECHO_AQUI
VITE_GOOGLE_DRIVE_FOLDER_ID=

# ID do arquivo de mapa no Google Drive
# Extraia de: drive.google.com/file/d/ESTE_TRECHO_AQUI/view
VITE_GOOGLE_DRIVE_MAP_FILE_ID=

# URL base do backend (local ou hospedado)
VITE_BACKEND_URL=http://localhost:3002
```

Toda nova variável `VITE_*` deve ser declarada também em `src/vite-env.d.ts`.

---

## 📁 Estrutura do Projeto

```
src/
├── components/                 # Atomic Design
│   ├── atoms/                  # Primitivos: Button, Input, badges, ícones SVG
│   ├── molecules/              # Combinações: cards, barras de HP, filtros, painel da mesa
│   │   ├── characters/  encounter/  gallery/  initiative/  npc/  search/  table/
│   └── organisms/              # Blocos complexos: modais, sidebar, painéis
│       ├── character/  connections/  encounter/  initiative/  letter/  map/  npc/  table/
├── constants/                  # Dados estáticos: rotas, tabelas, thresholds, árvores de facção
├── contexts/                   # AuthContext (mestre / convidado)
├── hooks/                      # React Query, SSE, formulários, hooks utilitários
├── pages/                      # Uma página por rota (+ Table.tsx = /mesa)
├── schemas/                    # Schemas Zod para formulários
├── services/                   # Instâncias Axios (Google Drive + backend próprio)
├── styles/                     # Classes CSS compartilhadas
├── types/                      # Tipos TypeScript por domínio
└── utils/                      # Funções puras: HP, cor, data, URL do Drive, movimento

proxy/                          # Plugin Vite que faz proxy de /drive-img no dev
docs/                           # iniciativa-realtime.md, auditoria-frontend.md
```

Organizado em **Atomic Design** — átomos → moléculas → organismos → páginas.

---

## 🗺️ Rotas

| Path | Página | Acesso |
| --- | --- | --- |
| `/login` | Login (mestre ou convidado) | público |
| `/mesa` | Painel da mesa (tablet/TV) | **público** |
| `/search` | Busca global | todos |
| `/artes` | Galeria de artes | todos |
| `/npcs` | Dossiê de NPCs | todos |
| `/mapa` | Visualizador de mapa | todos |
| `/conexoes` | Árvore de facções | todos |
| `/personagens` | Gestão de personagens | mestre |
| `/iniciativa` | Controle de iniciativa | mestre |
| `/cartas` | Cartas e documentos | mestre |
| `/encontro` | Calculadora de encontro | mestre |
| `/tabelas` | Tabelas aleatórias | mestre |
| `/sons` | Sons de ambiente | mestre 🚧 |

`/mesa` e `/search` são declaradas direto em `App.tsx` — `/mesa` fora do `AuthGuard` (pública), `/search` dentro dele. As demais vêm de `src/constants/routes.tsx`.

---

## ☁️ Deploy

Frontend hospedado no **Vercel**. O `vercel.json` configura dois rewrites:

```json
{
  "rewrites": [
    { "source": "/drive-img", "destination": "https://drive.google.com/thumbnail" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

- `/drive-img` → proxy das imagens do Google Drive (evita CORS/referrer). No dev, o mesmo caminho é servido pelo plugin em `proxy/`.
- `/(.*) → /index.html` → necessário para o `BrowserRouter` em produção.

Backend (`rpg-system_backend`) hospedado na **Render**. O `CLIENT_URL` do backend deve ser a origem exata do site na Vercel (para o CORS do SSE com cookie).

---

## 📜 Scripts

```bash
npm run dev       # Servidor de desenvolvimento (porta 3001)
npm run build     # Build de produção
npm run preview   # Preview do build
npm run lint      # Lint com ESLint
```

---

## 🎨 Design

Paleta e tipografia via `@theme` no Tailwind v4, sem `tailwind.config.js`.

| Token | Cor | Uso |
| --- | --- | --- |
| `red-100` | `#D72334` | destaque, item ativo |
| `black-500` | `#17181C` | fundo principal |
| `black-400` | `#1E1F23` | fundo da sidebar |
| `yellow` | `#ECC83B` | XP, badges de PC |
| `white-100` | `#F5F5F5` | texto principal |
| `ink-950/900/800` | `#131316`…`#24262c` | fundos do dossiê de NPCs |
| `bone-100/300/400` | `#ece4d3`…`#8f8875` | texto sobre o dossiê (papel) |
| `wax` / `brass` | `#b21e2d` / `#c8a24a` | cera de lacre / latão — dossiê |

Fontes: **Oswald** (display), **Spectral** (corpo) e **IBM Plex Mono** (dados), carregadas via Google Fonts no `index.html`.

---

## 📚 Documentação

- [`docs/iniciativa-realtime.md`](docs/iniciativa-realtime.md) — arquitetura do sync de iniciativa + painel da mesa
- [`docs/auditoria-frontend.md`](docs/auditoria-frontend.md) — auditoria de componentes, duplicação e dívida técnica

---

_Feito com ☕ para mestres que odeiam pausar a sessão pra procurar o papel de anotações._
