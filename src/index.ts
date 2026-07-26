// src/index.ts

import { FAFTchClient } from "./FAFTchClient.js";
import type { FAFTchOptions, FAFTchResponse } from "./types.js";
export * from "./types.js";
export { FAFTchError } from "./FAFTchError.js";

const defaultOptions: FAFTchOptions = {
	timeout: 5000,
	retry: {
		maxAttempts: 3,
		delay: 1000,
	},
};

const fafFetchInstance = new FAFTchClient(defaultOptions);

const faftch = {
	get: <T = any>(url: string, options?: FAFTchOptions): Promise<FAFTchResponse<T>> => 
		fafFetchInstance.get<T>(url, options),

	post: <T = any>(url: string, data?: any, options?: FAFTchOptions): Promise<FAFTchResponse<T>> => 
		fafFetchInstance.post<T>(url, data, options),

	put: <T = any>(url: string, data?: any, options?: FAFTchOptions): Promise<FAFTchResponse<T>> => 
		fafFetchInstance.put<T>(url, data, options),

	patch: <T = any>(url: string, data?: any, options?: FAFTchOptions): Promise<FAFTchResponse<T>> => 
		fafFetchInstance.patch<T>(url, data, options),

	delete: <T = any>(url: string, options?: FAFTchOptions): Promise<FAFTchResponse<T>> => 
		fafFetchInstance.delete<T>(url, options),
	
	create: (instanceOptions: FAFTchOptions): FAFTchClient => {
		const mergedOptions: FAFTchOptions = { 
			...defaultOptions, 
			...instanceOptions,
			headers: {
				...defaultOptions.headers,
				...instanceOptions.headers
			},
			retry: {
				...defaultOptions.retry,
				...instanceOptions.retry
			}
		};
		return new FAFTchClient(mergedOptions);
	}
};

export default faftch;