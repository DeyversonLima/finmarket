# FinMarket

[![CI](https://github.com/DeyversonLima/finmarket/actions/workflows/ci.yml/badge.svg)](https://github.com/DeyversonLima/finmarket/actions/workflows/ci.yml)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=111)](https://developer.mozilla.org/docs/Web/JavaScript)

Simulador educacional de mercado financeiro e carteira de investimentos, construído com HTML, CSS e JavaScript modular. A aplicação roda inteiramente no navegador e usa dados fictícios para demonstrar compra, venda, histórico e persistência local.

> O FinMarket não consulta cotações reais e não oferece recomendação de investimento. Valores e ativos exibidos servem somente para demonstração de software.

## Recursos

- catálogo com 30 ativos simulados;
- busca por nome ou ticker;
- ordens de compra e venda;
- carteira e saldo atualizados após cada operação;
- histórico de transações;
- perfil e preferências persistidos no navegador;
- fila de notificações;
- tema claro/escuro com preferência salva;
- layout responsivo e menu para dispositivos móveis.

## Executar

Não há etapa de build nem dependências de produção.

```bash
git clone https://github.com/DeyversonLima/finmarket.git
cd finmarket
python -m http.server 8000
```

Abra `http://localhost:8000`. O arquivo da raiz encaminha para a aplicação em `src/pages/index.html`, o que também permite publicação como site estático.

Também é possível abrir `src/pages/index.html` diretamente, embora um servidor local ofereça comportamento mais próximo do deploy.

## Estrutura

```text
src/
├── css/                 # estilos globais e por página
├── js/
│   ├── config/          # constantes e catálogo simulado
│   └── modules/         # carteira, transações, tema, busca e UI
├── pages/               # telas da aplicação
└── public/              # favicons
index.html               # entrada para hospedagem estática
```

## Persistência e privacidade

Os dados são armazenados em `localStorage` no próprio navegador. Nenhuma informação é enviada para servidor. Limpar os dados do site no navegador também redefine saldo, histórico e preferências.

## Qualidade

```bash
find src/js -name '*.js' -print0 | xargs -0 -n1 node --check
```

O workflow de CI executa a verificação de sintaxe e confirma que as entradas da publicação existem.

## Decisões técnicas

- módulos separados por responsabilidade evitam um único arquivo JavaScript monolítico;
- `localStorage` mantém a demonstração simples e independente de backend;
- propriedades customizadas de CSS centralizam temas e tokens visuais;
- dados simulados deixam claro o limite entre protótipo de interface e produto financeiro.

## Próximos passos

- testes automatizados das regras de transação;
- gráficos de evolução da carteira;
- importação e exportação de uma carteira de demonstração;
- camada opcional de API para cotações reais, com aviso de atraso e fonte dos dados.

Projeto pessoal de [Deyverson Lima](https://github.com/DeyversonLima), criado para praticar JavaScript modular, estado no navegador e experiência de produto.
