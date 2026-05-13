const pages =
document.querySelectorAll(".page");

const REPAIR_CALCULATOR_COUNT = 4;

let repairCalculators = [];
let repairs =
JSON.parse(localStorage.getItem("blackline_repairs")) || [];

let tunings =
JSON.parse(localStorage.getItem("blackline_tunings")) || [];

function showPage(pageId) {

    pages.forEach(page => {
        page.classList.remove("active");
    });

    document
    .getElementById(pageId)
    .classList.add("active");
}

function createEmptyRepairCalculator() {

    return {
        customer: "",
        vehicle: "",
        plate: "",
        employee: "",
        discount: 0,
        items: []
    };
}

function initRepairCalculators() {

    repairCalculators = [];

    for(let i = 0; i < REPAIR_CALCULATOR_COUNT; i++) {
        repairCalculators.push(createEmptyRepairCalculator());
    }

    renderRepairCalculators();
}

function renderRepairCalculators() {

    for(let i = 0; i < REPAIR_CALCULATOR_COUNT; i++) {

        const box =
        document.getElementById("repairCalculator" + (i + 1));

        const calc =
        repairCalculators[i];

        let options = "";

        BLACKLINE_CONFIG.repairItems.forEach((item, index) => {
            options += `
                <option value="${index}">
                    ${item.name} (${item.price}$)
                </option>
            `;
        });

        let selectedItems = "";

        calc.items.forEach((item, itemIndex) => {
            selectedItems += `
                <div class="job-item">
                    <b>${item.name}</b><br>
                    Menge: ${item.amount}<br>
                    Einzelpreis: ${item.price}$<br>
                    Gesamt: ${item.total}$<br>

                    <button onclick="removeRepairItem(${i}, ${itemIndex})">
                        Entfernen
                    </button>
                </div>
            `;
        });

        box.innerHTML = `
            <input
                type="text"
                placeholder="Kunde"
                value="${calc.customer}"
                oninput="repairCalculators[${i}].customer = this.value"
            >

            <input
                type="text"
                placeholder="Fahrzeug"
                value="${calc.vehicle}"
                oninput="repairCalculators[${i}].vehicle = this.value"
            >

            <input
                type="text"
                placeholder="Kennzeichen"
                value="${calc.plate}"
                oninput="repairCalculators[${i}].plate = this.value"
            >

            <input
                type="text"
                placeholder="Mitarbeiter"
                value="${calc.employee}"
                oninput="repairCalculators[${i}].employee = this.value"
            >

            <div class="repair-add-row">
                <select id="repairSelect${i}">
                    ${options}
                </select>

                <input
                    type="number"
                    id="repairAmount${i}"
                    value="1"
                    min="1"
                >

                <button onclick="addRepairItem(${i})">
                    Hinzuf&uuml;gen
                </button>
            </div>

            <div class="selected-list">
                ${selectedItems}
            </div>

            <div class="discount-row">
                <label>Rabatt in %</label>

                <input
                    type="number"
                    value="${calc.discount}"
                    min="0"
                    max="100"
                    oninput="repairCalculators[${i}].discount = Number(this.value); renderRepairCalculators();"
                >
            </div>

            <div class="total-box">
                Gesamt:
                <span>${calculateRepairTotal(calc).toFixed(0)} $</span>
            </div>

            <button onclick="saveRepair(${i})">
                Reparatur speichern
            </button>

            <button onclick="resetRepairCalculator(${i})">
                Rechner leeren
            </button>
        `;
    }
}

function addRepairItem(calcIndex) {

    const select =
    document.getElementById("repairSelect" + calcIndex);

    const amount =
    Number(document.getElementById("repairAmount" + calcIndex).value);

    const item =
    BLACKLINE_CONFIG.repairItems[select.value];

    repairCalculators[calcIndex].items.push({
        name: item.name,
        price: item.price,
        amount: amount,
        total: item.price * amount
    });

    renderRepairCalculators();
}

function removeRepairItem(calcIndex, itemIndex) {

    repairCalculators[calcIndex].items.splice(itemIndex, 1);

    renderRepairCalculators();
}

function calculateRepairTotal(calc) {

    let total = 0;

    calc.items.forEach(item => {
        total += item.total;
    });

    const discount =
    Number(calc.discount) || 0;

    return total - (total * (discount / 100));
}

