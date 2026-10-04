const readline = require('readline');

function calcularMultaAtraso(valor, dataVencimentoStr) {
    // Separa a string de data que chega no formato DD/MM/YYYY
    const partes = dataVencimentoStr.split('/');
    if (partes.length !== 3) {
        console.log("Erro: O formato da data deve ser DD/MM/YYYY.");
        return 0.0;
    }

    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // Mês no construtor Date do JS vai de 0 (Jan) a 11 (Dez)
    const ano = parseInt(partes[2], 10);

    // Constrói a data de vencimento (as horas zeram por padrão ao criar passando ano, mês, dia)
    const dataVenc = new Date(ano, mes, dia);
    
    // Pega a data atual e zera as horas para comparar apenas as datas, sem influência do relógio
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (hoje <= dataVenc) {
        console.log("O título não está vencido. Valor de juros: R$ 0.00");
        return 0.0;
    }

    // Calcula a diferença em milissegundos
    const diffTempo = hoje - dataVenc;
    
    // Converte milissegundos em dias (1000 ms * 60 seg * 60 min * 24 horas)
    const diasAtraso = Math.floor(diffTempo / (1000 * 60 * 60 * 24)); 
    
    const taxaDiaria = 0.025; // 2,5%
    
    // Cálculo de Juros Simples: Valor * (2.5% * dias de atraso)
    const juros = valor * taxaDiaria * diasAtraso;
    const valorTotal = valor + juros;

    // Utilitário para formatar moedas em BRL
    const formatoMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    
    console.log("\n--- Resumo de Atraso ---");
    console.log(`Data de Vencimento: ${dataVenc.toLocaleDateString('pt-BR')}`);
    console.log(`Data Atual:         ${hoje.toLocaleDateString('pt-BR')}`);
    console.log(`Dias de Atraso:     ${diasAtraso}`);
    console.log(`Valor Original:     ${formatoMoeda.format(valor)}`);
    console.log(`Juros Acumulados:   ${formatoMoeda.format(juros)}`);
    console.log(`Total Atualizado:   ${formatoMoeda.format(valorTotal)}`);
    console.log("------------------------\n");

    return juros;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Simulador de Multa por Atraso (2,5% ao dia)");
rl.question("Digite o valor do documento (ex: 1500.00): ", (entradaValor) => {
    rl.question("Digite a data de vencimento (DD/MM/YYYY): ", (entradaData) => {
        
        // Troca vírgula por ponto para o parse do JavaScript funcionar caso o usuário digite '1500,50'
        const valor = parseFloat(entradaValor.replace(',', '.'));
        
        if (isNaN(valor)) {
            console.log("Erro: Certifique-se de digitar um valor numérico válido.");
        } else {
            calcularMultaAtraso(valor, entradaData);
        }
        
        rl.close();
    });
});
