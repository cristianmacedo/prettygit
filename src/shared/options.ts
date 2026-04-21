export interface ExtensionOptions {
  pullRequestTemplate: string;
  repoTitleRemove: string;
}

export const STORAGE_KEY = "options";

export const DEFAULT_OPTIONS: ExtensionOptions = {
  pullRequestTemplate:
    '<blockquote>Project: <a href="${repo.url}">${repo.title}</a><br />:github-pull-request-opened: <a href="${issue.url}">${issue.title}</a></blockquote>',
  repoTitleRemove: "fury_",
};
