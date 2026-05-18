import "server-only";

import {
  isKeystaticGitHubModeRequested,
  isKeystaticGitHubStorageConfigured,
} from "./keystatic-public";

function hasKeystaticAuthSecrets(): boolean {
  const clientId = process.env.KEYSTATIC_GITHUB_CLIENT_ID?.trim();
  const clientSecret = process.env.KEYSTATIC_GITHUB_CLIENT_SECRET?.trim();
  const secret = process.env.KEYSTATIC_SECRET?.trim();

  return Boolean(
    clientId &&
      clientSecret &&
      secret &&
      secret.length >= 32
  );
}

export function isKeystaticProductionAdminEnabled(): boolean {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  return (
    isKeystaticGitHubModeRequested() &&
    isKeystaticGitHubStorageConfigured() &&
    hasKeystaticAuthSecrets()
  );
}
