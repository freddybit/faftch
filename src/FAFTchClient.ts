import { FAFTchError } from "./FAFTchError.js";
import { executeWithRetry } from "./retryEngine.js";
import { createTimeoutSignal } from "./timeoutSignal.js";
import type { FAFTchOptions, FAFTchResponse, HTTPMethod } from "./types.js";

export class FAFTchClient {
	private readonly defaults: FAFTchOptions;

    constructor(options: FAFTchOptions = {}) {
		this.defaults = {
			timeout: 0,
			retry: { maxAttempts: 3, delay: 0 },
			...options,
			headers: {
				...options.headers,
			},
		};
	}

    public static create(options?: FAFTchOptions): FAFTchClient {
		return new FAFTchClient(options);
	}

    public async request<T = unknown>(url: string, method: HTTPMethod, options: FAFTchOptions = {}): Promise<FAFTchResponse<T>> {

		const combinedOptions: FAFTchOptions = {
			...this.defaults,
			...options,
			headers: {
				...this.defaults.headers,
				...options.headers,
			},
			retry: {
				...this.defaults.retry,
				...options.retry,
			},
		};

		let finalUrl = url;
		if (combinedOptions.baseUrl && !url.startsWith("http://") && !url.startsWith("https://")) {
			const base = combinedOptions.baseUrl.endsWith("/")
				? combinedOptions.baseUrl
				: `${combinedOptions.baseUrl}/`;
			const relative = url.startsWith("/") ? url.slice(1) : url;
			finalUrl = `${base}${relative}`;
		}

		const fetchOptions: RequestInit = {
			method,
			headers: new Headers(combinedOptions.headers),
		};

		if (combinedOptions.body !== undefined && method !== "GET") {
			if (typeof combinedOptions.body === "object") {
				fetchOptions.body = JSON.stringify(combinedOptions.body);
				if (!(fetchOptions.headers as Headers).has("Content-Type")) {
					(fetchOptions.headers as Headers).set("Content-Type", "application/json");
				}
			} else {
				fetchOptions.body = String(combinedOptions.body);
			}
		}

		const executionTask = async (): Promise<FAFTchResponse<T>> => {
			const { signal, clear } = createTimeoutSignal(
				combinedOptions.timeout ?? 0,
				finalUrl,
				method
			);
			fetchOptions.signal = signal;

			try {
                const response = await fetch(finalUrl, fetchOptions);

                let data: any;
                const contentType = response.headers.get("content-type") || "";

                if (contentType.includes("application/json")) {
                    data = await response.json();
                } else {
                    data = await response.text();
                }

                const faftchResponse: FAFTchResponse<T> = {
                    data,
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                    config: combinedOptions,
                };

                if (response.status >= 400 && response.status < 500) {
                    throw new FAFTchError(
                        `Request failed with status code ${response.status}`,
                        response.status,
                        response.statusText,
                        { url: finalUrl, method }
                    );
                }

                if (response.status >= 500) {
                    throw new FAFTchError(
                        `Server error with status code ${response.status}`,
                        response.status,
                        response.statusText,
                        { url: finalUrl, method }
                    );
                }

                return faftchResponse;

			} catch (error: any) {
                if (signal.aborted && signal.reason instanceof FAFTchError) {
                    throw signal.reason;
                }

                if (error instanceof FAFTchError) {
                    throw error;
                }

                throw new FAFTchError(
                    error.message || "Network Error", 
                    undefined, 
                    undefined, 
                    { url: finalUrl, method }
                );
			} finally {
				clear(); 
			}
		};


		return executeWithRetry(executionTask, combinedOptions.retry);
	}

	public async get<T = unknown>(url: string, options?: FAFTchOptions): Promise<FAFTchResponse<T>> {
		return this.request<T>(url, "GET", options);
	}

	public async post<T = unknown>(url: string, body?: unknown, options?: FAFTchOptions): Promise<FAFTchResponse<T>> {
		return this.request<T>(url, "POST", { ...options, body });
	}

	public async put<T = unknown>(url: string, body?: unknown, options?: FAFTchOptions): Promise<FAFTchResponse<T>> {
		return this.request<T>(url, "PUT", { ...options, body });
	}

	public async patch<T = unknown>(url: string, body?: unknown, options?: FAFTchOptions): Promise<FAFTchResponse<T>> {
		return this.request<T>(url, "PATCH", { ...options, body });
	}

	public async delete<T = unknown>(url: string, options?: FAFTchOptions): Promise<FAFTchResponse<T>> {
		return this.request<T>(url, "DELETE", options);
	}

}