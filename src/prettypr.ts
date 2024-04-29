const buttonHtml = `<button id="prettifyPr" type="button" class="flex-md-order-2 Button--secondary Button--small Button m-0 mr-md-0"><span class="Button-content"><span class="Button-label">Copy pretty PR to clipboard</span></span></button>`;

const headerActions = document.querySelector(".gh-header-actions");
headerActions.innerHTML += buttonHtml;

function prettifyPr(e) {
  const [_, orgName, repoName, issueType, issueNumber] =
    window.location.pathname.split("/");
  const repoNameWithoutFury = repoName.replace("fury_", "");
  const repoUrl = `${window.location.origin}/${orgName}/${repoName}`;
  const issueUrl = `${window.location.origin}/${orgName}/${repoName}/${issueType}/${issueNumber}`;
  const issueTitle = document.querySelector(".gh-header-title").innerText;

  const markdownString = `<blockquote>Project: <a href="${repoUrl}">${repoNameWithoutFury}</a><br />:github-pull-request-opened: <a href="${issueUrl}">${issueTitle}</a></blockquote>`;
  // navigator.clipboard.writeText(markdownString)

  e.clipboardData.setData("text/html", markdownString);
  e.clipboardData.setData("text/plain", markdownString);
  e.preventDefault();
}

document.addEventListener("copy", prettifyPr);

document
  .getElementById("prettifyPr")
  .addEventListener("click", (e) => document.execCommand("copy"));
