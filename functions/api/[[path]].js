export async function onRequest(context) {
    const incoming = new URL(context.request.url);

    const path = incoming.pathname.replace(/^\/api/, "");

    const target = new URL(
        path + incoming.search,
        context.env.EFATURA_API_BASE_URL
    );

    return fetch(target, {
        method: context.request.method,
        headers: context.request.headers,
        body: ["GET", "HEAD"].includes(context.request.method)
            ? undefined
            : context.request.body,
    });
}
