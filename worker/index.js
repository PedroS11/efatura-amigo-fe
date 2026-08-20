export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname.startsWith("/api/")) {
            const apiPath = url.pathname.replace(/^\/api/, "");
            const target = new URL(
                apiPath + url.search,
                env.EFATURA_API_BASE_URL
            );

            const headers = new Headers(request.headers);
            headers.set("Host", target.host);

            return fetch(target, {
                method: request.method,
                headers,
                body: ["GET", "HEAD"].includes(request.method)
                    ? undefined
                    : request.body,
            });
        }

        return env.ASSETS.fetch(request);
    },
};
