let units = {
  si: {
    short: {
      nearestStormDistance: "km",
      precipIntensity: "mm/h",
      precipIntensityMax: "mm/h",
      precipAccumulation: "cm",
      temperature: "C",
      temperatureMin: "C",
      temperatureMax: "C",
      apparentTemperature: "C",
      dewPoint: "C",
      windSpeed: "m/s",
      pressure: "hpa",
      visibility: "km"
    },
    full: {
      nearestStormDistance: "Kilometers",
      precipIntensity: "Millimeters per hour",
      precipIntensityMax: "Millimeters per hour",
      precipAccumulation: "Centimeters",
      temperature: "Degrees Celsius",
      temperatureMin: "Degrees Celsius",
      temperatureMax: "Degrees Celsius",
      apparentTemperature: "Degrees Celsius",
      dewPoint: "Degrees Celsius",
      windSpeed: "Meters per second",
      pressure: "Hectopascals",
      visibility: "Kilometers"
    }
  },
  ca: {
    short: {
      nearestStormDistance: "km",
      precipIntensity: "mm/h",
      precipIntensityMax: "mm/h",
      precipAccumulation: "cm",
      temperature: "C",
      temperatureMin: "C",
      temperatureMax: "C",
      apparentTemperature: "C",
      dewPoint: "C",
      windSpeed: "km/h",
      pressure: "hpa",
      visibility: "km"
    },
    full: {
      nearestStormDistance: "Kilometers",
      precipIntensity: "Millimeters per hour",
      precipIntensityMax: "Millimeters per hour",
      precipAccumulation: "Centimeters",
      temperature: "Degrees Celsius",
      temperatureMin: "Degrees Celsius",
      temperatureMax: "Degrees Celsius",
      apparentTemperature: "Degrees Celsius",
      dewPoint: "Degrees Celsius",
      windSpeed: "kilometers per hour",
      pressure: "Hectopascals",
      visibility: "Kilometers"
    }
  },
  uk2: {
    short: {
      nearestStormDistance: "mi",
      precipIntensity: "mm/h",
      precipIntensityMax: "mm/h",
      precipAccumulation: "cm",
      temperature: "C",
      temperatureMin: "C",
      temperatureMax: "C",
      apparentTemperature: "C",
      dewPoint: "C",
      windSpeed: "mi/h",
      pressure: "hpa",
      visibility: "mi"
    },
    full: {
      nearestStormDistance: "Miles",
      precipIntensity: "Millimeters per hour",
      precipIntensityMax: "Millimeters per hour",
      precipAccumulation: "Centimeters",
      temperature: "Degrees Celsius",
      temperatureMin: "Degrees Celsius",
      temperatureMax: "Degrees Celsius",
      apparentTemperature: "Degrees Celsius",
      dewPoint: "Degrees Celsius",
      windSpeed: "Miles per hour",
      pressure: "Hectopascals",
      visibility: "Miles"
    }
  },
  us: {
    short: {
      nearestStormDistance: "mi",
      precipIntensity: "in/h",
      precipIntensityMax: "in/h",
      precipAccumulation: "in",
      temperature: "F",
      temperatureMin: "F",
      temperatureMax: "F",
      apparentTemperature: "F",
      dewPoint: "F",
      windSpeed: "mi/h",
      pressure: "mb",
      visibility: "mi"
    },
    full: {
      nearestStormDistance: "Miles",
      precipIntensity: "Inches per hour",
      precipIntensityMax: "Inches per hour",
      precipAccumulation: "Inches",
      temperature: "Fahrenheit",
      temperatureMin: "Fahrenheit",
      temperatureMax: "Fahrenheit",
      apparentTemperature: "Fahrenheit",
      dewPoint: "Fahrenheit",
      windSpeed: "Miles per hour",
      pressure: "Millibars",
      visibility: "Miles" 
    }
  }
};

function onInit() {
  updateData();

  chrome.alarms.onAlarm.addListener(onAlarm);
  chrome.alarms.create("updateWeather", { periodInMinutes: 30 });
}

function onAlarm(alarm) {
  if (alarm.name == "updateWeather") {
    updateData();
  }
}

function setIcon(iconName) {
  chrome.browserAction.setIcon({
    path: "assets/icons/weather/" + iconName + ".png"
  });
}

function updateData() {
  navigator.geolocation.getCurrentPosition(function(position) {
    getWeather(position.coords);
  });
}

function getWeather(position) {
  let url =
    "https://api.darksky.net/forecast/e5199f8e10eaebb2f382210af05b60a6/" +
    position.latitude +
    "," +
    position.longitude +
    "?exclude=minutely&units=auto";

  let request = new Request(url, {
    method: "GET"
  });

  fetch(request)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      handleResponse(json);
    });
}

function handleResponse(data) {
  setIcon(data.currently.icon);
  sendDataToPopup(data);
  if (data.alerts) {
    handleWeatherAlerts(data.alerts);
  }
}

function handleWeatherAlerts(alerts) {
  var opt = {
    type: "basic",
    title: "Alert notification",
    message: "This is a test!",
    iconUrl: "assets/icons/weather/clear-day.png"
  };
  chrome.notifications.create("", opt, function(id) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
    }
  });
}

function sendDataToPopup(data) {
  chrome.storage.local.set({ data: data, units: units[data.flags.units] }, function() {
  });
}

chrome.runtime.onInstalled.addListener(onInit);
chrome.runtime.onStartup.addListener(onInit);
