# 📊 FinMarket — Simulador de Mercado Financeiro

![FinMarket Favicon](favicon.svg)

O **FinMarket** é uma plataforma web responsiva de simulação de investimentos e gerenciamento de carteira de ativos em tempo real. O projeto foi desenvolvido com foco em performance, acessibilidade e uma experiência de usuário (UX) fluida, simulando operações de compra e venda de ações, títulos de renda fixa, moedas estrangeiras e criptoativos.

---

## 🚀 Funcionalidades Principais

* **Banca Inicial de R$ 1.000.000,00:** Cada usuário começa com um saldo fictício substancial para montar sua estratégia de alocação de ativos.
* **Vitrine Dinâmica com 30 Ativos:** Listagem e categorização realista de 10 Ações (B3), 10 Títulos de Renda Fixa (Públicos e Privados) e 10 Moedas/Criptoativos.
* **Gerenciamento de Carteira em Tempo Real:** Sincronização instantânea de saldos na Navbar (global) e no painel principal da Dashboard ao comprar ou vender ativos.
* **Sistema de Notificações Inteligente (Fila de Toasts):** Alertas flutuantes de sucesso ou erro limitados a no máximo 3 notificações simultâneas na tela, evitando poluição visual (*Spam*).
* **Persistência de Dados Localizada:** Integração total com o `localStorage` do navegador através de uma camada `DataStore`, garantindo que o saldo, histórico e carteira não sumam ao atualizar ou mudar de página.
* **Tema Dark & Light Nativo (Anti-Flash):** Sistema de troca de temas que armazena a preferência do usuário e previne o efeito de "piscada branca" (*FOUC*) durante o carregamento das páginas.

---

## 🛠️ Tecnologias Utilizadas

O projeto adota uma abordagem moderna e limpa de desenvolvimento, utilizando apenas tecnologias web nativas (**Vanilla Architecture**), sem a dependência de frameworks pesados:

* **HTML5:** Estrutura semântica e acessível (regras ARIA).
* **CSS3 Avançado:** Layout baseado em CSS Grids e Flexbox, design 100% responsivo e uso extensivo de *CSS Variables* para gerenciamento dinâmico de temas.
* **JavaScript (ES6+):** Organizado de forma modular utilizando `import/export` nativo do navegador, separando responsabilidades (Renderers, Stores, Configurações).

---

⚙️ Como Executar o Projeto Localmente
Como o projeto utiliza Módulos JavaScript nativos (type="module"), por questões de segurança do navegador (regras de CORS), os arquivos não podem ser abertos clicando duas vezes diretamente sobre o .html. É necessário rodá-los a partir de um servidor local.

Método Recomendado (VS Code):
Instale a extensão Live Server no seu VS Code.

Abra a pasta raiz do projeto.

Clique com o botão direito no arquivo index.html e selecione "Open with Live Server".

O navegador abrirá automaticamente o projeto no endereço http://127.0.0.1:5500.

Método Alternativo (Node.js/Terminal):
Caso tenha o Node.js instalado, você pode rodar na raiz do projeto:

# Instalar um servidor estático leve de forma global
npm install -g serve

# Iniciar o servidor na raiz do projeto
serve .
📝 Próximos Passos (Roadmap)
[ ] Implementar gráficos de linha de evolução patrimonial na Dashboard.

[ ] Adicionar um sistema de oscilação randômica de preços a cada X segundos simulando um mercado volátil.

[ ] Criar aba de metas financeiras e conquistas para gamificar a experiência do investidor.

[ ] Lançar BD e sistema de logon completo.

Desvolvido por [[Deyverson Lima](https://github.com/DeyversonLima)]
