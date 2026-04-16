---
name: Projeto usa TypeScript — sempre
description: Todo código novo neste projeto deve ser escrito em TypeScript (.ts/.tsx), nunca JavaScript puro.
type: feedback
---

Sempre usar TypeScript neste projeto. Nenhum arquivo novo deve ser criado como `.js` ou `.jsx`.

**Why:** O usuário definiu TypeScript como padrão do projeto. Criar arquivos `.js`/`.jsx` é um erro de convenção que exige retrabalho.

**How to apply:** Todo arquivo novo usa extensão `.ts` ou `.tsx`. Tipos devem ser definidos explicitamente onde não houver inferência clara. Isso inclui services, hooks, components, constants e pages.
