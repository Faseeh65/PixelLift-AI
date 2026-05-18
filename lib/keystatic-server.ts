import "server-only";

import {
  isKeystaticGitHubModeRequested,
  isKeystaticGitHubStorageConfigured,
} from "./keystatic-public";

let didLogKeystaticEnvStatus = false;

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

function logKeystaticEnvStatus() {
  if (didLogKeystaticEnvStatus || process.env.NODE_ENV !== "production") {
    return;
  }

  didLogKeystaticEnvStatus = true;

  const storageKind =
    process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND?.trim().toLowerCase() ===
    "github";
  const repoOwner = Boolean(
    process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER?.trim()
  );
  const repoName = Boolean(
    process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME?.trim()
  );
  const branch = Boolean(process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_BRANCH?.trim());
  const clientId = Boolean(process.env.KEYSTATIC_GITHUB_CLIENT_ID?.trim());
  const clientSecret = Boolean(
    process.env.KEYSTATIC_GITHUB_CLIENT_SECRET?.trim()
  );
  const secretValue = process.env.KEYSTATIC_SECRET?.trim();
  const secret = Boolean(secretValue);
  const secretLongEnough = Boolean(secretValue && secretValue.length >= 32);
  const appUrl = Boolean(process.env.NEXT_PUBLIC_APP_URL?.trim());

  console.info("Keystatic production env diagnostics", {
    NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND_github: storageKind,
    NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER_present: repoOwner,
    NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME_present: repoName,
    NEXT_PUBLIC_KEYSTATIC_GITHUB_BRANCH_present: branch,
    KEYSTATIC_GITHUB_CLIENT_ID_present: clientId,
    KEYSTATIC_GITHUB_CLIENT_SECRET_present: clientSecret,
    KEYSTATIC_SECRET_present: secret,
    KEYSTATIC_SECRET_length_ge_32: secretLongEnough,
    NEXT_PUBLIC_APP_URL_present: appUrl,
  });
}

export function isKeystaticProductionAdminEnabled(): boolean {
  logKeystaticEnvStatus();

  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  return (
    isKeystaticGitHubModeRequested() &&
    isKeystaticGitHubStorageConfigured() &&
    hasKeystaticAuthSecrets()
  );
}
