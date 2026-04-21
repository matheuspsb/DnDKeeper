# ⚔️ DnDKeeper

Ferramenta web para mestres de D&D gerenciarem sessões ao vivo — sons, artes, mapas, personagens, iniciativa e calculadora de encontro, tudo em um só lugar.

> Acesse em produção: **[dndkeeper.vercel.app](https://dnd-keeper-tawny.vercel.app/)**

---

## ✨ Funcionalidades

| Módulo                         | Descrição                                                                  | Status |
| ------------------------------ | -------------------------------------------------------------------------- | ------ |
| 🗺️ **Mapa**                    | Visualizador interativo com pan/zoom ilimitado, fit automático e bounds    | ✅     |
| 🖼️ **Artes**                   | Galeria sincronizada com Google Drive, lightbox, blur toggle               | ✅     |
| 👥 **Personagens**             | Gestão de HP, XP, notas e imagem dos PCs                                   | ✅     |
| ⚔️ **Iniciativa**              | Controle de turnos com border beam animado e imagens de fundo atmosféricas | ✅     |
| 🎲 **Tabelas Aleatórias**      | 17 tabelas em 6 categorias — encontros, NPCs, loot, clima e mais           | ✅     |
| ⚖️ **Calculadora de Encontro** | Dificuldade e XP por grupo, com histórico e envio automático de XP         | ✅     |
| 🎵 **Sons**                    | Loops de ambiente e efeitos sonoros                                        | 🚧     |

---

## 🛠️ Stack

| Tecnologia            | Versão |
| --------------------- | ------ |
| React                 | 19     |
| TypeScript            | 6      |
| Vite                  | 8      |
| Tailwind CSS          | v4     |
| React Router          | v7     |
| React Hook Form + Zod | 7 / 4  |
| Axios                 | 1.15.0 |
| react-zoom-pan-pinch  | 4      |

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
├── components/
│   ├── atoms/          # Botões, badges, ícones SVG
│   ├── molecules/      # Cards, barras de HP, badges de iniciativa
│   └── organisms/      # Modais, sidebar, painéis de encontro
├── constants/          # Dados estáticos: rotas, tabelas, XP thresholds
├── hooks/              # Estado com persistência: personagens, iniciativa, histórico
├── pages/              # Uma página por rota
├── schemas/            # Schemas Zod para formulários
├── services/           # Axios + Google Drive API
├── types/              # Tipos TypeScript por domínio
└── utils/              # Funções puras: cálculos, cores, random
```

Organizado em **Atomic Design** — átomos → moléculas → organismos → páginas.

---

## 🗺️ Rotas

| Path           | Página                             |
| -------------- | ---------------------------------- |
| `/mapa`        | Visualizador de mapa               |
| `/artes`       | Galeria de artes                   |
| `/personagens` | Gestão de personagens _(mestre)_   |
| `/iniciativa`  | Controle de iniciativa _(mestre)_  |
| `/tabelas`     | Tabelas aleatórias _(mestre)_      |
| `/encontro`    | Calculadora de encontro _(mestre)_ |

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
