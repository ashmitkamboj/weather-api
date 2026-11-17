const API_BASE = "https://api.openweathermap.org";

export default async function handler(request) {
  const params = new URL(request.url).searchParams;
  const type = params.get("type");
  const key = process.env.OPENWEATHER_API_KEY;

  if (!key) {
    return Response.json({ message: "Weather API key is not configured." }, { status: 500 });
  }

  let endpoint;

  if (type === "search") {
    const q = params.get("q")?.trim();
    if (!q) return Response.json({ message: "Enter a city name." }, { status: 400 });

    const upstream = new URL(`${API_BASE}/geo/1.0/direct`);
    upstream.search = new URLSearchParams({ q, limit: "5", appid: key });
    endpoint = upstream;
  } else if (type === "current") {
    const lat = params.get("lat");
    const lon = params.get("lon");
    const units = params.get("units") === "imperial" ? "imperial" : "metric";

    if (lat === null || lon === null) {
      return Response.json({ message: "Latitude and longitude are required." }, { status: 400 });
    }

    const upstream = new URL(`${API_BASE}/data/2.5/weather`);
    upstream.search = new URLSearchParams({ lat, lon, units, appid: key });
    endpoint = upstream;
  } else {
    return Response.json({ message: "Unknown request type." }, { status: 400 });
  }

  const response = await fetch(endpoint);
  const data = await response.json();
  return Response.json(data, { status: response.status });
}