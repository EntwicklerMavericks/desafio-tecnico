const fs = require('fs');

function calcularComissao(valor) {
    // Regras de negócio:
    // - Abaixo de R$100,00 -> 0%
    // - Entre R$100,00 (inclusivo) e R$500,00 (exclusivo) -> 1%
    // - A partir de R$500,00 -> 5%
    if (valor < 100.0) {
        return 0.0;
    } else if (valor < 500.0) {
        return valor * 0.01;
    } else {
        return valor * 0.05;
    }
}

function processarVendas(caminhoArquivo) {
    try {
        // Lê o arquivo JSON de forma síncrona (como é um arquivo pequeno, não bloqueia o event loop de forma prejudicial)
        const rawData = fs.readFileSync(caminhoArquivo, 'utf8');
        const dados = JSON.parse(rawData);
        
        const comissoes = {};
        
        // Itera sobre o array de vendas
        for (const venda of dados.vendas) {
            const vendedor = venda.vendedor;
            const valor = venda.valor;
            
            // Inicializa o vendedor no objeto se ele ainda não existir
            if (comissoes[vendedor] === undefined) {
                comissoes[vendedor] = 0.0;
            }
            
            // Soma a comissão calculada para a venda atual no total do vendedor
            comissoes[vendedor] += calcularComissao(valor);
        }
        
        console.log("Comissões Totais por Vendedor:");
        console.log("-----------------------------------");
        
        // Formata a saída
        for (const [vendedor, comissaoTotal] of Object.entries(comissoes)) {
            // Utiliza o Intl para formatar no padrão de moeda Brasileiro (R$)
            const valorFormatado = new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
            }).format(comissaoTotal);
            
            console.log(`${vendedor}: ${valorFormatado}`);
        }
        
    } catch (erro) {
        console.error("Erro ao processar as vendas:", erro.message);
    }
}

// Executa a função passando o caminho do JSON
processarVendas('./vendas.json');
