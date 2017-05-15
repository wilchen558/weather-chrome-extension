let units;

onInit();

function onInit() {
  chrome.storage.local.get("units", function(data) {
    units = data.units;
  });

  chrome.storage.local.get("data", function(data) {
    displayData(data);
  });
}


function displayData(weatherData) {
    document.getElementById("currentWeather").src = "assets/icons/weather/" + weatherData.data.currently.icon + ".png";
    document.getElementById("currentSummary").innerText = weatherData.data.currently.summary;
    document.getElementById("currentTemp").innerHTML = Math.round(weatherData.data.currently.temperature) + "&deg; " + units.short.temperature;
    document.getElementById("currentPrecipitation").innerText = weatherData.data.currently.precipProbability * 100 + "%";
    document.getElementById("currentHumidity").innerText = weatherData.data.currently.humidity * 100 + "%";
    document.getElementById("currentWind").innerText = Math.round(weatherData.data.currently.windSpeed) + " " + units.short.windSpeed;
}
