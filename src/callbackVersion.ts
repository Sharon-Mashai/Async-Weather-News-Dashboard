import https from "https";
import readline from "readline";
import { displayError } from "./errorHandler.js";
import type {GeocodingData,Location,WeatherData,NewsData,} from "./types.js";

// Create terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Find the location coordinates
function getLocation(
  locationName: string,
  callback: (error: Error | null, location?: Location) => void,
) {
  const locationUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationName)}&count=1&language=en&format=json`;

  https
    .get(locationUrl, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        try {
          const locationData: GeocodingData = JSON.parse(data);

          if (!locationData.results || locationData.results.length === 0) {
            callback(new Error("Location not found."));
            return;
          }

          callback(null, locationData.results[0]);
        } catch {
          callback(new Error("Failed to process location data."));
        }
      });
    })
    .on("error", () => {
      callback(new Error("Failed to fetch location data."));
    });
}

// Fetch weather data
function getWeather(
  latitude: number,
  longitude: number,
  callback: (error: Error | null, data?: string) => void,
) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&daily=temperature_2m_min,temperature_2m_max&timezone=auto&forecast_days=1`;

  https
    .get(weatherUrl, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        try {
          const weatherData: WeatherData = JSON.parse(data);

          const currentTemperature = weatherData.current.temperature_2m;

          const minimumTemperature = weatherData.daily.temperature_2m_min[0];

          const maximumTemperature = weatherData.daily.temperature_2m_max[0];

          const weather =
            `Current Temperature: ${currentTemperature}°C\n` +
            `Minimum Temperature: ${minimumTemperature}°C\n` +
            `Maximum Temperature: ${maximumTemperature}°C`;

          callback(null, weather);
        } catch {
          callback(new Error("Failed to process weather data."));
        }
      });
    })
    .on("error", () => {
      callback(new Error("Failed to fetch weather data."));
    });
}

// Fetch news/posts
function getNews(callback: (error: Error | null, data?: string[]) => void) {
  const newsUrl = "https://dummyjson.com/posts?limit=5";

  https
    .get(newsUrl, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        try {
          const newsData: NewsData = JSON.parse(data);

          const headlines = newsData.posts.map((post) => post.title);

          callback(null, headlines);
        } catch {
          callback(new Error("Failed to process news data."));
        }
      });
    })
    .on("error", () => {
      callback(new Error("Failed to fetch news data."));
    });
}

// Prompt the user for a location
rl.question("Enter your location: ", (locationName) => {
  if (!locationName.trim()) {
    displayError(new Error("Please enter a location."));

    rl.close();
    return;
  }

  // Get location coordinates
  getLocation(locationName, (locationError, location) => {
    if (locationError) {
      displayError(locationError);
      rl.close();
      return;
    }

    if (!location) {
      displayError(new Error("Location not found."));
      rl.close();
      return;
    }

    // Get weather using the coordinates
    getWeather(
      location.latitude,
      location.longitude,
      (weatherError, weather) => {
        if (weatherError) {
          displayError(weatherError);
          rl.close();
          return;
        }

        console.log("\nCALLBACK VERSION");

        console.log(`\nWEATHER - ${location.name.toUpperCase()}`);
        console.log(weather);

        // Get news after weather
        getNews((newsError, headlines) => {
          if (newsError) {
            displayError(newsError);
            rl.close();
            return;
          }

          console.log("\n");
          console.log("NEWS HEADLINES");

          headlines?.forEach((headline, index) => {
            console.log(`${index + 1}. ${headline}`);
          });

          console.log("\n");

          rl.close();
        });
      },
    );
  });
});
