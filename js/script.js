document.addEventListener("DOMContentLoaded", () => { 
    // Espera o documento carregar completamente antes de executar o código
    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    // Cria uma lista com os nomes dos meses

    const tableBody = document.getElementById("tableBody");
    // Obtém a referência ao corpo da tabela onde os dados serão inseridos

    // Carregar dados armazenados no localStorage
    const savedData = JSON.parse(localStorage.getItem("salesData")) || {};
    // Carrega os dados de vendas armazenados no localStorage ou inicializa como um objeto vazio se não houver dados

    months.forEach((month, index) => {
        const row = document.createElement("tr");
        // Cria um elemento de linha para a tabela
        row.innerHTML = `
            <td>${month}</td>
            <td><input type="number" class="input" data-month="${index}" data-field="pieces" value="${savedData[index]?.pieces || ''}"></td>
            <td><input type="number" class="input" data-month="${index}" data-field="sales" value="${savedData[index]?.sales || ''}"></td>
            <td><input type="number" class="input" data-month="${index}" data-field="piecesPerSale" value="${savedData[index]?.piecesPerSale || ''}"></td>
            <td><input type="number" class="input" data-month="${index}" data-field="salesValue" value="${savedData[index]?.salesValue || ''}"></td>
            <td><input type="number" class="input" data-month="${index}" data-field="avgTicket" value="${savedData[index]?.avgTicket || ''}"></td>
        `;
        // Define o conteúdo HTML da linha com inputs para cada campo de dados
        tableBody.appendChild(row);
        // Adiciona a linha ao corpo da tabela

        // Adicionar linha de crescimento/decrescimento
        if (index > 0) {
            const growthRow = document.createElement("tr");
            // Cria uma linha para mostrar a variação de crescimento/decrescimento
            growthRow.innerHTML = `
                <td>Variação</td>
                <td id="growth-pieces-${index}"></td>
                <td id="growth-sales-${index}"></td>
                <td id="growth-piecesPerSale-${index}"></td>
                <td id="growth-salesValue-${index}"></td>
                <td id="growth-avgTicket-${index}"></td>
            `;
            // Define o conteúdo HTML da linha de variação
            tableBody.appendChild(growthRow);
            // Adiciona a linha de variação ao corpo da tabela
        }
    });

    document.querySelectorAll(".input").forEach(input => {
        input.addEventListener("input", (event) => {
            const month = event.target.dataset.month;
            const field = event.target.dataset.field;
            const value = event.target.value;
            // Captura o mês, campo e valor do input que foi modificado

            if (!savedData[month]) {
                savedData[month] = {};
            }
            // Inicializa o mês no objeto savedData se não existir

            savedData[month][field] = value;
            // Atualiza o valor do campo no objeto savedData

            localStorage.setItem("salesData", JSON.stringify(savedData));
            // Armazena os dados atualizados no localStorage

            // Atualizar crescimento/decrescimento
            updateGrowth();
            // Chama a função para atualizar as variações de crescimento/decrescimento
        });
    });

    function updateGrowth() {
        months.forEach((month, index) => {
            if (index > 0) {
                const prevData = savedData[index - 1] || {};
                const currData = savedData[index] || {};
                // Obtém os dados do mês anterior e do mês atual

                updateGrowthCell(`growth-pieces-${index}`, prevData.pieces, currData.pieces);
                updateGrowthCell(`growth-sales-${index}`, prevData.sales, currData.sales);
                updateGrowthCell(`growth-piecesPerSale-${index}`, prevData.piecesPerSale, currData.piecesPerSale);
                updateGrowthCell(`growth-salesValue-${index}`, prevData.salesValue, currData.salesValue);
                updateGrowthCell(`growth-avgTicket-${index}`, prevData.avgTicket, currData.avgTicket);
                // Atualiza as células de variação para cada campo de dados
            }
        });
    }

    function updateGrowthCell(cellId, prevValue, currValue) {
        const cell = document.getElementById(cellId);
        // Obtém a referência à célula de variação

        if (cell) {
            const prev = parseFloat(prevValue) || 0;
            const curr = parseFloat(currValue) || 0;
            // Converte os valores anteriores e atuais para números de ponto flutuante, ou 0 se forem inválidos

            const growth = ((curr - prev) / (prev || 1)) * 100;
            // Calcula a variação percentual entre os valores

            cell.textContent = `${growth.toFixed(2)}%`;
            // Define o conteúdo da célula como a variação percentual, formatada com duas casas decimais

            cell.classList.remove("variation-positive", "variation-negative");
            // Remove as classes de variação positiva e negativa

            if (growth > 0) {
                cell.classList.add("variation-positive");
                // Adiciona a classe de variação positiva se o crescimento for maior que 0
            } else if (growth < 0) {
                cell.classList.add("variation-negative");
                // Adiciona a classe de variação negativa se o crescimento for menor que 0
            }
        }
    }

    // Calcular crescimento/decrescimento inicial
    updateGrowth();
    // Chama a função para calcular as variações iniciais de crescimento/decrescimento
});
