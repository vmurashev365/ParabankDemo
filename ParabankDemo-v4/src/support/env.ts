// Base URL should point to the server root (no trailing /parabank).
const DEFAULT_BASE_URL = 'http://127.0.0.1:8081';

export function resolveBaseUrl(): string {
  const candidates = [process.env.PARABANK_BASE_URL, process.env.BASE_URL, DEFAULT_BASE_URL];
  const chosen = candidates.find((value) => value && value.trim().length > 0) ?? DEFAULT_BASE_URL;
  return chosen.trim().replace(/\/+$/, '');
}
