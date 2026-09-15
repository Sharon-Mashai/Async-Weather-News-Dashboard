import https from "https";

// Fetch weather using a Promise
function getWeather(): Promise<string> {
  const weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=-26.20&longitude=28.04&current=temperature_2m";

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

            const temperature = weatherData.current.temperature_2m;

            resolve(`Current temperature: ${temperature}°C`);
          } catch {
            reject(new Error("Failed to process weather data."));
          }
        });
      })
      .on("error", () => {
        reject(new Error("Failed to fetch weather data."));
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
            const newsData = JSON.parse(data);

            const headlines = newsData.posts.map(
              (post: { title: string }) => post.title,
            );

            resolve(headlines);
          } catch {
            reject(new Error("Failed to process news data."));
          }
        });
      })
      .on("error", () => {
        reject(new Error("Failed to fetch news data."));
      });
  });
}

// 1. Promise chaining
console.log("\nPROMISE CHAINING");

getWeather()
  .then((weather) => {
    console.log("\nWEATHER");
    console.log(weather);

    return getNews();
  })
  .then((headlines) => {
    console.log("\nNEWS HEADLINES");

    headlines.forEach((headline, index) => {
      console.log(`${index + 1}. ${headline}`);
    });
  })
  .catch((error: Error) => {
    console.error("Error:", error.message);
  });

// 2. Promise.all()
Promise.all([getWeather(), getNews()])
  .then(([weather, headlines]) => {
    console.log("\nPROMISE.ALL");

    console.log("\nWeather:");
    console.log(weather);

    console.log("\nNews Headlines:");

    headlines.forEach((headline, index) => {
      console.log(`${index + 1}. ${headline}`);
    });
  })
  .catch((error: Error) => {
    console.error("Error:", error.message);
  });

// 3. Promise.race()
Promise.race([getWeather(), getNews()])
  .then((result) => {
    console.log("\nPROMISE.RACE");
    console.log("Fastest response:");
    console.log(result);
  })
  .catch((error: Error) => {
    console.error("Error:", error.message);
  });
