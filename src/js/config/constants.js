export const INITIAL_BALANCE = 1000000;

export const PRODUCTS = {
    assets: [
        { id: 'PETR4', name: 'Petrobras PN', ticker: 'PETR4', type: 'Ação', price: 36.50, description: 'Maior empresa de energia e exploração de petróleo da América Latina.' },
        { id: 'VALE3', name: 'Vale ON', ticker: 'VALE3', type: 'Ação', price: 62.80, description: 'Líder global na produção de minério de ferro e pelotas.' },
        { id: 'ITUB4', name: 'Itaú Unibanco PN', ticker: 'ITUB4', type: 'Ação', price: 34.20, description: 'Maior instituição bancária privada do Brasil e da América Latina.' },
        { id: 'BBDC4', name: 'Bradesco PN', ticker: 'BBDC4', type: 'Ação', price: 13.95, description: 'Um dos maiores grupos financeiros do país, com forte presença nacional.' },
        { id: 'ABEV3', name: 'Ambev ON', ticker: 'ABEV3', type: 'Ação', price: 12.45, description: 'Gigante das Américas na produção de bebidas, cervejas e refrigerantes.' },
        { id: 'WEGE3', name: 'Weg ON', ticker: 'WEGE3', type: 'Ação', price: 42.10, description: 'Multinacional brasileira líder na fabricação de motores elétricos e automação.' },
        { id: 'BBAS3', name: 'Banco do Brasil ON', ticker: 'BBAS3', type: 'Ação', price: 27.35, description: 'Instituição financeira pública com forte atuação no agronegócio nacional.' },
        { id: 'B3SA3', name: 'B3 ON', ticker: 'B3SA3', type: 'Ação', price: 11.15, description: 'Companhia oficial responsável pela bolsa de valores e mercados organizados do Brasil.' },
        { id: 'MGLU3', name: 'Magazine Luiza ON', ticker: 'MGLU3', type: 'Ação', price: 12.80, description: 'Uma das maiores plataformas digitais do ecossistema varejista brasileiro.' },
        { id: 'ELET3', name: 'Eletrobras ON', ticker: 'ELET3', type: 'Ação', price: 39.40, description: 'Líder nacional em geração e transmissão de energia elétrica após privatização.' }
    ],
    liabilities: [
        { id: 'TESOURO_SELIC', name: 'Tesouro Selic 2029', ticker: 'LFT', type: 'Renda Fixa', price: 14250.00, description: 'Título público federal ideal para reserva de emergência com liquidez diária.' },
        { id: 'TESOURO_IPCA', name: 'Tesouro IPCA+ 2035', ticker: 'NTN-B', type: 'Renda Fixa', price: 3250.00, description: 'Título público que garante rendimento real acima da inflação medida pelo IPCA.' },
        { id: 'CDB_DIARIO', name: 'CDB Liquidez Diária', ticker: 'CDB-LD', type: 'CDB', price: 1000.00, description: 'CDB de grande banco privado rendendo 100% do CDI com resgate imediato.' },
        { id: 'CDB_PREFIXADO', name: 'CDB Prefixado 12%', ticker: 'CDB-PRE', type: 'CDB', price: 5000.00, description: 'CDB com taxa fixa garantida até o vencimento, protegido pelo FGC.' },
        { id: 'LCI_90DIAS', name: 'LCI Isenta 90 Dias', ticker: 'LCI-DI', type: 'LCI', price: 1000.00, description: 'Letra de Crédito Imobiliário com rendimento atrelado ao CDI e isenção de IR.' },
        { id: 'LCA_AGRO', name: 'LCA Agronegócio', ticker: 'LCA-PRE', type: 'LCA', price: 2500.00, description: 'Letra de Crédito do Agronegócio isenta de Imposto de Renda para pessoa física.' },
        { id: 'DEB_VALE', name: 'Debênture Infra Vale', ticker: 'DEB-INFRA', type: 'Debênture', price: 1080.00, description: 'Debênture incentivada de infraestrutura emitida pela Vale com isenção de IR.' },
        { id: 'CRI_LOGISTICA', name: 'CRI Galpões Logísticos', ticker: 'CRI', type: 'CRI', price: 1025.00, description: 'Certificado de Recebíveis Imobiliários lastreado em aluguéis corporativos.' },
        { id: 'CRA_GRAOS', name: 'CRA Cooperativa Agrícola', ticker: 'CRA', type: 'CRA', price: 1012.00, description: 'Certificado de Recebíveis do Agronegócio indexado a uma porcentagem do CDI.' },
        { id: 'LC_FINANCEIRA', name: 'Letra de Câmbio XYZ', ticker: 'LC', type: 'Renda Fixa', price: 5000.00, description: 'Letra de Câmbio de financeira de médio porte com retorno diferenciado.' }
    ],
    currencies: [
        { id: 'USD', name: 'Dólar Americano', ticker: 'USD', type: 'Moeda', price: 5.15, description: 'A principal moeda de reserva internacional e referência para o comércio global.' },
        { id: 'EUR', name: 'Euro', ticker: 'EUR', type: 'Moeda', price: 5.58, description: 'Moeda oficial da Zona do Euro, emitida pelo Banco Central Europeu.' },
        { id: 'GBP', name: 'Libra Esterlina', ticker: 'GBP', type: 'Moeda', price: 6.52, description: 'Moeda oficial do Reino Unido, uma das divisas mais antigas e valorizadas do mundo.' },
        { id: 'JPY', name: 'Iene Japonês', ticker: 'JPY', type: 'Moeda', price: 0.033, description: 'Moeda oficial do Japão, amplamente utilizada como ativo de proteção global.' },
        { id: 'CHF', name: 'Franco Suíço', ticker: 'CHF', type: 'Moeda', price: 5.72, description: 'Divisa oficial da Suíça, historicamente reconhecida como porto seguro financeiro.' },
        { id: 'AUD', name: 'Dólar Australiano', ticker: 'AUD', type: 'Moeda', price: 3.42, description: 'Moeda oficial da Austrália, fortemente correlacionada ao mercado global de commodities.' },
        { id: 'CAD', name: 'Dólar Canadense', ticker: 'CAD', type: 'Moeda', price: 3.76, description: 'Moeda oficial do Canadá, de grande relevância no mercado norte-americano.' },
        { id: 'BTC', name: 'Bitcoin', ticker: 'BTC', type: 'Cripto', price: 345000.00, description: 'A primeira e maior criptomoeda descentralizada do mundo por capitalização de mercado.' },
        { id: 'ETH', name: 'Ethereum', ticker: 'ETH', type: 'Cripto', price: 18450.00, description: 'Plataforma blockchain descentralizada pioneira na execução de contratos inteligentes.' },
        { id: 'SOL', name: 'Solana', ticker: 'SOL', type: 'Cripto', price: 820.00, description: 'Criptomoeda focada em alta escalabilidade, transações rápidas e baixo custo.' }
    ]
};