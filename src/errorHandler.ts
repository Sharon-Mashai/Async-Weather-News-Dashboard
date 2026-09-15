export function displayError(error: unknown): void {
  if (error instanceof Error) {
    console.error("Error:", error.message);
  } else {
    console.error("Error: Something went wrong.");
  }
}