import https from "https";
import readline from "readline";
import { displayError } from "./errorHandler.js";
import type { GeocodingData, Location, WeatherData, NewsData,} from "./types.js";

// Create terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Find the location coordinates
function getLocation(
  locationName: string,
): Promise<Location> {
  const locationUrl =`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationName)}&count=1&language=en&format=json`;

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

// Fetch weather using a Promise
function getWeather(
  latitude: number,
  longitude: number,
): Promise<string> {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&daily=temperature_2m_min,temperature_2m_max&timezone=auto&forecast_days=1`;

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

// Fetch news using a Promise
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

// 1. Promise chaining
function runPromiseChaining(
  location: Location,
): Promise<void> {
   console.log("\n=======================================");
  console.log("PROMISE CHAINING");
  

  return getWeather(
    location.latitude,
    location.longitude,
  )
    .then((weather) => {
      console.log(
        `\nWEATHER - ${location.name.toUpperCase()}`,
      );
      console.log(weather);

      return getNews();
    })
    .then((headlines) => {
      console.log("\nNEWS HEADLINES");

      headlines.forEach((headline, index) => {
        console.log(
          `${index + 1}. ${headline}`,
        );
      });
    });
}

// 2. Promise.all()
function runPromiseAll(
  location: Location,
): Promise<void> {
  console.log("\n======================================");
  console.log("PROMISE.ALL");
 

  return Promise.all([
    getWeather(
      location.latitude,
      location.longitude,
    ),
    getNews(),
  ]).then(([weather, headlines]) => {
    console.log(
      `\nWEATHER - ${location.name.toUpperCase()}`,
    );
    console.log(weather);

    console.log("\nNEWS HEADLINES");

    headlines.forEach((headline, index) => {
      console.log(
        `${index + 1}. ${headline}`,
      );
    });
  });
}

// 3. Promise.race()
function runPromiseRace(
  location: Location,
): Promise<void> {
  console.log("\n=======================================");
  console.log("PROMISE.RACE");

  return Promise.race([
    getWeather(
      location.latitude,
      location.longitude,
    ),
    getNews(),
  ]).then((result) => {
    console.log("\nFASTEST RESPONSE");

    if (Array.isArray(result)) {
      console.log("NEWS HEADLINES");

      result.forEach((headline, index) => {
        console.log(
          `${index + 1}. ${headline}`,
        );
      });
    } else {
      console.log(
        `WEATHER - ${location.name.toUpperCase()}`,
      );
      console.log(result);
    }
  });
}

// Ask the user for a location
rl.question(
  "Enter your location: ",
  (locationName) => {
    if (!locationName.trim()) {
      displayError(
        new Error("Please enter a location."),
      );

      rl.close();
      return;
    }

    // Find the location first
    getLocation(locationName)
      .then((location) => {
        // Run Promise chaining first
        return runPromiseChaining(location)
          .then(() => {
            // Run Promise.all second
            return runPromiseAll(location);
          })
          .then(() => {
            // Run Promise.race third
            return runPromiseRace(location);
          });
      })
      .then(() => {
        console.log(
          "\n",
        );

        rl.close();
      })
      .catch((error) => {
        displayError(error);
        rl.close();
      });
  },
);