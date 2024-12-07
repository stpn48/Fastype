export async function catchError<T>(promise: Promise<T>): Promise<[T | null, Error | null]> {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    if (error instanceof Error) {
      return [null, error];
    }
    // Handle unexpected error formats
    return [null, new Error("An unknown error occurred")];
  }
}
