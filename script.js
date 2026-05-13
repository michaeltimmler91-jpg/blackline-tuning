const pages = document.querySelectorAll(".page");

function showPage(pageId) {

    pages.forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageId).classList.add("active");
}

let repairs =
JSON.parse(localStorage.getItem("blackline_repairs")) || [];

let tunings =
JSON.parse(localStorage.getItem("blackline_tunings")) || [];

function saveRepair() {

    const customer =
    document.getElementById("repairCustomer").value;

    const vehicle =
    document.getElementById("repairVehicle").value;

    const price =
    Number(document.getElementById("repairPrice").value);

    if(!customer || !vehicle || !price) {

        alert("Bitte alles ausfüllen");
        return;
    }

    repairs.push({
        customer,
        vehicle,
        price,
        time: new Date().toLocaleString()
    });

    localStorage.setItem(
        "blackline_repairs",
        JSON.stringify(repairs)
    );

    document.getElementById("repairCustomer").value = "";
    document.getElementById("repairVehicle").value = "";
    document.getElementById("repairPrice").value = "";

    renderRepairs();
    updateStats();
}

function saveTuning() {

    const customer =
    document.getElementById("tuningCustomer").value;

    const vehicle =
    document.getElementById("tuningVehicle").value;

    const price =
    Number(document.getElementById("tuningPrice").value);

    if(!customer || !vehicle || !price) {

        alert("Bitte alles ausfüllen");
        return;
    }

    tunings.push({
        customer,
        vehicle,
        price,
        time: new Date().toLocaleString()
    });

    localStorage.setItem(
        "blackline_tunings",
        JSON.stringify(tunings)
    );

    document.getElementById("tuningCustomer").value = "";
    document.getElementById("tuningVehicle").value = "";
    document.getElementById("tuningPrice").value = "";

    renderTunings();
    updateStats();
}

function renderRepairs() {

    const container =
    document.getElementById("repairList");

    container.innerHTML = "";

    repairs.slice().reverse().forEach(repair => {

        container.innerHTML += `
            <div class="job-item">
                <b>${repair.customer}</b><br>
                ${repair.vehicle}<br>
                ${repair.price}$<br>
                <small>${repair.time}</small>
            </div>
        `;
    });
}

function renderTunings() {

    const container =
    document.getElementById("tuningList");

    container.innerHTML = "";

    tunings.slice().reverse().forEach(tuning => {

        container.innerHTML += `
            <div class="job-item">
                <b>${tuning.customer}</b><br>
                ${tuning.vehicle}<br>
                ${tuning.price}$<br>
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
        return sum + repair.price;
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
    totalMoney + " $";

    document.getElementById("openJobs").innerText =
    repairCount + tuningCount;

    document.getElementById("statsRepairs").innerText =
    repairCount;

    document.getElementById("statsTunings").innerText =
    tuningCount;

    document.getElementById("statsMoney").innerText =
    totalMoney + " $";
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

renderRepairs();
renderTunings();
updateStats();
loadBoard();
