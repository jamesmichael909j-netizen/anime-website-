// Optional Cloudflare Worker example for a fixed, public AniList metadata endpoint.
// No API keys or arbitrary destination URLs. Test direct browser requests first; deploy only if needed.
const ALLOWED_ORIGIN = "https://YOUR-USERNAME.github.io";
const UPSTREAM = "https://graphql.anilist.co";
export default {
  async fetch(request) {
    const origin = request.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : "null",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    };
    if (origin !== ALLOWED_ORIGIN) return new Response("Origin not allowed", { status: 403 });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });
    const type = request.headers.get("Content-Type") || "";
    if (!type.toLowerCase().includes("application/json")) return new Response("JSON required", { status: 415, headers: cors });
    const body = await request.text();
    if (body.length > 50000) return new Response("Request too large", { status: 413, headers: cors });
    const upstream = await fetch(UPSTREAM, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body });
    const headers = new Headers(cors); headers.set("Content-Type", upstream.headers.get("Content-Type") || "application/json");
    return new Response(await upstream.text(), { status: upstream.status, headers });
  }
};
