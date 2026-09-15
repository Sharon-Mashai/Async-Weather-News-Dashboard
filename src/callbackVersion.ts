import https from "https";
import { displayError } from "./errorHandler.js";

// Function to fetch weather data
function getWeather(callback: (error: Error | null, data?: string) => void) {
  const weatherUrl =
    "https://api.open-meteo.com/v1/forecast?latitude=-23.90&longitude=29.45&current=temperature_2m&daily=temperature_2m_min,temperature_2m_max&timezone=auto&forecast_days=1";

  https
    .get(weatherUrl, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        try {
          const weatherData = JSON.parse(data);

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

// Function to fetch news/posts
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
          const newsData = JSON.parse(data);

          const headlines = newsData.posts.map(
            (post: { title: string }) => post.title,
          );

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

// Callback hell example
getWeather((weatherError, weather) => {
  if (weatherError) {
    displayError(weatherError);
    return;
  }
  console.log("========================================");
  console.log("\nWEATHER - POLOKWANE");
  console.log(weather);

  getNews((newsError, headlines) => {
    if (newsError) {
      displayError(newsError);
      return;
    }
    console.log("========================================");

    console.log("\nNEWS HEADLINES");

    headlines?.forEach((headline, index) => {
      console.log(`${index + 1}. ${headline}`);
    });
    console.log("========================================\n");
  });
});
