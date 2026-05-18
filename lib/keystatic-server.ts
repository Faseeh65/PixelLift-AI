import "server-only";

import {
  getKeystaticStorageKind,
  isKeystaticGitHubModeRequested,
  isKeystaticGitHubStorageConfigured,
} from "./keystatic-public";

let didLogKeystaticEnvStatus = false;

function getTrimmedEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function hasKeystaticAuthSecrets(): boolean {
  const clientId = getTrimmedEnv("KEYSTATIC_GITHUB_CLIENT_ID");
  const clientSecret = getTrimmedEnv("KEYSTATIC_GITHUB_CLIENT_SECRET");
  const secret = getTrimmedEnv("KEYSTATIC_SECRET");

  return Boolean(clientId && clientSecret && secret && secret.length >= 32);
}

function logKeystaticEnvStatus() {
  if (didLogKeystaticEnvStatus || process.env.NODE_ENV !== "production") {
    return;
  }

  didLogKeystaticEnvStatus = true;

  const storageKind = getKeystaticStorageKind();
  const repoOwner = Boolean(
    getTrimmedEnv("NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER")
  );
  const repoName = Boolean(
    getTrimmedEnv("NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME")
  );
  const branch = Boolean(getTrimmedEnv("NEXT_PUBLIC_KEYSTATIC_GITHUB_BRANCH"));
  const clientId = Boolean(getTrimmedEnv("KEYSTATIC_GITHUB_CLIENT_ID"));
  const clientSecret = Boolean(getTrimmedEnv("KEYSTATIC_GITHUB_CLIENT_SECRET"));
  const secretValue = getTrimmedEnv("KEYSTATIC_SECRET");
  const secret = Boolean(secretValue);
  const secretLongEnough = Boolean(secretValue && secretValue.length >= 32);
  const appUrl = getTrimmedEnv("NEXT_PUBLIC_APP_URL") ?? "";

  console.info("Keystatic production mode:", true);
  console.info("storage kind:", storageKind);
  console.info("NEXT_PUBLIC_APP_URL:", appUrl);
  console.info("GitHub client id present:", clientId);
  console.info("GitHub client secret present:", clientSecret);
  console.info("KEYSTATIC_SECRET present:", secret);
  console.info("KEYSTATIC_SECRET length >= 32:", secretLongEnough);
  console.info("repo owner present:", repoOwner);
  console.info("repo name present:", repoName);
  console.info("repo branch present:", branch);
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

export function getKeystaticGitHubAuthConfig() {
  return {
    clientId: getTrimmedEnv("KEYSTATIC_GITHUB_CLIENT_ID"),
    clientSecret: getTrimmedEnv("KEYSTATIC_GITHUB_CLIENT_SECRET"),
    secret: getTrimmedEnv("KEYSTATIC_SECRET"),
  };
}
