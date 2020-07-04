const buildPieChart = (data) => {
    var ctx = document.getElementById("myPieChart").getContext("2d");
    var myPieChart = new Chart(ctx, {
        type: "pie",
        data: {
            datasets: [{
                data: [data.active, data.recovered, data.deaths],
                backgroundColor: ["red", "green", "purple"],
            }, ],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: ["Active", "Recovered", "Deaths"],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        },
    });
};

const buildChartData = (data) => {
    let chartData = [];
    for (let date in data) {
        let newDataPoint = {
            x: date,
            y: data[date],
        };

        chartData.push(newDataPoint);
    }

    return chartData;
};

var chartLine = null;

const buildChart = (chartData, chartColor, casesType) => {
    console.log("All if good");
    var timeFormat = "MM/DD/YY";
    if (chartLine != null) {
        chartLine.destroy();
    }
    var ctx = document.getElementById("myChart").getContext("2d");
    chartLine = new Chart(ctx, {
        // The type of chart we want to create
        type: "line",

        // The data for our dataset
        data: {
            datasets: [{
                label: casesType,
                backgroundColor: chartColor,
                borderColor: chartColor,
                data: chartData,
            }, ],
        },

        // Configuration options go here
        options: {
            maintainAspectRatio: false,
            tooltips: {
                mode: "index",
                intersect: false,
            },
            scales: {
                xAxes: [{
                    type: "time",
                    time: {
                        format: timeFormat,
                        tooltipFormat: "ll",
                    },
                }, ],
                yAxes: [{
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function (value, index, values) {
                            return numeral(value).format("0,0");
                        },
                    },
                }, ],
            },
        },
    });
};