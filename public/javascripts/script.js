document.addEventListener("DOMContentLoaded", async function () {
    let ctxs_temp = document.querySelectorAll("div.charts canvas");
    // console.log(ctxs_temp);
    let ctxs = [];
    for (let ctx of ctxs_temp) {
        ctxs.push(ctx.getContext("2d"));
    }
    // console.log(ctxs);
    // const ctx1 = document.getElementById("chart1").getContext("2d");
    // const ctx2 = document.getElementById("chart2").getContext("2d");
    // const ctx3 = document.getElementById("chart3").getContext("2d");
    // const ctx4 = document.getElementById("chart4").getContext("2d");

    let labels = ["00:00", "01:00", "02:00", "03:00", "04:00"];
    let datas = [
        [[15, 20, 15, 30, 25], [10, 25, 5, 38, 75]],
        [[15, 20, 15, 30, 25], [10, 25, 5, 38, 75]],
        [[15, 20, 15, 30, 25], [10, 25, 5, 38, 75]],
        [[10, 20, 15, 30, 25]]
    ];
    const colors = [["red", "green"], ["blue", "orange"], ["green", "black"], ["purple"]];
    const chartLabels = [["Nhiệt độ", "Độ ẩm"], ["Nhiệt độ đất", "Độ ẩm đất"], ["PM10", "PM2.5"], ["Chất lượng không khí"]];
    const charts = [];

    await fetch("/readings?limit=10")
        .then(response => response.json())
        .then(data => {
            labels = data.labels;
            datas = data.datas;
        });

    function createChart(ctx, label, color, labels, data) {
        return new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: data.map((d, i) => ({
                    label: label[i],
                    data: d,
                    borderColor: color[i],
                    borderWidth: 1,
                    fill: false
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    for (let i = 0; i < ctxs.length; i++) {
        const ctx = ctxs[i];
        const label = chartLabels[i];
        const color = colors[i];
        const data = datas[i];

        charts.push(createChart(ctx, label, color, labels, data));
    }

    // Ẩn/Hiện biểu đồ khi bật/tắt switch
    function toggleChart(switchId, chartCanvas) {
        document.getElementById(switchId).addEventListener("change", function () {
            if (this.checked) {
                chartCanvas.style.height = '100%';
                chartCanvas.style.width = '100%';
            } else {
                chartCanvas.style.height = 0;
                chartCanvas.style.width = 0;
            }
        });
    }

    toggleChart("toggle1", document.getElementById("chart1").parentElement);
    toggleChart("toggle2", document.getElementById("chart2").parentElement);
    toggleChart("toggle3", document.getElementById("chart3").parentElement);
    toggleChart("toggle4", document.getElementById("chart4").parentElement);
});
