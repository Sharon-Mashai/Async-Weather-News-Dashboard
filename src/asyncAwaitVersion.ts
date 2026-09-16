import https from "https";
import readline from "readline";
import { displayError } from "./errorHandler.js";
import type { GeocodingData,Location,WeatherData,NewsData,} from "./types.js";

// Create terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Find the location coordinates
function getLocation(
  locationName: string,
): Promise<Location> {
  const locationUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationName)}&count=1&language=en&format=json`;

  return new Promise((resolve, reject) => {
    https
      .get(locationUrl, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          try {
            const locationData: GeocodingData =
              JSON.parse(data);

            if (
              !locationData.results ||
              locationData.results.length === 0
            ) {
              reject(
                new Error("Location not found."),
              );
              return;
            }

            const location = locationData.results[0];

            if (!location) {
              reject(new Error("Location not found."));
              return;
            }

            resolve(location);
          } catch {
            reject(
              new Error(
                "Failed to process location data.",
              ),
            );
          }
        });
      })
      .on("error", () => {
        reject(
          new Error(
            "Failed to fetch location data.",
          ),
        );
      });
  });
}

// Fetch weather data
function getWeather(
  latitude: number,
  longitude: number,
): Promise<string> {
  const weatherUrl =`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&daily=temperature_2m_min,temperature_2m_max&timezone=auto&forecast_days=1`;

  return new Promise((resolve, reject) => {
    https
      .get(weatherUrl, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          try {
            const weatherData: WeatherData =
              JSON.parse(data);

            const currentTemperature =
              weatherData.current.temperature_2m;

            const minimumTemperature =
              weatherData.daily.temperature_2m_min[0];

            const maximumTemperature =
              weatherData.daily.temperature_2m_max[0];

            const weather =
              `Current Temperature: ${currentTemperature}°C\n` +
              `Minimum Temperature: ${minimumTemperature}°C\n` +
              `Maximum Temperature: ${maximumTemperature}°C`;

            resolve(weather);
          } catch {
            reject(
              new Error(
                "Failed to process weather data.",
              ),
            );
          }
        });
      })
      .on("error", () => {
        reject(
          new Error(
            "Failed to fetch weather data.",
          ),
        );
      });
  });
}

// Fetch news/posts
function getNews(): Promise<string[]> {
  const newsUrl = "https://dummyjson.com/posts?limit=5";

  return new Promise((resolve, reject) => {
    https
      .get(newsUrl, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          try {
            const newsData: NewsData =
              JSON.parse(data);

            const headlines =
              newsData.posts.map(
                (post) => post.title,
              );

            resolve(headlines);
          } catch {
            reject(
              new Error(
                "Failed to process news data.",
              ),
            );
          }
        });
      })
      .on("error", () => {
        reject(
          new Error(
            "Failed to fetch news data.",
          ),
        );
      });
  });
}

// Display dashboard using async/await
async function displayDashboard(
  locationName: string,
) {
  try {
    // Find the location
    const location =
      await getLocation(locationName);

    console.log(
      "\nASYNC/AWAIT VERSION");
  

    // Fetch weather
    const weather = await getWeather(
      location.latitude,
      location.longitude,
    );

    console.log(
      `\nWEATHER - ${location.name.toUpperCase()}`,
    );
    console.log(weather);

    // Fetch news
    const headlines = await getNews();

    console.log("\n");
    console.log("NEWS HEADLINES");

    headlines.forEach(
      (headline, index) => { console.log( `${index + 1}. ${headline}`, ); });

    console.log("\n",);
  } catch (error) {
    displayError(error);
  }
}

// Ask the user for a location
rl.question(
  "Enter your location: ",
  async (locationName) => {
    if (!locationName.trim()) {
      displayError(
        new Error("Please enter a location."),
      );

      rl.close();
      return;
    }

    await displayDashboard(locationName);

    rl.close();
  },
);