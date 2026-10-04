const fs = require('fs');
const readline = require('readline');
const crypto = require('crypto'); // Módulo nativo do Node.js para gerar UUID

class EstoqueManager {
    /**
     * Classe responsável por gerenciar a leitura, persistência e as movimentações de estoque.
     */
    constructor(caminhoArquivo) {
        this.caminhoArquivo = caminhoArquivo;
        this.estoque = this.carregarEstoque();
    }

    carregarEstoque() {
        if (!fs.existsSync(this.caminhoArquivo)) {
            return [];
        }
        try {
            const rawData = fs.readFileSync(this.caminhoArquivo, 'utf8');
            const dados = JSON.parse(rawData);
            return dados.estoque || [];
        } catch (erro) {
            console.error("Erro ao ler o arquivo JSON. Retornando estoque vazio.", erro.message);
            return [];
        }
    }

    salvarEstoque() {
        const dados = { estoque: this.estoque };
        // Salva os dados no arquivo formatados com 2 espaços de indentação
        fs.writeFileSync(this.caminhoArquivo, JSON.stringify(dados, null, 2), 'utf8');
    }

    listarProdutos() {
        console.log("\n--- Produtos Atuais no Estoque ---");
        for (const prod of this.estoque) {
            console.log(`[${prod.codigoProduto}] ${prod.descricaoProduto} - Saldo: ${prod.estoque}`);
        }
        console.log("----------------------------------");
    }

    movimentarEstoque(codigoProduto, quantidade, tipo, descricao) {
        if (quantidade <= 0) {
            console.log("Erro: A quantidade deve ser maior que zero.");
            return null;
        }

        // Busca o produto pelo código
        const produto = this.estoque.find(p => p.codigoProduto === codigoProduto);
        
        if (!produto) {
            console.log(`Erro: Produto com código ${codigoProduto} não encontrado.`);
            return null;
        }

        const tipoUpper = tipo.toUpperCase();

        if (tipoUpper === 'SAIDA') {
            if (produto.estoque < quantidade) {
                console.log(`Erro: Saldo insuficiente. O produto tem apenas ${produto.estoque} em estoque.`);
                return null;
            }
            produto.estoque -= quantidade;
        } else if (tipoUpper === 'ENTRADA') {
            produto.estoque += quantidade;
        } else {
            console.log("Erro: Tipo de movimentação inválido. Use 'ENTRADA' ou 'SAIDA'.");
            return null;
        }

        // Cria o registro da movimentação gerando um ID único
        const movimentacao = {
            id: crypto.randomUUID(), 
            codigoProduto: codigoProduto,
            tipo: tipoUpper,
            quantidadeMovimentada: quantidade,
            descricao: descricao,
            saldoFinal: produto.estoque
        };
        
        // Persiste no JSON a atualização de saldo
        this.salvarEstoque();
        
        console.log("\n[Movimentação Registrada com Sucesso]");
        console.log(`ID: ${movimentacao.id} | Descrição: ${movimentacao.descricao}`);
        
        return produto.estoque;
    }
}

// Configuração da Interface de Linha de Comando (CLI) para ler inputs do usuário
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const manager = new EstoqueManager('./estoque.json');

function exibirMenu() {
    console.log("\nMenu Principal - Controle de Estoque");
    console.log("1. Ver Estoque");
    console.log("2. Lançar Movimentação");
    console.log("3. Sair");
    
    rl.question("Opção: ", (opcao) => {
        if (opcao === '1') {
            manager.listarProdutos();
            exibirMenu();
            
        } else if (opcao === '2') {
            rl.question("Código do Produto: ", (codigo) => {
                rl.question("Tipo da Movimentação (ENTRADA / SAIDA): ", (tipo) => {
                    rl.question("Quantidade: ", (qtd) => {
                        rl.question("Descrição / Motivo (ex: 'Compra', 'Venda'): ", (desc) => {
                            
                            const codigoNum = parseInt(codigo, 10);
                            const qtdNum = parseInt(qtd, 10);

                            if (isNaN(codigoNum) || isNaN(qtdNum)) {
                                console.log("Erro: Código e Quantidade devem ser números inteiros.");
                            } else {
                                const saldoFinal = manager.movimentarEstoque(codigoNum, qtdNum, tipo, desc);
                                if (saldoFinal !== null) {
                                    console.log(`-> Saldo atualizado do produto: ${saldoFinal}`);
                                }
                            }
                            exibirMenu();
                        });
                    });
                });
            });
            
        } else if (opcao === '3') {
            console.log("Saindo do sistema...");
            rl.close();
            
        } else {
            console.log("Opção inválida, tente novamente.");
            exibirMenu();
        }
    });
}

// Inicia a aplicação
exibirMenu();
