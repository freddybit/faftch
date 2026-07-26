import type { RetryOptions, StandarizedResponse } from "./types.js";

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export async function executeWithRetry<T extends StandarizedResponse>( operation: () => Promise<T>, options?: RetryOptions): Promise<T> {
	const maxAttempts = options?.maxAttempts ?? 3;
	const delay = options?.delay ?? 0;
	let lastError: unknown;

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			const response = await operation();
			if (response.status >= 500 && response.status <= 599) throw response; 
			return response;
		} catch (error) {
			lastError = error;
			if (attempt === maxAttempts) break;
			if (delay > 0)  await sleep(delay);
		}
	}

	throw lastError;
}