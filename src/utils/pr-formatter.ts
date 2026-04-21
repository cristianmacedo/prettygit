import type { ExtensionOptions } from "../shared/options";

export interface Issue {
  title: string;
  number: string;
  type: string;
  url: string;
}

export interface Repo {
  title: string;
  url: string;
}

export interface Org {
  title: string;
  url: string;
}

export interface TemplateContext {
  issue: Issue;
  repo: Repo;
  org: Org;
}

type PlaceholderValueMap = {
  issue: Issue;
  repo: Repo;
  org: Org;
};

interface LocationLike {
  origin: string;
  pathname: string;
}

const PLACEHOLDER_PATTERN = /\${(issue|repo|org)\.(title|number|type|url)}/g;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function createTemplateContext(
  location: LocationLike,
  title: string,
  options: ExtensionOptions
): TemplateContext | null {
  const match = location.pathname.match(
    /^\/([^/]+)\/([^/]+)\/(pull|issues)\/([^/]+)(?:\/.*)?$/
  );

  if (!match) {
    return null;
  }

  const [, orgTitle, repoTitle, issueType, issueNumber] = match;

  return {
    issue: {
      title: title.trim(),
      number: issueNumber,
      type: issueType,
      url: `${location.origin}/${orgTitle}/${repoTitle}/${issueType}/${issueNumber}`,
    },
    repo: {
      title: repoTitle.replace(options.repoTitleRemove, "").trim(),
      url: `${location.origin}/${orgTitle}/${repoTitle}`,
    },
    org: {
      title: orgTitle,
      url: `${location.origin}/${orgTitle}`,
    },
  };
}

export function renderTemplate(
  template: string,
  context: TemplateContext,
  mode: "html" | "text" = "html"
): string {
  return template.replace(
    PLACEHOLDER_PATTERN,
    (_match, scope: keyof PlaceholderValueMap, key: string) => {
      const scopedValues = context[scope] as unknown as Record<string, string>;
      const value = scopedValues[key];

      if (typeof value !== "string") {
        return "";
      }

      return mode === "html" ? escapeHtml(value) : value;
    }
  );
}
