const $ = id => document.getElementById(id);
let currentPlace = null;

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function placeLabel(place) {
  return [place.name, place.admin1, place.country].filter(Boolean).join(", ");
}

function showStatus(message, isError = false) {
  const box = $("status");
  box.hidden = false;
  box.className = "card" + (isError ? " error" : "");
  box.textContent = message;
}

function hideResults() {
  $("choices").hidden = true;
  $("current").hidden = true;
  $("forecast").hidden = true;
}

function render(place, weather) {
  $("status").hidden = true;
  $("choices").hidden = true;

  const isImperial = $("units").value === "imperial";
  const temperatureUnit = isImperial ? "°F" : "°C";
  const windUnit = isImperial ? "mph" : "m/s";
  const condition = weather.weather?.[0]?.description ?? "Weather unavailable";
  // OpenWeather's timezone is an offset in seconds, so format the shifted time as UTC.
  const localTime = new Intl.DateTimeFormat(undefined, {
    weekday: "short", hour: "2-digit", minute: "2-digit", timeZone: "UTC"
  }).format(new Date(Date.now() + weather.timezone * 1000));

  $("current").hidden = false;
  $("current").innerHTML = `
    <div>${escapeHtml(placeLabel(place))}</div>
    <div class="muted">Local time: ${escapeHtml(localTime)}</div>
    <p class="big">${Math.round(weather.main.temp)}${temperatureUnit}</p>
    <div>${escapeHtml(condition)}</div>
    <div class="row"><span>Feels like</span><span>${Math.round(weather.main.feels_like)}${temperatureUnit}</span></div>
    <div class="row"><span>Humidity</span><span>${weather.main.humidity}%</span></div>
    <div class="row"><span>Wind</span><span>${weather.wind?.speed ?? "—"} ${windUnit}</span></div>
  `;

  // The current-weather endpoint has no forecast data.
  $("forecast").hidden = true;
  $("raw").textContent = JSON.stringify(weather, null, 2);
}

async function loadWeather(place) {
  currentPlace = place;
  showStatus("Loading weather...");
  try {
    const weather = await getWeather(place.latitude, place.longitude, $("units").value);
    render(place, weather);
  } catch (err) {
    hideResults();
    showStatus(err.message, true);
  }
}

function showChoices(places) {
  $("status").hidden = true;
  $("current").hidden = true;
  $("forecast").hidden = true;

  const box = $("choices");
  box.hidden = false;
  box.innerHTML = "<strong>Which one do you mean?</strong>";
  places.forEach(place => {
    const button = document.createElement("button");
    button.className = "choice";
    button.textContent = placeLabel(place);
    button.addEventListener("click", () => loadWeather(place));
    box.appendChild(button);
  });
}

$("form").addEventListener("submit", async event => {
  event.preventDefault();
  const query = $("city").value.trim();
  hideResults();
  showStatus("Searching...");
  try {
    const places = await searchPlaces(query);
    if (places.length === 1) await loadWeather(places[0]);
    else showChoices(places);
  } catch (err) {
    showStatus(err.message, true);
  }
});

$("locate").addEventListener("click", () => {
  if (!navigator.geolocation) {
    showStatus("Your browser doesn't support location. Search by city name instead.", true);
    return;
  }
  hideResults();
  showStatus("Getting your location...");
  navigator.geolocation.getCurrentPosition(
    pos => loadWeather({
      name: "Your location",
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    }),
    () => showStatus("Couldn't get your location (permission denied or unavailable). Search by city name instead.", true)
  );
});

$("units").addEventListener("change", () => {
  if (currentPlace) loadWeather(currentPlace);
});
