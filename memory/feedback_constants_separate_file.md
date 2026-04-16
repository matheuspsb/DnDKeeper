---
name: Dados estáticos sempre em src/constants/
description: Arrays e objetos de dados estáticos (como listas de nav, opções, configs) devem ficar em arquivos separados dentro de src/constants/, nunca inline no componente.
type: feedback
---

Nunca declarar arrays ou objetos de dados estáticos diretamente dentro de um componente ou página.

**Why:** O usuário prefere separação clara entre dados e apresentação. Manter dados inline no componente polui o arquivo e dificulta reuso.

**How to apply:** Sempre que houver um array/objeto estático (ex: itens de navegação, listas de opções, configurações), criar um arquivo dedicado em `src/constants/` e importá-lo onde necessário.
