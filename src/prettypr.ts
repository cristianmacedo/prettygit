debugger;

const copySvg = `
<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy">
    <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
</svg>`;

const buttonHtml = `
  <button id="prettifyPr" type="button" class="flex-md-order-2 Button--secondary Button--small Button m-0 mr-md-0">
    <span class="Button-content">
      <span class="Button-visual Button-leadingVisual">
        ${copySvg}
      </span>
      <span class="Button-label">Copy Pretty PR</span>
    </span>
  </button>`;

const logTag = "[PrettyGit][PrettifyPR]";

function showToast(type: "warning" | "error" | "success", content: string) {
  const toast = document.querySelector(`.Toast--${type}`);

  if (!toast) {
    console.error(`${logTag} Could not find .Toast--${type}.`);
    return;
  }

  const toastContent = toast.querySelector(".Toast-content");

  if (!toastContent) {
    console.error(`${logTag} Could not find .Toast-content.`);
    return;
  }

  toastContent.textContent = content;
  toast.removeAttribute("hidden");

  setTimeout(() => {
    toast.classList.remove("anim-fade-in");
    toast.classList.add("anim-fade-out");
  }, 2000);

  setTimeout(() => {
    toast.setAttribute("hidden", "");
    toast.classList.remove("anim-fade-out");
    toast.classList.add("anim-fade-in");
  }, 3000);
}

function prettifyPr(e: ClipboardEvent) {
  const headerTitle: HTMLTitleElement | null =
    document.querySelector(".gh-header-title");

  if (!headerTitle) {
    console.error(`${logTag} Could not find .gh-header-title.`);
    return;
  }

  const issueTitle = headerTitle.innerText.trim();

  const [_, orgName, repoName, issueType, issueNumber] =
    window.location.pathname.split("/");

  const repoNameWithoutFury = repoName.replace("fury_", "");
  const issueUrl = `${window.location.origin}/${orgName}/${repoName}/${issueType}/${issueNumber}`;
  const repoUrl = `${window.location.origin}/${orgName}/${repoName}`;

  const markdownString = `<blockquote>Project: <a href="${repoUrl}">${repoNameWithoutFury}</a><br />:github-pull-request-opened: <a href="${issueUrl}">${issueTitle}</a></blockquote>`;

  e.clipboardData?.setData("text/html", markdownString);
  e.clipboardData?.setData("text/plain", markdownString);
  e.preventDefault();

  showToast("success", "Copied Pretty PR to clipboard!");
}

function createButton() {
  const headerActions = document.querySelector(".gh-header-actions");

  if (!headerActions) {
    console.error(`${logTag} Could not find .gh-header-actions.`);
    return;
  }

  const buttonContainer = document.createElement("div");
  buttonContainer.innerHTML = buttonHtml;

  headerActions.appendChild(buttonContainer);
}

function addEventListeners() {
  document.addEventListener("copy", prettifyPr);

  const prettifyPrButton = document.getElementById("prettifyPr");

  if (!prettifyPrButton) {
    console.error(`${logTag} Could not find #prettifyPr button.`);
    return;
  }

  prettifyPrButton.addEventListener("click", () => {
    document.execCommand("copy");
  });
}

createButton();
addEventListeners();
