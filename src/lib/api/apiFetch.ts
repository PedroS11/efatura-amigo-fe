const API_URL = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  response: Response;

  constructor(response: Response) {
    super(`API request failed with status ${response.status}`);
    this.name = "ApiError";
    this.response = response;
  }
}

export class ApiAuthError extends ApiError {
  constructor(response: Response) {
    super(response);
    this.name = "ApiAuthError";
  }
}

export async function apiFetch(method: string, path: string, data?: object): Promise<Response> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    method,
    headers: data ? { "Content-Type": "application/json" } : undefined,
    body: data ? JSON.stringify(data) : undefined
  });

  if ([401, 403].includes(response.status)) {
    throw new ApiAuthError(response);
  }

  if (!response.ok) {
    throw new ApiError(response);
  }

  return response;
}

export async function apiFetchJson<T>(method: string, path: string, data?: object): Promise<T> {
  const response = await apiFetch(method, path, data);
  return response.json();
}
