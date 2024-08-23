document.addEventListener("DOMContentLoaded", () => {
    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const tableBody = document.getElementById("tableBody");
    const savedData = JSON.parse(localStorage.getItem("salesData")) || {};

    months.forEach((month, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="month-name">${month}</td>
            <td><input type="number" class="input" data-month="${index}" data-field="pieces" value="${savedData[index]?.pieces || ''}"></td>
            <td><input type="number" class="input" data-month="${index}" data-field="sales" value="${savedData[index]?.sales || ''}"></td>
            <td><input type="number" class="input" data-month="${index}" data-field="piecesPerSale" value="${savedData[index]?.piecesPerSale || ''}"></td>
            <td><input type="number" class="input" data-month="${index}" data-field="salesValue" value="${savedData[index]?.salesValue || ''}"></td>
            <td><input type="number" class="input" data-month="${index}" data-field="avgTicket" value="${savedData[index]?.avgTicket || ''}"></td>
        `;
        tableBody.appendChild(row);

        // Adiciona linha de variação abaixo da linha de Janeiro (índice 0) também
        const growthRow = document.createElement("tr");
        growthRow.innerHTML = `
            <td>${index === 0 ? 'Variação (base)' : 'Variação'}</td>
            <td id="growth-pieces-${index}"></td>
            <td id="growth-sales-${index}"></td>
            <td id="growth-piecesPerSale-${index}"></td>
            <td id="growth-salesValue-${index}"></td>
            <td id="growth-avgTicket-${index}"></td>
        `;
        tableBody.appendChild(growthRow);
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
            } else {
                // Linha de variação para Janeiro
                updateGrowthCell(`growth-pieces-${index}`, 0, savedData[index]?.pieces);
                updateGrowthCell(`growth-sales-${index}`, 0, savedData[index]?.sales);
                updateGrowthCell(`growth-piecesPerSale-${index}`, 0, savedData[index]?.piecesPerSale);
                updateGrowthCell(`growth-salesValue-${index}`, 0, savedData[index]?.salesValue);
                updateGrowthCell(`growth-avgTicket-${index}`, 0, savedData[index]?.avgTicket);
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

            cell.classList.remove("variation-positive", "variation-negative");

            if (growth > 0) {
                cell.classList.add("variation-positive");
            } else if (growth < 0) {
                cell.classList.add("variation-negative");
            }
        }
    }

    updateGrowth();

    document.getElementById("savePdf").addEventListener("click", () => {
        const element = document.body; // Define o conteúdo que será convertido em PDF

        const opt = {
            margin:       1,
            filename:     'VendaVision_365.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save();
        // Usa a biblioteca html2pdf para gerar e salvar o PDF
    });
});
