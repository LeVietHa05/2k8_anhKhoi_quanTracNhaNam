document.addEventListener("DOMContentLoaded", function () {
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

    const labels = ["00:00", "01:00", "02:00", "03:00", "04:00"];
    const datas = [
        [[15, 20, 15, 30, 25], [10, 25, 5, 38, 75]],
        [[10, 20, 15, 30, 25]],
        [[10, 20, 15, 30, 25]],
        [[10, 20, 15, 30, 25]]
    ];
    const colors = [["red", "green"], ["blue"], ["green"], ["purple"]];
    const chartLabels = [["Nhiệt độ", "Độ ẩm"], ["Độ ẩm"], ["Áp suất"], ["Chất lượng không khí"]];
    const charts = [];

    function createChart(ctx, label, color, labels, data) {
        return new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: data.map((d, i) => ({
                    label: label,
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

    // const chart1 = createChart(ctx1, "Nhiệt độ", "red", labels);
    // const chart2 = createChart(ctx2, "Độ ẩm", "blue", labels);
    // const chart3 = createChart(ctx3, "Áp suất", "green", labels);
    // const chart4 = createChart(ctx4, "Chất lượng không khí", "purple", labels);

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
