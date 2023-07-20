"use strict";
const searchButton = document.querySelector(".bi-search");
const apiKey = `fa63151db04f426dbd9113744231707`;
const countryName = document.querySelector(".country");
const weatherIcon = document.querySelector(".weather-icon");
const weather = document.querySelector(".weather");
const celsius = document.querySelector(".celsius");
const fahrenheit = document.querySelector(".fahrenheit");
const feeLikeC = document.querySelector(".feelsLikeC");
const feeLikeF = document.querySelector(".feelsLikeF");
const humidityEl = document.querySelector(".humidity");
const windSpeedEl = document.querySelector(".wind-speed");
const otherInfoContainer = document.querySelector(".other-info");
const forecastInfo = document.querySelector(".forecast-info");

function gettingWeather(weatherObject) {
  return weatherObject;
}

function weatherInfo(country, weatherName, img, celsiusTemp, fahrenheitTemp) {
  countryName.textContent = country;
  weather.textContent = weatherName;
  weatherIcon.src = img;
  celsius.textContent = celsiusTemp + " " + `celsius`;
  fahrenheit.textContent = fahrenheitTemp + " " + `fahrenheit`;
}

function otherInfo(feeLikeCTemp, feeLikeFTemp, humidity, windSpeed) {
  feeLikeC.textContent = feeLikeCTemp + " " + `celsius`;
  feeLikeF.textContent = feeLikeFTemp + " " + `fahrenheit`;
  humidityEl.textContent = humidity;
  windSpeedEl.textContent = windSpeed + " " + `km/h`;
}

function displayForeCast(
  parentElement,
  card,
  className,
  day,
  img,
  minInC,
  maxInC,
  minInF,
  maxInF
) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const element = document.createElement(card);
  const date = document.createElement("h3");
  const time = new Date(day);
  const week = weekday[time.getDay()];
  date.textContent = week;
  date.classList.add("forecast-day");
  const icon = document.createElement("img");
  icon.src = img;
  icon.classList.add("forecast-img");
  const celsius = document.createElement("p");
  celsius.textContent = `${minInC}/${maxInC}` + " " + " " + "celsius";
  celsius.classList.add("forecast-celsius");
  const fahrenheit = document.createElement("p");
  fahrenheit.textContent = `${minInF}/${maxInF}` + " " + " " + "fahrenheit";
  fahrenheit.classList.add("forecast-fahrenheit");
  element.classList.add(className);
  element.append(date, icon, celsius, fahrenheit);
  parentElement.append(element);
}

function lowerCase(string) {
  string = string.value.charAt(0).toLowerCase() + string.value.slice(1);
}

const renderingWeather = async function (country) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${country}`;

  try {
    const response = await fetch(url);
    if (response.status === 200) {
      const data = await response.json();
      const weather = data.current;
      const location = data.location;
      gettingWeather(weather);
      weatherInfo(
        location.name,
        weather.condition.text,
        weather.condition.icon,
        weather.temp_c,
        weather.temp_f
      );
      otherInfo(
        weather.feelslike_c,
        weather.feelslike_f,
        weather.humidity,
        weather.wind_kph
      );
    } else {
      throw new Error("Please enter valid location name");
    }
  } catch (error) {
    console.log(error);
  }
};

const gettingForecast = async function (country) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${country}&days=3`;
  try {
    const response = await fetch(url);
    if (response.status === 200) {
      const data = await response.json();
      const forecast = data.forecast.forecastday;
      forecast.forEach((el) => {
        console.log(el.day.condition.icon);
        displayForeCast(
          forecastInfo,
          "div",
          "forecast-info-card",
          el.date,
          el.day.condition.icon,
          el.day.mintemp_c,
          el.day.maxtemp_c,
          el.day.mintemp_f,
          el.day.maxtemp_f
        );
      });
    } else {
      throw new Error("Please enter valid location name");
    }
  } catch (error) {
    console.log(error);
  }
};

gettingForecast("india"); //default
renderingWeather("india"); //default

searchButton.addEventListener("click", function () {
  forecastInfo.replaceChildren();
  renderingWeather(search.value);
  gettingForecast(search.value);
  lowerCase(search);
});
