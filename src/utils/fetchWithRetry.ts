// Utility function to handle API retries
export async function fetchWithRetry<T>(
  fetcher: () => Promise<T>,
  MAX_RETRIES: number = 3,
  RETRY_DELAY: number = 2000,
  retryCount = 0
): Promise<T> {
  try {
    return await fetcher();
  } catch (err) {
    if (retryCount < MAX_RETRIES) {
      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY * (retryCount + 1))
      );
      return fetchWithRetry(fetcher, retryCount + 1);
    }
    throw err;
  }
}
