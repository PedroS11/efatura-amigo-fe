const API_URL = import.meta.env.VITE_API_URL;

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

export async function apiFetch(path: string): Promise<Response> {
    const response = await fetch(`${API_URL}${path}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("idToken")}`,
        },
    });

    if ([401, 403].includes(response.status)) {
        throw new ApiAuthError(response);
    }

    if (!response.ok) {
        throw new ApiError(response);
    }

    return response;
}

export async function apiFetchJson<T>(path: string): Promise<T> {
    const response = await apiFetch(path);
    return response.json();
}
