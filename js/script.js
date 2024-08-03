document.addEventListener("DOMContentLoaded", () => {
    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const tableBody = document.getElementById("tableBody");

    // Carregar dados armazenados no localStorage
    const savedData = JSON.parse(localStorage.getItem("salesData")) || {};

    months.forEach((month, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${month}</td>
            <td><input type="number" class="input" data-month="${index}" data-field="pieces" value="${savedData[index]?.pieces || ''}"></td>
            <td><input type="number" class="input" data-month="${index}" data-field="sales" value="${savedData[index]?.sales || ''}"></td>
            <td><input type="number" class="input" data-month="${index}" data-field="piecesPerSale" value="${savedData[index]?.piecesPerSale || ''}"></td>
            <td><input type="number" class="input" data-month="${index}" data-field="salesValue" value="${savedData[index]?.salesValue || ''}"></td>
            <td><input type="number" class="input" data-month="${index}" data-field="avgTicket" value="${savedData[index]?.avgTicket || ''}"></td>
        `;
        tableBody.appendChild(row);

        // Adicionar linha de crescimento/decrescimento
        if (index > 0) {
            const growthRow = document.createElement("tr");
            growthRow.innerHTML = `
                <td>Variação</td>
                <td id="growth-pieces-${index}"></td>
                <td id="growth-sales-${index}"></td>
                <td id="growth-piecesPerSale-${index}"></td>
                <td id="growth-salesValue-${index}"></td>
                <td id="growth-avgTicket-${index}"></td>
            `;
            tableBody.appendChild(growthRow);
        }
    });

    document.querySelectorAll(".input").forEach(input => {
        input.addEventListener("input", (event) => {
            const month = event.target.dataset.month;
            const field = event.target.dataset.field;
            const value = event.target.value;

            if (!savedData[month]) {
                savedData[month] = {};
            }

            savedData[month][field] = value;
            localStorage.setItem("salesData", JSON.stringify(savedData));

            // Atualizar crescimento/decrescimento
            updateGrowth();
        });
    });

    function updateGrowth() {
        months.forEach((month, index) => {
            if (index > 0) {
                const prevData = savedData[index - 1] || {};
                const currData = savedData[index] || {};

                updateGrowthCell(`growth-pieces-${index}`, prevData.pieces, currData.pieces);
                updateGrowthCell(`growth-sales-${index}`, prevData.sales, currData.sales);
                updateGrowthCell(`growth-piecesPerSale-${index}`, prevData.piecesPerSale, currData.piecesPerSale);
                updateGrowthCell(`growth-salesValue-${index}`, prevData.salesValue, currData.salesValue);
                updateGrowthCell(`growth-avgTicket-${index}`, prevData.avgTicket, currData.avgTicket);
            }
        });
    }

    function updateGrowthCell(cellId, prevValue, currValue) {
        const cell = document.getElementById(cellId);
        if (cell) {
            const prev = parseFloat(prevValue) || 0;
            const curr = parseFloat(currValue) || 0;
            const growth = ((curr - prev) / (prev || 1)) * 100;
            cell.textContent = `${growth.toFixed(2)}%`;
        }
    }

    // Calcular crescimento/decrescimento inicial
    updateGrowth();
});
