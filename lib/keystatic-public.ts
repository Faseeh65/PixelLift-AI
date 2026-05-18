export type KeystaticStorageKind = "local" | "github";

const DEFAULT_GITHUB_OWNER = "Faseeh65";
const DEFAULT_GITHUB_REPO = "PixelLift-AI";
const DEFAULT_GITHUB_BRANCH = "main";

export function getKeystaticStorageKind(): KeystaticStorageKind {
  return process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND === "github"
    ? "github"
    : "local";
}

export function getKeystaticGitHubRepo() {
  return {
    owner:
      process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER?.trim() ||
      DEFAULT_GITHUB_OWNER,
    name:
      process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME?.trim() ||
      DEFAULT_GITHUB_REPO,
    branch:
      process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_BRANCH?.trim() ||
      DEFAULT_GITHUB_BRANCH,
  };
}

export function hasKeystaticGitHubRepoEnvConfig(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER?.trim() &&
      process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME?.trim()
  );
}

export function hasKeystaticGitHubBranchEnvConfig(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_BRANCH?.trim());
}

export function isKeystaticGitHubModeRequested(): boolean {
  return getKeystaticStorageKind() === "github";
}

export function isKeystaticGitHubStorageConfigured(): boolean {
  return (
    isKeystaticGitHubModeRequested() &&
    hasKeystaticGitHubRepoEnvConfig() &&
    hasKeystaticGitHubBranchEnvConfig()
  );
}