function saveRepair(calcIndex) {

    const calc =
    repairCalculators[calcIndex];

    if(
        !calc.customer ||
        !calc.vehicle ||
        !calc.employee ||
        calc.items.length === 0
    ) {
        alert("Bitte Kunde, Fahrzeug, Mitarbeiter und mindestens eine Arbeit eintragen.");
        return;
    }

    const total =
    calculateRepairTotal(calc);

    repairs.push({
        customer: calc.customer,
        vehicle: calc.vehicle,
        plate: calc.plate,
        employee: calc.employee,
        discount: calc.discount,
        items: calc.items,
        total: total,
        time: new Date().toLocaleString()
    });

    localStorage.setItem(
        "blackline_repairs",
        JSON.stringify(repairs)
    );

    repairCalculators[calcIndex] =
    createEmptyRepairCalculator();

    renderRepairCalculators();
    renderRepairs();
    updateStats();
}

function resetRepairCalculator(calcIndex) {

    repairCalculators[calcIndex] =
    createEmptyRepairCalculator();

    renderRepairCalculators();
}

function renderRepairs() {

    const container =
    document.getElementById("repairList");

    container.innerHTML = "";

    repairs.slice().reverse().forEach(repair => {

        let itemList = "";

        repair.items.forEach(item => {
            itemList += `
                • ${item.name}
                (${item.amount}x)
                - ${item.total}$<br>
            `;
        });

        container.innerHTML += `
            <div class="job-item">

                <b>${repair.customer}</b><br>

                Fahrzeug:
                ${repair.vehicle}<br>

                Kennzeichen:
                ${repair.plate || "-"}<br>

                Mitarbeiter:
                ${repair.employee}<br><br>

                ${itemList}

                <br>

                Rabatt:
                ${repair.discount}%<br>

                <b>Gesamt:
                ${repair.total.toFixed(0)}$</b><br>

                <small>${repair.time}</small>

            </div>
        `;
    });
}

function saveTuning() {

    const customer =
    document.getElementById("tuningCustomer").value;

    const vehicle =
    document.getElementById("tuningVehicle").value;

    const plate =
    document.getElementById("tuningPlate").value;

    const employee =
    document.getElementById("tuningEmployee").value;

    const price =
    Number(document.getElementById("tuningPrice").value);

    if(
        !customer ||
        !vehicle ||
        !employee ||
        !price
    ) {
        alert("Bitte alles ausf&uuml;llen");
        return;
    }

    tunings.push({
        customer,
        vehicle,
        plate,
        employee,
        price,
        time: new Date().toLocaleString()
    });

    localStorage.setItem(
        "blackline_tunings",
        JSON.stringify(tunings)
    );

    document.getElementById("tuningCustomer").value = "";
    document.getElementById("tuningVehicle").value = "";
    document.getElementById("tuningPlate").value = "";
    document.getElementById("tuningEmployee").value = "";
    document.getElementById("tuningPrice").value = "";

    renderTunings();
    updateStats();
}

function renderTunings() {

    const container =
    document.getElementById("tuningList");

    container.innerHTML = "";

    tunings.slice().reverse().forEach(tuning => {

        container.innerHTML += `
            <div class="job-item">

                <b>${tuning.customer}</b><br>

                Fahrzeug:
                ${tuning.vehicle}<br>

                Kennzeichen:
                ${tuning.plate || "-"}<br>

                Mitarbeiter:
                ${tuning.employee}<br>

                <b>${tuning.price}$</b><br>

                <small>${tuning.time}</small>

            </div>
        `;
    });
}

function updateStats() {

    const repairCount =
    repairs.length;

    const tuningCount =
    tunings.length;

    const repairMoney =
    repairs.reduce((sum, repair) => {
        return sum + repair.total;
    }, 0);

    const tuningMoney =
    tunings.reduce((sum, tuning) => {
        return sum + tuning.price;
    }, 0);

    const totalMoney =
    repairMoney + tuningMoney;

    document.getElementById("repairCount").innerText =
    repairCount;

    document.getElementById("tuningCount").innerText =
    tuningCount;

    document.getElementById("moneyCount").innerText =
    totalMoney.toFixed(0) + " $";

    document.getElementById("openJobs").innerText =
    repairCount + tuningCount;

    document.getElementById("statsRepairs").innerText =
    repairCount;

    document.getElementById("statsTunings").innerText =
    tuningCount;

    document.getElementById("statsRepairMoney").innerText =
    repairMoney.toFixed(0) + " $";

    document.getElementById("statsTuningMoney").innerText =
    tuningMoney.toFixed(0) + " $";

    document.getElementById("statsMoney").innerText =
    totalMoney.toFixed(0) + " $";
}

function saveBoard() {

    const text =
    document.getElementById("boardText").value;

    localStorage.setItem(
        "blackline_board",
        text
    );

    alert("Gespeichert");
}

function loadBoard() {

    const saved =
    localStorage.getItem("blackline_board");

    if(saved) {
        document.getElementById("boardText").value =
        saved;
    }
}

initRepairCalculators();
renderRepairs();
renderTunings();
updateStats();
loadBoard();
