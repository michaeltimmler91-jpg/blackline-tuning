const pages =
document.querySelectorAll(".page");

function showPage(pageId) {

    pages.forEach(page => {
        page.classList.remove("active");
    });

    document
    .getElementById(pageId)
    .classList.add("active");
}

let repairs =
JSON.parse(localStorage.getItem("blackline_repairs")) || [];

let tunings =
JSON.parse(localStorage.getItem("blackline_tunings")) || [];

let currentRepairItems = [];

function loadRepairItems() {

    const select =
    document.getElementById("repairItemSelect");

    select.innerHTML = "";

    BLACKLINE_CONFIG.repairItems.forEach((item, index) => {

        const option =
        document.createElement("option");

        option.value = index;

        option.innerHTML =
        `${item.name} (${item.price}$)`;

        select.appendChild(option);
    });
}

function addRepairItem() {

    const select =
    document.getElementById("repairItemSelect");

    const amount =
    Number(document.getElementById("repairItemAmount").value);

    const item =
    BLACKLINE_CONFIG.repairItems[select.value];

    currentRepairItems.push({
        name: item.name,
        price: item.price,
        amount: amount,
        total: item.price * amount
    });

    renderCurrentRepairItems();
    updateRepairTotal();
}

function renderCurrentRepairItems() {

    const container =
    document.getElementById("selectedRepairItems");

    container.innerHTML = "";

    currentRepairItems.forEach((item, index) => {

        container.innerHTML += `
            <div class="job-item">
                <b>${item.name}</b><br>
                Menge: ${item.amount}<br>
                Einzelpreis: ${item.price}$<br>
                Gesamt: ${item.total}$<br>

                <button onclick="removeRepairItem(${index})">
                    Entfernen
                </button>
            </div>
        `;
    });
}

function removeRepairItem(index) {

    currentRepairItems.splice(index, 1);

    renderCurrentRepairItems();
    updateRepairTotal();
}

function updateRepairTotal() {

    const discount =
    Number(document.getElementById("repairDiscount").value);

    let total = 0;

    currentRepairItems.forEach(item => {
        total += item.total;
    });

    const finalTotal =
    total - (total * (discount / 100));

    document.getElementById("repairTotal").innerText =
    finalTotal.toFixed(0) + " $";
}

function saveRepair() {

    const customer =
    document.getElementById("repairCustomer").value;

    const vehicle =
    document.getElementById("repairVehicle").value;

    const plate =
    document.getElementById("repairPlate").value;

    const employee =
    document.getElementById("repairEmployee").value;

    const discount =
    Number(document.getElementById("repairDiscount").value);

    if(
        !customer ||
        !vehicle ||
        !employee ||
        currentRepairItems.length === 0
    ) {
        alert("Bitte alles ausfüllen");
        return;
    }

    let total = 0;

    currentRepairItems.forEach(item => {
        total += item.total;
    });

    total =
    total - (total * (discount / 100));

    repairs.push({
        customer,
        vehicle,
        plate,
        employee,
        discount,
        items: currentRepairItems,
        total,
        time: new Date().toLocaleString()
    });

    localStorage.setItem(
        "blackline_repairs",
        JSON.stringify(repairs)
    );

    document.getElementById("repairCustomer").value = "";
    document.getElementById("repairVehicle").value = "";
    document.getElementById("repairPlate").value = "";
    document.getElementById("repairEmployee").value = "";
    document.getElementById("repairDiscount").value = 0;

    currentRepairItems = [];

    renderCurrentRepairItems();
    renderRepairs();
    updateRepairTotal();
    updateStats();
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
        alert("Bitte alles ausfüllen");
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

loadRepairItems();
renderRepairs();
renderTunings();
updateStats();
loadBoard();
