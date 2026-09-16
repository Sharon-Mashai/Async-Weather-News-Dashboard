# Async Weather & News Dashboard

A Node.js and TypeScript project that demonstrates different ways of handling asynchronous programming in JavaScript/TypeScript.

The application fetches:

- Weather information for Polokwane
- Current temperature
- Minimum temperature
- Maximum temperature
- Five news/post headlines

The project demonstrates three asynchronous programming approaches:

1. Callbacks
2. Promises
3. Async/Await

It also demonstrates `Promise.all()` and `Promise.race()`.

---

## Features

- Fetch weather data from Open-Meteo
- Fetch post headlines from DummyJSON
- Display current temperature
- Display minimum temperature
- Display maximum temperature
- Display five headlines
- Callback implementation
- Promise implementation
- Async/Await implementation
- Promise chaining
- `Promise.all()`
- `Promise.race()`
- Error handling
- Readable terminal output

---

## Technologies Used

- Node.js
- TypeScript
- tsx
- Node.js HTTPS module
- Open-Meteo API
- DummyJSON Posts API

---



## Getting Started

Follow these steps to run the project after cloning it from GitHub.

### 1. Clone the Repository

Open a terminal and run:

```bash
git clone <your-repository-url>
```

Replace `<your-repository-url>` with the URL of your GitHub repository.

Example:

```bash
git clone https://github.com/your-username/Async-Weather-News-Dashboard.git
```

### 2. Navigate Into the Project

```bash
cd Async-Weather-News-Dashboard
```

### 3. Install Dependencies

Run:

```bash
npm install
```

This installs all the dependencies listed in `package.json`, including TypeScript and tsx.

### 4. Run the Callback Version

```bash
npm run callback
```

This runs:

```text
src/callbackVersion.ts
```

The callback version demonstrates asynchronous programming using callback functions.

The news request is performed inside the weather callback to demonstrate nested callbacks.

### 5. Run the Promise Version

```bash
npm run promise
```

This runs:

```text
src/promiseVersion.ts
```

The Promise version demonstrates:

- Promise chaining
- `Promise.all()`
- `Promise.race()`

`Promise.all()` starts the weather and news requests together and waits for both to complete.

`Promise.race()` returns the result of whichever request completes first.

### 6. Run the Async/Await Version

```bash
npm run async
```

This runs:

```text
src/asyncAwaitVersion.ts
```

This version uses `async` and `await` to make asynchronous code easier to read.

It also uses `try...catch` for error handling.

---

## NPM Commands
Commands          
- `npm install` -Installs project dependencies
- `npm run callback` - Runs the Callback version    
- `npm run promise`- Runs the Promise version     
- `npm run async`  - Runs the Async/Await version  

---

## Sample Callback Output

```text
WEATHER - POLOKWANE
Current Temperature: 20.3°C
Minimum Temperature: 13.6°C
Maximum Temperature: 28°C

====================
NEWS HEADLINES
1. His mother had always taught him
2. He was an expert but not in a discipline
3. Dave watched as the forest burned up on the hill.
4. All he wanted was a candy bar.
5. Hopes and dreams were dashed that day.
```

The temperature values may change because the weather data is fetched from an API.

---

## Sample Promise Output

```text
PROMISE CHAINING
========================

WEATHER - POLOKWANE
Current Temperature: 20.3°C
Minimum Temperature: 13.6°C
Maximum Temperature: 28°C

NEWS HEADLINES
1. His mother had always taught him
2. He was an expert but not in a discipline
3. Dave watched as the forest burned up on the hill.
4. All he wanted was a candy bar.
5. Hopes and dreams were dashed that day.

========================
PROMISE.ALL
========================

WEATHER - POLOKWANE
Current Temperature: 20.3°C
Minimum Temperature: 13.6°C
Maximum Temperature: 28°C

NEWS HEADLINES
1. His mother had always taught him
2. He was an expert but not in a discipline
3. Dave watched as the forest burned up on the hill.
4. All he wanted was a candy bar.
5. Hopes and dreams were dashed that day.

========================
PROMISE.RACE
========================

FASTEST RESPONSE
Current Temperature: 20.3°C
Minimum Temperature: 13.6°C
Maximum Temperature: 28°C

========================
```

The result of `Promise.race()` may be different between runs because it returns whichever asynchronous request completes first.

---

## Sample Async/Await Output

```text
ASYNC/AWAIT VERSION
===================

WEATHER - POLOKWANE
Current Temperature: 20.3°C
Minimum Temperature: 13.6°C
Maximum Temperature: 28°C

====================
NEWS HEADLINES
1. His mother had always taught him
2. He was an expert but not in a discipline
3. Dave watched as the forest burned up on the hill.
4. All he wanted was a candy bar.
5. Hopes and dreams were dashed that day.
```

---

## Error Handling

The project uses a shared error-handling function located in:

```text
src/errorHandler.ts
```

The function displays readable error messages when something goes wrong.

For example:

```text
Error: Failed to fetch weather data.
```

or:

```text
Error: Failed to fetch news data.
```

This keeps error handling consistent between the Callback, Promise, and Async/Await implementations.

---

## APIs Used

### Open-Meteo

Open-Meteo is used to retrieve weather information for Polokwane(My Current Location).

The project displays:

- Current temperature
- Minimum temperature
- Maximum temperature

### DummyJSON

DummyJSON Posts is used to retrieve five post titles that are displayed as headlines for the purpose of demonstrating asynchronous API requests.

The headlines are sample post data and should not be treated as live news.

---

## Learning Outcomes

Through this project, I learned how asynchronous programming works in Node.js and TypeScript.

### Callbacks

I learned how callback functions can be used to execute code after an asynchronous operation has completed.

I also learned how nested callbacks can make code more difficult to read as the number of asynchronous operations increases.

### Promises

I learned how Promises can make asynchronous operations easier to manage than nested callbacks.

I learned how to use `.then()` and `.catch()` to handle successful and failed asynchronous operations.

### Promise.all()

I learned that `Promise.all()` can start multiple asynchronous operations together and wait until all of them have completed successfully.

In this project, it is used to fetch the weather and news data together.

### Promise.race()

I learned that `Promise.race()` starts multiple Promises and returns the result of the first one that settles.

In this project, the weather and news requests compete to finish first.

### Async/Await

I learned how `async` and `await` provide a cleaner and more readable way to work with Promises.

I also learned how `try...catch` can be used to handle errors when using Async/Await.

### Error Handling

I learned the importance of handling errors when working with external APIs.

The project provides readable error messages when weather or news data cannot be fetched or processed.

---

## How the Project Demonstrates Asynchronous Programming

The project performs tasks that depend on external API responses.

Instead of stopping the entire program while waiting for the APIs to respond, Node.js handles these operations asynchronously.

The same weather and news functionality is implemented using:

```text
Callbacks
    ↓
Promises
    ↓
Async/Await
```

This makes it possible to compare the different approaches and understand how asynchronous programming can be improved from callbacks to Promises and then to Async/Await.

---

## Author

GitHub: [Sharon-Mashai](https://github.com/Sharon-Mashai)
