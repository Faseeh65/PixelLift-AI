import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../keystatic.config";
import {
  getKeystaticGitHubAuthConfig,
  isKeystaticProductionAdminEnabled,
} from "@/lib/keystatic-server";

export const runtime = "nodejs";

function blockInProduction() {
  return new Response("Not Found", { status: 404 });
}

function createKeystaticApi() {
  return makeRouteHandler({
    config,
    ...getKeystaticGitHubAuthConfig(),
  });
}

export function GET(request: Request) {
  if (!isKeystaticProductionAdminEnabled()) {
    return blockInProduction();
  }

  return createKeystaticApi().GET(request);
}

export function POST(request: Request) {
  if (!isKeystaticProductionAdminEnabled()) {
    return blockInProduction();
  }

  return createKeystaticApi().POST(request);
}
