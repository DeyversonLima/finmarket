# Arquitetura do FinMarket

O FinMarket é uma aplicação estática: não há backend, etapa de build ou dependências de produção. O navegador carrega módulos JavaScript nativos e mantém os dados da demonstração no `localStorage`.

## Estado e persistência

`src/js/modules/store.js` é a fonte única de estado. Ele contém saldo disponível, posições, transações, ordens, perfil e tema. Toda mudança passa por `store.update()`, que sanitiza e persiste o novo estado antes de notificar a interface.

O documento persistido usa a chave `finmarket:v2` e inclui uma versão de schema. Na primeira execução da versão atual, os campos legados são migrados. Escritas de outras abas são recebidas pelo evento `storage`.

## Mercado simulado

`market.js` reúne o catálogo e produz cotações fictícias determinísticas por ativo e data. O mesmo ativo tem a mesma cotação durante o dia, sem sugerir conexão com mercado real.

`trading.js` valida e registra ordens. Ordens a mercado são executadas imediatamente. Ordens limitadas permanecem abertas quando o preço definido ainda não foi atingido e podem ser canceladas na página de ordens. Cada execução atualiza saldo, posição, preço médio, ordem e histórico em uma única atualização do estado.

## Interface

`main.js` inicializa os controladores e coordena renderizações após mudanças no estado. Os módulos de renderização não expõem funções no objeto `window`; ações são identificadas por atributos `data-*` e tratadas por delegação de eventos.

O formulário de negociação usa o elemento nativo `<dialog>`, foco gerenciado pelo navegador, fechamento por `Escape`, backdrop, validação nativa dos campos e layout responsivo. As cores são derivadas dos mesmos tokens usados pelos temas claro e escuro.

## Qualidade

`npm run check` executa:

1. verificação de sintaxe dos módulos JavaScript;
2. validação de todos os documentos HTML;
3. testes unitários do estado, mercado e regras de negociação;
4. teste de integração do catálogo e de uma compra completa.

O mesmo comando é executado pelo workflow de CI em pushes e pull requests.
