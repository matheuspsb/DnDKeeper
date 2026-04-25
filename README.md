# ⚔️ DnDKeeper

Ferramenta web para mestres de D&D gerenciarem sessões ao vivo — sons, artes, mapas, personagens, iniciativa e calculadora de encontro, tudo em um só lugar.

> Acesse em produção: **[dndkeeper.vercel.app](https://dnd-keeper-tawny.vercel.app/)**

---

## ✨ Funcionalidades

| Módulo                         | Descrição                                                                             | Status |
| ------------------------------ | ------------------------------------------------------------------------------------- | ------ |
| 🔍 **Busca Global**            | Pesquisa por NPCs e personagens via URL (`/search?q=`), com debounce                 | ✅     |
| 🗺️ **Mapa**                    | Visualizador interativo com pan/zoom ilimitado, fit automático e régua de distância  | ✅     |
| 🖼️ **Artes**                   | Galeria sincronizada com Google Drive, lightbox, blur toggle                          | ✅     |
| 👥 **Personagens**             | Gestão de HP, XP, notas e imagem dos PCs                                              | ✅     |
| ⚔️ **Iniciativa**              | Turnos com border beam animado, imagens atmosféricas e condições de combate (D&D 5e) | ✅     |
| 🎭 **NPCs**                    | CRUD com filtros, agrupamento por facção e imagens                                    | ✅     |
| 🕸️ **Conexões**                | Grafo interativo de relações entre NPCs                                               | ✅     |
| 🎲 **Tabelas Aleatórias**      | 17 tabelas em 6 categorias — encontros, NPCs, loot, clima e mais                     | ✅     |
| ⚖️ **Calculadora de Encontro** | Dificuldade e XP por grupo, com histórico e envio automático de XP                   | ✅     |
| 🎵 **Sons**                    | Loops de ambiente e efeitos sonoros                                                   | 🚧     |

---

## 🛠️ Stack

| Tecnologia            | Versão | Detalhe                                   |
| --------------------- | ------ | ----------------------------------------- |
| React                 | 19     | com StrictMode                            |
| TypeScript            | 6      | strict mode                               |
| Vite                  | 8      | bundler + dev server                      |
| Tailwind CSS          | v4     | via `@tailwindcss/vite`, sem config.js    |
| React Router          | v7     | BrowserRouter + `useSearchParams`         |
| React Hook Form + Zod | 7 / 4  | formulários com `zodResolver`             |
| Axios                 | 1.15.0 | versão segura (1.14.1 foi comprometida)   |
| @xyflow/react         | latest | grafo de conexões entre NPCs              |

---

## 🚀 Rodando localmente

**Pré-requisitos:** Node.js 20+

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

Acesse em `http://localhost:3001`

---

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz (nunca commite esse arquivo):

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

# URL base do backend
VITE_BACKEND_URL=http://localhost:3002
```

---

## 📁 Estrutura do Projeto

```
src/
├── components/                 # Atomic Design
│   ├── atoms/                  # Primitivos: Button, Input, badges, ícones SVG
│   ├── molecules/              # Combinações: cards, barras de HP, filtros, resultados de busca
│   │   ├── characters/
│   │   ├── encounter/
│   │   ├── gallery/
│   │   ├── initiative/
│   │   ├── npc/
│   │   └── search/
│   └── organisms/              # Blocos complexos: modais, sidebar, painéis
│       ├── character/
│       ├── encounter/
│       ├── initiative/
│       ├── map/
│       └── npc/
├── constants/                  # Dados estáticos: rotas, tabelas, XP thresholds, condições
├── contexts/                   # AuthContext
├── hooks/                      # Estado com persistência + lógica de formulários
├── pages/                      # Uma página por rota
├── schemas/                    # Schemas Zod para formulários
├── services/                   # Axios + Google Drive API
├── styles/                     # Classes CSS compartilhadas (labelClass)
├── types/                      # Tipos TypeScript por domínio
└── utils/                      # Funções puras: cálculos, cores, random
```

Organizado em **Atomic Design** — átomos → moléculas → organismos → páginas.

---

## 🗺️ Rotas

| Path           | Página                             | Acesso      |
| -------------- | ---------------------------------- | ----------- |
| `/search`      | Busca global                       | todos       |
| `/artes`       | Galeria de artes                   | todos       |
| `/npcs`        | Gestão de NPCs                     | todos       |
| `/mapa`        | Visualizador de mapa               | todos       |
| `/arvore`      | Grafo de conexões entre NPCs       | todos       |
| `/personagens` | Gestão de personagens              | mestre      |
| `/iniciativa`  | Controle de iniciativa             | mestre      |
| `/tabelas`     | Tabelas aleatórias                 | mestre      |
| `/encontro`    | Calculadora de encontro            | mestre      |
| `/sons`        | Sons de ambiente                   | mestre 🚧   |

---

## ☁️ Deploy

Hospedado no **Vercel**. O arquivo `vercel.json` configura o rewrite de todas as rotas para `index.html`, necessário para o `BrowserRouter` funcionar corretamente em produção.

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 📜 Scripts

```bash
npm run dev       # Servidor de desenvolvimento (porta 3001)
npm run build     # Build de produção
npm run preview   # Preview do build
npm run lint      # Lint com ESLint
```

---

## 🎨 Paleta de Cores

O projeto usa uma paleta customizada via `@theme` no Tailwind v4, sem `tailwind.config.js`.

| Token       | Cor                              |
| ----------- | -------------------------------- |
| `red-100`   | `#D72334` — destaque, item ativo |
| `black-500` | `#17181C` — fundo principal      |
| `black-400` | `#1E1F23` — fundo da sidebar     |
| `yellow`    | `#ECC83B` — XP, badges de PC     |
| `white-100` | `#F5F5F5` — texto principal      |

---

_Feito com ☕ para mestres que odeiam pausar a sessão pra procurar o papel de anotações._
