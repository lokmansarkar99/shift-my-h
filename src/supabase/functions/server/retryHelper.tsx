/**
 * Retry helper for handling transient network errors
 * Implements exponential backoff with jitter
 */

interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelayMs = 100,
    maxDelayMs = 2000,
    backoffMultiplier = 2
  } = options;

  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Check if error is retryable (connection errors)
      const isRetryable = 
        error.message?.includes('connection') ||
        error.message?.includes('reset') ||
        error.message?.includes('timeout') ||
        error.message?.includes('ECONNRESET');
      
      // Don't retry if not a connection error or if it's the last attempt
      if (!isRetryable || attempt === maxAttempts) {
        throw error;
      }
      
      // Calculate delay with exponential backoff and jitter
      const baseDelay = Math.min(
        initialDelayMs * Math.pow(backoffMultiplier, attempt - 1),
        maxDelayMs
      );
      const jitter = Math.random() * 0.3 * baseDelay; // ±30% jitter
      const delay = baseDelay + jitter;
      
      console.log(`Retry attempt ${attempt}/${maxAttempts} after ${Math.round(delay)}ms due to: ${error.message}`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}
