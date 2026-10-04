# Desafio Técnico

Solução desenvolvida em **JavaScript / Node.js**, com scripts individuais para execução em linha de comando e uma **Interface Web Integrada (`index.html`)** para visualização e interação com os módulos.

---

## Estrutura do Repositório

```text
├── index.html       # Painel web com os 3 módulos integrados
├── desafio_1.js     # Script Node.js: Cálculo de comissões de vendas
├── desafio_2.js     # Script Node.js: Gestão e movimentação de estoque
├── desafio_3.js     # Script Node.js: Cálculo de juros e multa por atraso
├── vendas.json      # Dados de vendas para o Desafio 1
└── estoque.json     # Dados de inventário para o Desafio 2
```

---

## Como Executar

### 1. Interface Web (`index.html`)
Para abrir o painel interativo no navegador:
- Dê um duplo-clique no arquivo `index.html`; ou
- No terminal:
  ```powershell
  start index.html
  ```

### 2. Scripts de Linha de Comando (Node.js)

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado. No terminal, dentro da pasta do projeto:

#### Desafio 1 - Comissões de Vendas
Lê `vendas.json`, aplica as alíquotas por faixa de valor e exibe o total consolidado por vendedor:
```bash
node desafio_1.js
```

#### Desafio 2 - Movimentação de Estoque
CLI interativa que permite consultar saldos e realizar movimentações com validação de saldo e identificador único:
```bash
node desafio_2.js
```

#### Desafio 3 - Cálculo de Multa por Atraso
Calcula os dias de atraso a partir de uma data de vencimento informada e aplica a taxa de 2,5% ao dia:
```bash
node desafio_3.js
```

---

## Regras de Negócio Implementadas

### Módulo 1: Comissões
- Abaixo de R$ 100,00: **Sem comissão (0%)**
- De R$ 100,00 a R$ 499,99: **1%**
- A partir de R$ 500,00: **5%**

### Módulo 2: Estoque
- Cada movimentação gera um identificador único via `crypto.randomUUID()`.
- Validação para impedir saídas maiores do que a quantidade disponível em estoque.
- Exibição e retorno da quantidade final após cada lançamento.

### Módulo 3: Juros / Multa
- Multa diária calculada em **2,5% ao dia** de atraso.
- Tratamento de datas com normalização de horários (`setHours(0,0,0,0)`) para contagem precisa de dias corridos em relação à data atual.