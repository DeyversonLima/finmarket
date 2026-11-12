# FinMarket

[![CI](https://github.com/DeyversonLima/finmarket/actions/workflows/ci.yml/badge.svg)](https://github.com/DeyversonLima/finmarket/actions/workflows/ci.yml)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=111)](https://developer.mozilla.org/docs/Web/JavaScript)

Simulador educacional de mercado financeiro e carteira de investimentos, construído com HTML, CSS e JavaScript modular. A aplicação roda inteiramente no navegador e usa dados fictícios para demonstrar compra, venda, histórico e persistência local.

> O FinMarket não consulta cotações reais e não oferece recomendação de investimento. Valores e ativos exibidos servem somente para demonstração de software.

## Recursos

- catálogo com 30 ativos simulados;
- busca por nome ou ticker;
- ordens a mercado e limitadas, com execução e cancelamento;
- escolha de quantidade e cálculo de preço médio;
- formulário de negociação responsivo e adaptado aos temas claro e escuro;
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

## Desenvolvimento e testes

Use Node.js 22 ou mais recente para executar as verificações locais:

```bash
npm ci
npm run check
```

O comando valida a sintaxe JavaScript, a estrutura HTML e os testes automatizados do estado, das cotações simuladas e do fluxo de compra.

## Estrutura

```text
src/
├── css/                 # estilos globais e por página
├── js/
│   ├── config/          # constantes e catálogo simulado
│   └── modules/         # estado, mercado, ordens, carteira, tema e UI
├── pages/               # telas da aplicação
└── public/              # favicons
test/                    # testes unitários e de integração
scripts/                 # verificações usadas localmente e na CI
index.html               # entrada para hospedagem estática
```

Uma descrição do estado, dos módulos e dos fluxos principais está disponível em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Persistência e privacidade

Os dados são armazenados em um estado local versionado no `localStorage` do próprio navegador. Nenhuma informação é enviada para servidor. A aplicação valida dados persistidos, migra o formato legado e sincroniza alterações entre abas.

## Qualidade

O workflow de CI instala as dependências de forma reproduzível e executa `npm run check` em cada push e pull request.

## Decisões técnicas

- módulos separados por responsabilidade evitam um único arquivo JavaScript monolítico;
- `localStorage` mantém a demonstração simples e independente de backend;
- propriedades customizadas de CSS centralizam temas e tokens visuais;
- dados simulados deixam claro o limite entre protótipo de interface e produto financeiro.

## Próximos passos

- ampliar os testes de interface para todas as páginas;
- gráficos de evolução da carteira;
- importação e exportação de uma carteira de demonstração;
- camada opcional de API para cotações reais, com aviso de atraso e fonte dos dados.

Projeto pessoal de [Deyverson Lima](https://github.com/DeyversonLima), criado para praticar JavaScript modular, estado no navegador e experiência de produto.
