import { LOG_TAG, DEFAULT_OPTIONS, COPY_SVG } from "./constants";
import { showToast } from "./utils/toast";
import { formatPR } from "./utils/pr-formatter";

const options = { ...DEFAULT_OPTIONS };

const buttonHtml = `
  <button id="prettifyPr" type="button" class="flex-md-order-2 Button--secondary Button--small Button m-0 mr-md-0">
    <span class="Button-content">
      <span class="Button-visual Button-leadingVisual">
        ${COPY_SVG}
      </span>
      <span class="Button-label">Copy Pretty PR</span>
    </span>
  </button>`;

// Load saved options
chrome.storage.sync.get(
  {
    options: {
      pullRequestTemplate: options.pullRequestTemplate,
      repoTitleRemove: options.repoTitleRemove,
    },
  },
  async (data) => {
    if (data.options) {
      options.pullRequestTemplate = data.options.pullRequestTemplate;
      options.repoTitleRemove = data.options.repoTitleRemove;
    }
  }
);

function prettifyPr(e: ClipboardEvent) {
  const headerTitle: HTMLTitleElement | null =
    document.querySelector(".gh-header-title") ||
    document.querySelector("[class*=PageHeader-Title]");

  if (!headerTitle) {
    console.error(`${LOG_TAG} Could not find PR title.`);
    return;
  }

  if (!options.pullRequestTemplate) {
    console.error(`${LOG_TAG} Pull request template is not set.`);
    return;
  }

  const markdownString = formatPR(headerTitle, options);

  e.clipboardData?.setData("text/html", markdownString);
  e.clipboardData?.setData("text/plain", markdownString);
  e.preventDefault();

  showToast("success", "Copied Pretty PR to clipboard!");
}

function createButton() {
  const headerActions =
    document.querySelector(".gh-header-actions") ||
    document.querySelector("[class*=PageHeader-Actions]");

  if (!headerActions) {
    console.error(`${LOG_TAG} Could not find header actions.`);
    return;
  }

  const buttonContainer = document.createElement("div");
  buttonContainer.innerHTML = buttonHtml;

  headerActions.appendChild(buttonContainer);
}

function addEventListeners() {
  const prettifyPrButton = document.getElementById("prettifyPr");

  if (!prettifyPrButton) {
    console.error(`${LOG_TAG} Could not find #prettifyPr button.`);
    return;
  }

  prettifyPrButton.addEventListener("click", () => {
    document.addEventListener("copy", prettifyPr);
    document.execCommand("copy");
    document.removeEventListener("copy", prettifyPr);
  });
}

const setup = () => {
  createButton();
  addEventListeners();
};

setup();

let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log("URL changed!", url);
    setup();
  }
}).observe(document, { subtree: true, childList: true });
