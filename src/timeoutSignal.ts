import { FAFTchError } from "./FAFTchError.js";
import type { TimeoutSignalResult } from "./types.js";

export function createTimeoutSignal(timeoutMs: number, url: string, method: string): TimeoutSignalResult {
    const controller = new AbortController();

    if (timeoutMs <= 0) {
		return { signal: controller.signal, clear: () => {} };
	}

    const timeoutId = setTimeout(() => {

		const timeoutError = new FAFTchError(
			`Request timed out after ${timeoutMs}ms`,
			undefined,
			undefined,
			{ isTimeout: true, url, method }
		);

		controller.abort(timeoutError);
	}, timeoutMs);
    
    const clear = (): void => {
		clearTimeout(timeoutId);
	};

	return {
		signal: controller.signal,
		clear,
	};

}