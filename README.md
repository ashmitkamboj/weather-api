# Weather Learner

A small project for learning how web APIs work, using the free
[Open-Meteo](https://open-meteo.com/en/docs) API (no API key needed).
It works for any place in the world.

## Run it

Double-click `index.html`. No install or build step.

## Structure

| File | Role |
|---|---|
| `index.html` | Page layout |
| `style.css` | Styling |
| `api.js` | API layer: builds URLs, calls `fetch`, checks errors, returns data |
| `app.js` | UI layer: handles input, calls `api.js`, renders results |

## Features

- Search any city or town worldwide (names in many languages and scripts work).
- Ambiguous names (Springfield, Delhi, Cambridge) show a list to choose from.
- "Use my location" uses the browser's geolocation and skips the search call.
- °C / km/h or °F / mph.
- Shows the local time at the place, not just at your computer.

## What happens when you search

1. `app.js` reads the text and calls `searchPlaces(query)`.
2. `api.js` sends a GET request to the Geocoding API and gets a list of matches with latitude/longitude.
3. If there are several matches, the user picks one.
4. `app.js` passes the coordinates to `getWeather(lat, lon, units)`.
5. `api.js` calls the Forecast API and returns JSON.
6. `app.js` renders the JSON as HTML.

## Things to try (in rough order of difficulty)

1. Open DevTools (F12) > Network tab, search a city, and inspect the requests:
   URL, status code, response body.
2. Paste an API URL directly into the address bar and read the raw JSON.
3. Search "Springfield" and compare the matches. Then search the same city in
   another language or script (e.g. 東京) and see how the API responds.
4. Add `hourly: "temperature_2m"` and show the next 12 hours.
5. Add a loading state that disables the button while a request is running.
6. Break things on purpose: misspell a parameter, search gibberish, go offline.
   Notice which errors come from the network and which from the server.
7. Save the last searched place in `localStorage` and load it on startup.
8. Add a precipitation chance row (`precipitation_probability_max` in `daily`).
9. Next step: try an API that requires a key (e.g. OpenWeatherMap) to learn
   authentication, and why secrets don't belong in front-end code.

## Key ideas

- **Endpoint + query parameters**: the URL says what you want.
- **HTTP status codes**: 200 means OK, 4xx means your request was wrong, 5xx means the server failed.
- **JSON**: the text format the data comes back in.
- **Async**: network calls take time, so we use `async/await`.
- **Chaining**: one call's output feeds the next.
- **Separation of concerns**: network code (`api.js`) is kept apart from display code (`app.js`).
- **Ambiguous input**: don't silently take the first search result; let the user choose.
- **Time zones**: `new Date("2026-11-16")` is parsed as UTC, so it can display as the previous day
  west of UTC. `app.js` builds dates from their parts to avoid this.
- **Untrusted data**: text from a server is escaped before going into `innerHTML`.

## Notes

- "Use my location" needs permission, and some browsers only allow it on `https://` or
  `localhost`, not when opening the file directly. If it fails, search by name, or serve
  the folder with `python3 -m http.server` and open `http://localhost:8000`.
