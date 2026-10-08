import axios, { isAxiosError } from "axios";

// Shared axios instance. NEXT_PUBLIC_API_BASE_URL is baked in at build time (see .env.example).
export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1",
  timeout: 20_000,
  headers: { "Content-Type": "application/json" },
});

/** Error shape every screen works with */
export interface ApiError {
  status: number | null;
  message: string;
  /** Field name → message, from a 400/409 response */
  fieldErrors: Record<string, string>;
}

interface ApiErrorBody {
  message?: string | string[];
  errors?: Record<string, string>;
}

const NETWORK_MESSAGE = "Could not reach the server. Check your connection and try again.";
const UNKNOWN_MESSAGE = "Something went wrong. Please try again.";

/** Turn anything thrown by axios into an ApiError with a message that's safe to show. */
export function toApiError(error: unknown): ApiError {
  if (isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) return { status: null, message: NETWORK_MESSAGE, fieldErrors: {} };
    const body = error.response.data ?? {};
    const message = Array.isArray(body.message) ? body.message[0] : body.message;
    return { status: error.response.status, message: message || UNKNOWN_MESSAGE, fieldErrors: body.errors ?? {} };
  }
  return { status: null, message: UNKNOWN_MESSAGE, fieldErrors: {} };
}
