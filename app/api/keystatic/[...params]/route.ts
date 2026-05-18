import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../keystatic.config";

export const runtime = "nodejs";

const keystaticApi = makeRouteHandler({
  config,
});

function blockInProduction() {
  return new Response("Not Found", { status: 404 });
}

export function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return blockInProduction();
  }

  return keystaticApi.GET(request);
}

export function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return blockInProduction();
  }

  return keystaticApi.POST(request);
}
