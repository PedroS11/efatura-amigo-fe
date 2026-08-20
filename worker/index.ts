import type { ExportedHandler, Fetcher } from "@cloudflare/workers-types";

interface RateLimiter {
    limit(options: { key: string }): Promise<{ success: boolean }>;
}

interface Env {
    ASSETS: Fetcher;
    EFATURA_API_BASE_URL?: string;
    API_RATE_LIMITER: RateLimiter;
    AUTH_RATE_LIMITER: RateLimiter;
}

const PROXY_HEADERS = ["authorization", "content-type", "accept"];

const AUTH_SESSION_PATHS = ["/api/me"];

function proxyHeaders(request: Request): Headers {
    const headers = new Headers();

    for (const [name, value] of request.headers) {
        if (PROXY_HEADERS.includes(name.toLowerCase())) {
            headers.set(name, value);
        }
    }

    return headers;
}

function jsonError(status: number, message: string): Response {
    return Response.json({ error: message }, { status });
}

function getClientIp(request: Request): string {
    return request.headers.get("CF-Connecting-IP") ?? "unknown";
}

function isAuthSessionPath(pathname: string): boolean {
    return AUTH_SESSION_PATHS.includes(pathname);
}

async function enforceRateLimit(
    limiter: RateLimiter,
    ip: string
): Promise<Response | null> {
    const { success } = await limiter.limit({ key: ip });

    if (!success) {
        return jsonError(429, "Too many requests");
    }

    return null;
}

const handler: ExportedHandler<Env> = {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname.startsWith("/api/")) {
            const ip = getClientIp(request);

            if (isAuthSessionPath(url.pathname)) {
                const rateLimitResponse = await enforceRateLimit(
                    env.AUTH_RATE_LIMITER,
                    ip
                );
                if (rateLimitResponse !== null) {
                    return rateLimitResponse;
                }
            } else {
                const rateLimitResponse = await enforceRateLimit(
                    env.API_RATE_LIMITER,
                    ip
                );
                if (rateLimitResponse !== null) {
                    return rateLimitResponse;
                }
            }

            const baseUrl = env.EFATURA_API_BASE_URL?.trim();

            if (!baseUrl) {
                return jsonError(
                    500,
                    "EFATURA_API_BASE_URL is not configured on the Worker"
                );
            }

            try {
                const target = new URL(url.pathname + url.search, baseUrl);

                return fetch(target, {
                    method: request.method,
                    headers: proxyHeaders(request),
                    body: ["GET", "HEAD"].includes(request.method)
                        ? undefined
                        : request.body,
                });
            } catch (error) {
                console.error("API proxy error:", error);

                return jsonError(
                    502,
                    error instanceof Error ? error.message : "API proxy failed"
                );
            }
        }

        return env.ASSETS.fetch(request);
    },
};

export default handler;
