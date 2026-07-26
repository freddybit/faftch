import type { FAFTchErrorContext } from "./types.js";

export class FAFTchError extends Error {

    public readonly status?: number | undefined;
    public readonly statusText?: string | undefined;
    public readonly context?: FAFTchErrorContext | undefined;

constructor(message: string, status?: number, statusText?: string, context?: FAFTchErrorContext) {
		super(message);

		this.name = "FAFTchError";
		this.status = status;
		this.statusText = statusText;
		this.context = context;


		Object.setPrototypeOf(this, FAFTchError.prototype);

		if ((Error as any).captureStackTrace) {
			(Error as any).captureStackTrace(this, FAFTchError);
		}
	}
}