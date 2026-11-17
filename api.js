const FUNCTION_URL = "/.netlify/functions/weather";

async function requestJson(url, label) {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `${label} failed (HTTP ${response.status})`);
  }
  return data;
}

async function searchPlaces(query) {
  const params = new URLSearchParams({ type: "search", q: query });
  const places = await requestJson(`${FUNCTION_URL}?${params}`, "Search");

  if (!places.length) throw new Error(`No place found called "${query}".`);

  return places.map(place => ({
    name: place.name,
    admin1: place.state,
    country: place.country,
    latitude: place.lat,
    longitude: place.lon
  }));
}

async function getWeather(lat, lon, units = "metric") {
  const params = new URLSearchParams({ type: "current", lat, lon, units });
  return requestJson(`${FUNCTION_URL}?${params}`, "Weather request");
}