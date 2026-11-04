# Consulta FIPE

Aplicação web para consultar preços de carros, motos e caminhões pela BrasilAPI.

## Como abrir

1. Baixe ou clone o projeto.
2. Abra `index.html` no navegador. Também pode usar a extensão Live Server no VS Code.
3. Escolha o tipo, a marca, o modelo e o ano/combustível.
4. Clique em **Consultar preço**.

A aplicação precisa de conexão com a internet para fazer as requisições à BrasilAPI.

## Organização

- `index.html`: estrutura e campos da página.
- `style.css`: aparência e adaptação para celular.
- `script.js`: eventos do DOM, chamadas `fetch`, carregamento e resultado.

## Rotas FIPE usadas

As consultas seguem a sequência documentada pela BrasilAPI:

1. `/marcas/v1/{tipo}`
2. `/veiculos/v1/{tipo}/{codigoDaMarca}`
3. `/anos/v1/{tipo}/{codigoDaMarca}/{codigoDoModelo}`
4. `/detalhes/v1/{tipo}/{codigoDaMarca}/{codigoDoModelo}/{codigoDoAno}`

## Repositório

O código-fonte está disponível no [GitHub](https://github.com/ricardosilva-lgtm/consulta-fipe).
