import https from "https";

// Function to fetch weather data
function getWeather(
  callback: (error: Error | null, data?: string) => void,
) {
  const weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=-26.20&longitude=28.04&current=temperature_2m";

  https.get(weatherUrl, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      try {
        const weatherData = JSON.parse(data);

        const temperature = weatherData.current.temperature_2m;

        callback(
          null, `Current temperature: ${temperature}°C`,);
      } catch {
        callback(
          new Error("Failed to process weather data."),
        );
      }
    });
  }).on("error", () => {
    callback(
      new Error("Failed to fetch weather data."),
    );
  });
}

// Function to fetch news/posts
function getNews(
  callback: (error: Error | null, data?: string[]) => void,
) {
  const newsUrl ="https://dummyjson.com/posts?limit=5";

  https.get(newsUrl, (response) => {
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
        callback(
          new Error("Failed to process news data."),
        );
      }
    });
  }).on("error", () => {
    callback(
      new Error("Failed to fetch news data."),
    );
  });
}

// Callback hell example
getWeather((weatherError, weather) => {
  if (weatherError) {
    console.error(
      "Error:",
      weatherError.message,
    );
    return;
  }

  console.log("\nWEATHER");
  console.log(weather);

  getNews((newsError, headlines) => {
    if (newsError) {
      console.error(
        "Error:",
        newsError.message,
      );
      return;
    }

    console.log("\nNEWS HEADLINES");

    headlines?.forEach((headline, index) => {
      console.log(`${index + 1}. ${headline}`);
    });
  });
});