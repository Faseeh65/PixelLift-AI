import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../keystatic.config";

export const runtime = "nodejs";

const keystaticApi = makeRouteHandler({ config });

export function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not Found", { status: 404 });
  }

  return keystaticApi.GET(request);
}

export function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not Found", { status: 404 });
  }

  return keystaticApi.POST(request);
}
