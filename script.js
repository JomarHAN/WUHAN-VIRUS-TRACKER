window.onload = () => {
  getCountryData();
  getHistoricalData();
  getWorldCoronaData();
  selectCardCases();
};

var map;
var infoWindow;
let coronaGlobalData;
let mapCircles = [];
var casesTypeColor = {
  cases: "#6c757d",
  active: "red",
  recovered: "green",
  deaths: "purple",
};
var chartData;
var casesTypeArr = [];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 39.8283,
      lng: -98.5795,
    },
    zoom: 3,
    styles: mapStyle,
  });
  infoWindow = new google.maps.InfoWindow();
}

const changeDataSelection = (casesType) => {
  clearTheMap();

  showDataOnMap(coronaGlobalData, casesType);
  var chartColor = casesTypeColor[casesType];

  getHistoricalData(casesType, chartColor);
};

const clearTheMap = () => {
  for (let circle of mapCircles) {
    circle.setMap(null);
  }
};

const getWorldCoronaData = () => {
  fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      buildPieChart(data);
      showTypeCasesHTML(data);
    });
};

const getCountryData = () => {
  fetch("https://corona.lmao.ninja/v2/countries")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // console.log(data)

      coronaGlobalData = data;
      showDataInTable(data);
      showDataOnMap(data);
    });
};

const getHistoricalData = (casesType = "cases", chartColor = "#6c757d") => {
  fetch("https://corona.lmao.ninja/v2/historical/all?lastdays=120")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      chartData = buildChartData(data[casesType]);
      buildChart(chartData, chartColor, casesType);
    });
};

const selectCardCases = () => {
  let cards = document.querySelectorAll(".stats-container .col .card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove("clickActive");
      }
      card.classList.add("clickActive");
    });
  });
};

const openInfoWindow = () => {
  infoWindow.open(map);
};

const showDataOnMap = (data, casesType = "cases") => {
  data.map((country) => {
    let countryCenter = {
      lat: country.countryInfo.lat,
      lng: country.countryInfo.long,
    };

    var countryCircle = new google.maps.Circle({
      strokeColor: casesTypeColor[casesType],
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: casesTypeColor[casesType],
      fillOpacity: 0.35,
      map: map,
      center: countryCenter,
      radius: country[casesType],
    });

    mapCircles.push(countryCircle);

    var html = `
            <div class="info-container">
                <div class="info-flag" style="background-image: url(${country.countryInfo.flag});">
                </div>
                <div class="info-name">
                    ${country.country}
                </div>
                <div class="info-confirmed">
                    Total: ${country.cases}
                </div>
                <div class="info-recovered">
                    Recovered: ${country.recovered}
                </div>
                <div class="info-deaths">   
                    Deaths: ${country.deaths}
                </div>
            </div>
        `;

    var infoWindow = new google.maps.InfoWindow({
      content: html,
      position: countryCircle.center,
    });
    google.maps.event.addListener(countryCircle, "mouseover", function () {
      infoWindow.open(map);
    });

    google.maps.event.addListener(countryCircle, "mouseout", function () {
      infoWindow.close();
    });
  });
};

const showDataInTable = (data) => {
  var html = "";
  data.forEach((country, index) => {
    html += `
        <tr>
            <td>${index + 1}</td>
            <td>${country.country}</td>
            <td>${numeral(country.cases).format("0,0")}</td>

        </tr>
        `;
  });
  document.getElementById("table-data").innerHTML = html;
};

const showTypeCasesHTML = (data) => {
  let html = `
    <div class="col">
        <div class="card" onclick="changeDataSelection('cases')">
        <div class="card-body">
            <h5 class="card-title">Total Cases</h5>
            <h6 class="card-subtitle mb-2 text-muted cases-number">${numeral(
              data.cases
            ).format("0,0")}</h6>
        </div>
        </div>
    </div>
    <div class="col">
        <div class="card active-cases-card" onclick="changeDataSelection('active')">
        <div class="card-body">
            <h5 class="card-title">Active Cases</h5>
            <h6 class="card-subtitle mb-2 text-muted active-number">${numeral(
              data.active
            ).format("0,0")}</h6>
        </div>
        </div>
    </div>
    <div class="col">
        <div class="card" onclick="changeDataSelection('recovered')">
        <div class="card-body">
            <h5 class="card-title">Recovered</h5>
            <h6 class="card-subtitle mb-2 text-muted recovered-number">${numeral(
              data.recovered
            ).format("0,0")}</h6>
        </div>
        </div>
    </div>
    <div class="col">
        <div class="card" onclick="changeDataSelection('deaths')">
        <div class="card-body">
            <h5 class="card-title">Deaths</h5>
            <h6 class="card-subtitle mb-2 text-muted deaths-number">${numeral(
              data.deaths
            ).format("0,0")}</h6>
        </div>
        </div>
    </div>
    `;
  document.querySelector(".stats-container").innerHTML = html;
};
