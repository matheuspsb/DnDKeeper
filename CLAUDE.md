# DnDKeeper

Ferramenta local para auxiliar o mestre na gestão de campanhas de D&D. Permite organizar sons, artes e personagens durante as sessões.

## Stack

- **React 19** + **Vite 8**
- **Tailwind CSS v4** via `@tailwindcss/vite` (sem `tailwind.config.js`)
- **React Router v7** com `BrowserRouter`

## Estrutura do projeto

```
src/
├── assets/
│   └── logo.png
│
├── components/
│   ├── atoms/                  # Blocos primitivos, sem dependência de outros componentes
│   │   ├── Button.jsx          # Botão de texto: variantes primary e secondary
│   │   ├── IconButton.jsx      # Botão quadrado para ícones, com estado active
│   │   └── icons/              # SVGs encapsulados como componentes (props: size, className)
│   │       ├── ChevronLeftIcon.jsx
│   │       ├── ChevronRightIcon.jsx
│   │       ├── ExpandIcon.jsx
│   │       ├── EyeIcon.jsx
│   │       ├── EyeOffIcon.jsx
│   │       ├── ImageIcon.jsx
│   │       ├── MusicIcon.jsx
│   │       ├── UsersIcon.jsx
│   │       └── XIcon.jsx
│   │
│   ├── molecules/              # Combinações de atoms com lógica de apresentação simples
│   │   ├── GalleryEmpty.jsx    # Estado vazio de galeria com ícone e mensagem
│   │   └── ImageCard.jsx       # Card de imagem com hover, blur e ícone de expandir
│   │
│   └── organisms/              # Blocos complexos com estado ou múltiplas responsabilidades
│       ├── Lightbox.jsx        # Modal de imagem expandida com navegação (teclado e clique)
│       └── Sidebar.jsx         # Navegação lateral colapsável com logo e rotas
│
├── constants/
│   └── routes.jsx              # Fonte única das rotas: path, label, icon, element
│
├── pages/
│   ├── Artes.jsx               # Galeria de imagens com upload, blur toggle e lightbox
│   ├── Sons.jsx                # (em construção) Gerenciamento de trilhas e efeitos
│   └── Personagens.jsx         # (em construção) Gerenciamento de personagens
│
├── App.jsx                     # Layout raiz: Sidebar + Routes
├── main.jsx                    # Entry point: BrowserRouter + StrictMode
└── index.css                   # Tailwind @import + @theme com paleta de cores
```

## Paleta de cores

Definida via `@theme` no `index.css` e acessível como classes Tailwind.

| Token               | Hex       | Uso                          |
|---------------------|-----------|------------------------------|
| `red-100`           | `#D72334` | Destaque, hover ativo        |
| `red-200`           | `#B91324` | Variação                     |
| `red-400`           | `#571623` | Tom escuro                   |
| `red-500`           | `#4B0F21` | Tom mais escuro              |
| `black-100`         | `#34353E` | Bordas claras                |
| `black-200`         | `#27282F` | Bordas, fundos secundários   |
| `black-300`         | `#282A2E` | Fundos de card               |
| `black-400`         | `#1E1F23` | Fundo da sidebar e header    |
| `black-500`         | `#17181C` | Fundo principal da página    |
| `white-100`         | `#F5F5F5` | Texto principal              |
| `white-200`         | `#EDEDED` | Texto secundário             |
| `white-300`         | `#C0C0C0` | Texto desabilitado/ícones    |
| `yellow`            | `#ECC83B` | Accent (futuro uso)          |
| `btn-from`          | `#D72334` | Gradient início botão primary|
| `btn-to`            | `#821325` | Gradient fim botão primary   |
| `btn-border`        | `#AA1A2C` | Borda botão primary          |
| `btn-secondary-border` | `#B11C2D` | Borda botão secondary     |
| `btn-secondary-text`   | `#CD2132` | Texto botão secondary     |

## Rotas

| Path            | Página          | Descrição                        |
|-----------------|-----------------|----------------------------------|
| `/`             | redirect        | Redireciona para `/sons`         |
| `/sons`         | Sons            | Trilhas e efeitos sonoros        |
| `/artes`        | Artes           | Galeria de imagens               |
| `/personagens`  | Personagens     | Fichas e personagens             |

As rotas são definidas em `src/constants/routes.jsx` — para adicionar uma nova página basta incluir uma entrada nesse array.

## Convenções

- Dados estáticos (listas, configurações) ficam em `src/constants/`, nunca inline em componentes.
- Ícones SVG são sempre encapsulados em componentes em `src/components/atoms/icons/` com props `size` e `className`.
- Estilos globais extras devem ser adicionados dentro de `@layer base {}` no `index.css` para não sobrescrever as utilities do Tailwind.
- O `BrowserRouter` vive no `main.jsx`; o `App.jsx` só contém layout e rotas.
