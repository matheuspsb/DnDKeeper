---
name: Tailwind v4 — CSS reset fora de @layer sobrescreve utilities
description: Reset CSS global (*) sem @layer tem prioridade sobre utilidades do Tailwind e anula classes como px-*, py-*, etc.
type: feedback
---

Nunca adicionar `* { margin: 0; padding: 0; box-sizing: border-box; }` fora de um `@layer` em projetos Tailwind v4.

**Why:** Estilos fora de `@layer` têm precedência sobre estilos dentro de qualquer layer (incluindo `@layer utilities`). O resultado é que todas as classes `px-*`, `py-*`, `m-*`, etc. do Tailwind são silenciosamente sobrescritas pelo seletor `*`, sem nenhum erro no console — a mudança simplesmente não surte efeito no layout.

**How to apply:** O `@import "tailwindcss"` já inclui o Preflight (reset) corretamente dentro do `@layer base`. Não duplicar esse reset. Se precisar de algum estilo global extra, colocá-lo dentro de `@layer base { }`.
