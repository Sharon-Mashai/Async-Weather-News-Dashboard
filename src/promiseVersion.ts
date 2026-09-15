import https from "https";
import { displayError } from "./errorHandler.js";

// Fetch weather using a Promise
function getWeather(): Promise<string> {
  const weatherUrl =
    "https://api.open-meteo.com/v1/forecast?latitude=-23.90&longitude=29.45&current=temperature_2m&daily=temperature_2m_min,temperature_2m_max&timezone=auto&forecast_days=1";

  return new Promise((resolve, reject) => {
    https
      .get(weatherUrl, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          try {
            const weatherData = JSON.parse(data);

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
              new Error("Failed to process weather data."),
            );
          }
        });
      })
      .on("error", () => {
        reject(
          new Error("Failed to fetch weather data."),
        );
      });
  });
}

// Fetch news using a Promise
function getNews(): Promise<string[]> {
  const newsUrl =
    "https://dummyjson.com/posts?limit=5";

  return new Promise((resolve, reject) => {
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

            resolve(headlines);
          } catch {
            reject(
              new Error("Failed to process news data."),
            );
          }
        });
      })
      .on("error", () => {
        reject(
          new Error("Failed to fetch news data."),
        );
      });
  });
}

// 1. Promise chaining
function runPromiseChaining(): Promise<void> {
  console.log("\nPROMISE CHAINING");
  console.log("========================");

  return getWeather()
    .then((weather) => {
      console.log("\nWEATHER - POLOKWANE");
      console.log(weather);

      return getNews();
    })
    .then((headlines) => {
      console.log("\nNEWS HEADLINES");

      headlines.forEach((headline, index) => {
        console.log(`${index + 1}. ${headline}`);
      });
    });
}

// 2. Promise.all()
function runPromiseAll(): Promise<void> {
  console.log("\n========================");
  console.log("PROMISE.ALL");
  console.log("========================");

  return Promise.all([getWeather(), getNews()])
    .then(([weather, headlines]) => {
      console.log("\nWEATHER - POLOKWANE");
      console.log(weather);

      console.log("\nNEWS HEADLINES");

      headlines.forEach((headline, index) => {
        console.log(`${index + 1}. ${headline}`);
      });
    });
}

// 3. Promise.race()
function runPromiseRace(): Promise<void> {
  console.log("\n========================");
  console.log("PROMISE.RACE");
  console.log("========================");

  return Promise.race([getWeather(), getNews()])
    .then((result) => {
      console.log("\nFASTEST RESPONSE");
      console.log(result);
    });
}

// Run each Promise example in order
runPromiseChaining()
  .then(() => {
    return runPromiseAll();
  })
  .then(() => {
    return runPromiseRace();
  })
  .then(() => {
    console.log("\n========================");
  })
  .catch((error) => {
    displayError(error);
  });