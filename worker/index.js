const PROXY_HEADERS = ["authorization", "content-type", "accept"];

function proxyHeaders(request) {
    const headers = new Headers();

    for (const [name, value] of request.headers) {
        if (PROXY_HEADERS.includes(name.toLowerCase())) {
            headers.set(name, value);
        }
    }

    return headers;
}

function jsonError(status, message) {
    return Response.json({ error: message }, { status });
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname.startsWith("/api/")) {
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
