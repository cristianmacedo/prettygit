interface Issue {
  title: string;
  number: string;
  type: string;
  url: string;
}

interface Repo {
  title: string;
  url: string;
}

interface Org {
  title: string;
  url: string;
}

interface Options {
  pullRequestTemplate: string;
  repoTitleRemove: string;
}

export function formatPR(
  headerTitle: HTMLTitleElement,
  options: Options
): string {
  const issue: Issue = {
    title: "",
    number: "",
    type: "",
    url: "",
  };

  const repo: Repo = {
    title: "",
    url: "",
  };

  const org: Org = {
    title: "",
    url: "",
  };

  const [_, orgTitle, repoTitle, issueType, issueNumber] =
    window.location.pathname.split("/");

  issue.title = headerTitle.innerText.trim();
  issue.number = issueNumber;
  issue.type = issueType;
  issue.url = `${window.location.origin}/${orgTitle}/${repoTitle}/${issueType}/${issueNumber}`;

  repo.title = repoTitle.replace(options.repoTitleRemove, "").trim();
  repo.url = `${window.location.origin}/${orgTitle}/${repoTitle}`;

  org.title = orgTitle;
  org.url = `${window.location.origin}/${orgTitle}`;

  return options.pullRequestTemplate
    .replace(/\${issue.title}/g, issue.title)
    .replace(/\${issue.number}/g, issue.number)
    .replace(/\${issue.type}/g, issue.type)
    .replace(/\${issue.url}/g, issue.url)
    .replace(/\${repo.title}/g, repo.title)
    .replace(/\${repo.url}/g, repo.url)
    .replace(/\${org.title}/g, org.title)
    .replace(/\${org.url}/g, org.url);
}
