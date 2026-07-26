export interface FAFTchErrorContext {
    url?: string;
    method: string;
    isTimeout?: boolean;
    [key: string]: unknown;
}

export interface TimeoutSignalResult {
    signal: AbortSignal;
    clear: () => void;
}

export interface StandarizedResponse {
	status: number;
}

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RetryOptions {
    maxAttempts?: number;
    delay?: number;
}

export interface FAFTchOptions {
    baseUrl?: string;
    headers?: Record<string, string>;
    timeout?: number;
    retry?: RetryOptions;
    body?: unknown;
}

export interface FAFTchResponse<T = unknown> {
    data: T;
    status: number;
    statusText: string;
    headers: Headers;
    config: FAFTchOptions;
}
