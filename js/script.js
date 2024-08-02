document.addEventListener("DOMContentLoaded", function () {
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const tableBody = document.getElementById("tableBody");

    months.forEach((month, index) => {
        // Adiciona uma divisória antes de cada linha do mês
        if (index > 0) {
            const divider = document.createElement("tr");
            divider.classList.add("divisoria");
            const dividerTd = document.createElement("td");
            dividerTd.colSpan = 6;
            divider.appendChild(dividerTd);
            tableBody.appendChild(divider);
        }

        const row = document.createElement("tr");

        const monthCell = document.createElement("td");
        monthCell.textContent = month;
        row.appendChild(monthCell);

        for (let i = 0; i < 5; i++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.addEventListener("input", updateVariations);
            cell.appendChild(input);
            row.appendChild(cell);
        }

        tableBody.appendChild(row);

        // Adiciona linha de variação
        const variationRow = document.createElement("tr");
        for (let i = 0; i < 6; i++) {
            const cell = document.createElement("td");
            if (i > 0) {
                cell.classList.add("variation-cell");
            }
            variationRow.appendChild(cell);
        }
        tableBody.appendChild(variationRow);
    });

    function updateVariations() {
        const rows = tableBody.querySelectorAll("tr");
        for (let i = 2; i < rows.length; i += 2) {
            const previousRow = rows[i - 2].querySelectorAll("input");
            const currentRow = rows[i].querySelectorAll("input");
            const variationCells = rows[i + 1].querySelectorAll(".variation-cell");

            previousRow.forEach((prevInput, index) => {
                const prevValue = parseFloat(prevInput.value);
                const currentValue = parseFloat(currentRow[index].value);
                if (!isNaN(prevValue) && !isNaN(currentValue)) {
                    const variation = ((currentValue - prevValue) / prevValue) * 100;
                    variationCells[index].textContent = `${variation.toFixed(2)}%`;
                    variationCells[index].classList.remove("variation-positive", "variation-negative");
                    if (variation > 0) {
                        variationCells[index].classList.add("variation-positive");
                    } else if (variation < 0) {
                        variationCells[index].classList.add("variation-negative");
                    }
                } else {
                    variationCells[index].textContent = "";
                    variationCells[index].classList.remove("variation-positive", "variation-negative");
                }
            });
        }
    }
});

