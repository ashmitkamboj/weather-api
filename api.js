// OpenWeather API calls. Create a new key after revoking the one previously
// placed in this file. A browser app exposes this key to its users.
const API_KEY = "44c7747435f5099f6b9bd2487f6b07d5";
const API_BASE = "https://api.openweathermap.org";

async function requestJson(url, label) {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `${label} failed (HTTP ${response.status})`);
  }
  return data;
}

// City name -> coordinates. OpenWeather's direct geocoding API returns an array.
async function searchPlaces(query, count = 5) {
  const params = new URLSearchParams({ q: query, limit: count, appid: API_KEY });
  const places = await requestJson(`${API_BASE}/geo/1.0/direct?${params}`, "Search");
  if (places.length === 0) {
    throw new Error(`No place found called "${query}". Try a different spelling.`);
  }

  return places.map(place => ({
    name: place.name,
    admin1: place.state,
    country: place.country,
    latitude: place.lat,
    longitude: place.lon
  }));
}

// Coordinates -> current weather.
async function getWeather(lat, lon, units = "metric") {
  const params = new URLSearchParams({ lat, lon, units, appid: API_KEY });
  return requestJson(`${API_BASE}/data/2.5/weather?${params}`, "Weather request");
}
