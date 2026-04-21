import { describe, expect, it } from "vitest";
import {
  createTemplateContext,
  renderTemplate,
} from "./pr-formatter";
import type { ExtensionOptions } from "../shared/options";

const options: ExtensionOptions = {
  pullRequestTemplate:
    '<blockquote><a href="${repo.url}">${repo.title}</a><br />${issue.title}</blockquote>',
  repoTitleRemove: "fury_",
};

describe("createTemplateContext", () => {
  it("parses pull request URLs", () => {
    const context = createTemplateContext(
      {
        origin: "https://github.com",
        pathname: "/octo-org/fury_repo/pull/123/files",
      },
      "Add feature",
      options
    );

    expect(context).toEqual({
      issue: {
        title: "Add feature",
        number: "123",
        type: "pull",
        url: "https://github.com/octo-org/fury_repo/pull/123",
      },
      repo: {
        title: "repo",
        url: "https://github.com/octo-org/fury_repo",
      },
      org: {
        title: "octo-org",
        url: "https://github.com/octo-org",
      },
    });
  });

  it("parses issue URLs", () => {
    const context = createTemplateContext(
      {
        origin: "https://github.com",
        pathname: "/octo-org/fury_repo/issues/55",
      },
      "Bug report",
      options
    );

    expect(context?.issue.type).toBe("issues");
    expect(context?.issue.number).toBe("55");
  });

  it("rejects unsupported URLs", () => {
    const context = createTemplateContext(
      {
        origin: "https://github.com",
        pathname: "/octo-org/fury_repo/wiki",
      },
      "Wiki",
      options
    );

    expect(context).toBeNull();
  });
});

describe("renderTemplate", () => {
  it("escapes dynamic values for html output", () => {
    const context = createTemplateContext(
      {
        origin: "https://github.com",
        pathname: "/octo-org/fury_repo/pull/123",
      },
      'Fix <b>"quoted"</b> & broken',
      options
    );

    expect(context).not.toBeNull();
    expect(renderTemplate(options.pullRequestTemplate, context!, "html")).toBe(
      '<blockquote><a href="https://github.com/octo-org/fury_repo">repo</a><br />Fix &lt;b&gt;&quot;quoted&quot;&lt;/b&gt; &amp; broken</blockquote>'
    );
  });

  it("keeps raw values for text output", () => {
    const context = createTemplateContext(
      {
        origin: "https://github.com",
        pathname: "/octo-org/fury_repo/pull/123",
      },
      'Fix <b>"quoted"</b> & broken',
      options
    );

    expect(context).not.toBeNull();
    expect(renderTemplate("${issue.title}", context!, "text")).toBe(
      'Fix <b>"quoted"</b> & broken'
    );
  });
});
