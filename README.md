# Weather Learner

A small browser app that searches for a place and displays its current weather using the [OpenWeather API](https://openweathermap.org/api).

## Setup

1. Create an OpenWeather account and get an API key.
2. In `api.js`, replace `ADD_YOUR_NEW_OPENWEATHER_API_KEY_HERE` with your key.
3. Open `index.html` in a browser. For location access, run the folder through a local web server, such as `python -m http.server`, and visit `http://localhost:8000`.

**Security:** A key in browser JavaScript is visible to anyone using the app. This setup is for learning; use a server to protect the key in a public app.

## Features

- Search for a city and choose among matching places.
- Show current temperature, conditions, feels-like temperature, humidity, and wind.
- Use the device's location or switch between metric and imperial units.
- Inspect the raw weather response.

The app uses OpenWeather's Geocoding API for place search and Current Weather API for conditions. It does not currently display a forecast.

## Files

- `index.html` — page structure
- `style.css` — page styles
- `api.js` — OpenWeather requests
- `app.js` — search, location, unit selection, and rendering
