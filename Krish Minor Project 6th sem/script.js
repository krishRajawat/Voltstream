let mode = "daily";
let myChart = null;

let roomStatus = {
    bedroom: true,
    kitchen: true,
    drawing: true
};

function setMode(selected) {
    mode = selected;
    document.getElementById('btn-daily').classList.toggle('active', mode === 'daily');
    document.getElementById('btn-weekly').classList.toggle('active', mode === 'weekly');
    updateUI();
}

function toggleRoom(room) {
    roomStatus[room] = !roomStatus[room];
    const card = document.getElementById(`card-${room}`);
    card.style.opacity = roomStatus[room] ? "1" : "0.5";
    updateUI();
}

function updateUI() {
    const rooms = ['bedroom', 'kitchen', 'drawing'];
    let labels = ['Bedroom', 'Kitchen', 'Living Room'];
    let values = [];
    let totalPower = 0;
    let suggestions = [];

    let multiplier = (mode === "weekly") ? 7 : 1;

    rooms.forEach(room => {
        let val = parseInt(document.getElementById(room).value);
        let power = roomStatus[room] ? val * multiplier : 0;
        
        values.push(power);
        totalPower += power;

        // Update the small text showing the wattage
        document.querySelector(`#card-${room} .power-val`).innerText = val + "W";

        if (power > 2000 * multiplier) {
            suggestions.push(`High usage in ${room}! Consider turning off standby devices.`);
        }
    });

    // Update Stats
    document.getElementById("total").innerText = totalPower.toLocaleString();
    document.getElementById("bill").innerText = "₹" + (totalPower * 0.15).toFixed(2); // Reduced rate for realism

    // Update Suggestions
    const list = document.getElementById("suggestions");
    list.innerHTML = suggestions.length ? "" : "<li>Great! Your energy usage is optimized.</li>";
    suggestions.forEach(s => {
        let li = document.createElement("li");
        li.innerText = s;
        list.appendChild(li);
    });

    renderChart(labels, values);
}

function renderChart(labels, values) {
    const ctx = document.getElementById('energyChart').getContext('2d');
    
    if (myChart) {
        myChart.destroy(); // Fixes the bug where charts overlay each other
    }

    myChart = new Chart(ctx, {
        type: 'line', // Line chart looks more "app-like"
        data: {
            labels: labels,
            datasets: [{
                label: 'Usage (Watts)',
                data: values,
                borderColor: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { display: false },
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
            }
        }
    });
}

// Initial Run
updateUI();