import {
  LOG_TAG,
  DEFAULT_OPTIONS,
  COPY_SVG,
  EXPAND_COLLAPSE_SVG,
} from "./constants";
import { STORAGE_KEY } from "./shared/options";
import { showToast } from "./utils/toast";
import { createTemplateContext, renderTemplate } from "./utils/pr-formatter";
import { htmlToPlainText } from "./utils/plain-text";

const options = { ...DEFAULT_OPTIONS };

const toolbarStyles = document.createElement("style");
toolbarStyles.textContent = `
  #prettygit-toolbar {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 9999;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease-in-out;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    display: flex;
    gap: 4px;
    padding: 6px;
  }
  
  @media (prefers-color-scheme: dark) {
    #prettygit-toolbar {
      background: rgba(22, 27, 34, 0.95);
      border-color: rgba(255, 255, 255, 0.1);
      color: #f0f6fc;
    }
  }
  
  #prettygit-toolbar:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
  
  #prettygit-toolbar .toolbar-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background: transparent;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    color: #24292f;
    transition: all 0.2s ease;
    text-decoration: none;
    width: 36px;
    height: 36px;
    position: relative;
  }
  
  @media (prefers-color-scheme: dark) {
    #prettygit-toolbar .toolbar-button {
      color: #f0f6fc;
    }
  }
  
  #prettygit-toolbar .toolbar-button:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  
  @media (prefers-color-scheme: dark) {
    #prettygit-toolbar .toolbar-button:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }
  
  #prettygit-toolbar .toolbar-button:active {
    transform: scale(0.98);
  }
  
  #prettygit-toolbar .toolbar-button:disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.4;
  }
  
  #prettygit-toolbar .toolbar-button:disabled:hover {
    background: transparent;
    transform: none;
  }
  
  #prettygit-toolbar .toolbar-button:disabled .button-icon {
    opacity: 0.3;
  }
  
  #prettygit-toolbar .button-icon {
    width: 16px;
    height: auto;
    opacity: 0.7;
  }
  
  #prettygit-toolbar .toolbar-button:hover .button-icon {
    opacity: 1;
  }
  
  /* Tooltip styles */
  #prettygit-toolbar .toolbar-button[title] {
    position: relative;
  }
  
  #prettygit-toolbar .toolbar-button[title]:hover::after {
    content: attr(title);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 10000;
    margin-bottom: 6px;
    pointer-events: none;
  }
  
  #prettygit-toolbar .toolbar-button[title]:hover::before {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
    z-index: 10000;
    margin-bottom: 2px;
    pointer-events: none;
  }
  
  @media (prefers-color-scheme: dark) {
    #prettygit-toolbar .toolbar-button[title]:hover::after {
      background: rgba(255, 255, 255, 0.9);
      color: #000;
    }
    
    #prettygit-toolbar .toolbar-button[title]:hover::before {
      border-top-color: rgba(255, 255, 255, 0.9);
    }
  }
  
  /* Branding positioned below toolbar */
  #prettygit-branding {
    position: absolute;
    bottom: -13px;
    right: 20px;
    font-size: 7px;
    color: rgba(0, 0, 0, 0.3);
    letter-spacing: 0.3px;
    opacity: 0.6;
  }
  
  @media (prefers-color-scheme: dark) {
    #prettygit-branding {
      color: rgba(255, 255, 255, 0.25);
    }
  }
`;
document.head.appendChild(toolbarStyles);

const toolbarHtml = `
  <div id="prettygit-toolbar">
    <button id="prettifyPr" type="button" class="toolbar-button" title="Copy Pretty PR" aria-label="Copy Pretty PR">
      <span class="button-icon">
        ${COPY_SVG}
      </span>
    </button>
    <button id="collapseExpandFiles" type="button" class="toolbar-button" title="Collapse/Expand Files" aria-label="Collapse/Expand Files">
      <span class="button-icon">
        ${EXPAND_COLLAPSE_SVG}
      </span>
    </button>
    <a id="prettygit-branding" href="https://github.com/cristianmacedo/prettygit" target="_blank">by prettygit</a>
  </div>`;

chrome.storage.sync.get(
  {
    [STORAGE_KEY]: {
      pullRequestTemplate: options.pullRequestTemplate,
      repoTitleRemove: options.repoTitleRemove,
    },
  },
  async (data) => {
    if (data[STORAGE_KEY]) {
      options.pullRequestTemplate = data[STORAGE_KEY].pullRequestTemplate;
      options.repoTitleRemove = data[STORAGE_KEY].repoTitleRemove;
    }
  }
);

function isOnFilesPage(): boolean {
  return window.location.pathname.includes("/files");
}

function getIssueKind(): "PR" | "Issue" {
  return window.location.pathname.includes("/issues/") ? "Issue" : "PR";
}

function updateToolbarState() {
  const prettifyButton = document.getElementById(
    "prettifyPr"
  ) as HTMLButtonElement | null;
  const collapseExpandButton = document.getElementById(
    "collapseExpandFiles"
  ) as HTMLButtonElement;
  const issueKind = getIssueKind();

  if (prettifyButton) {
    prettifyButton.title = `Copy Pretty ${issueKind}`;
    prettifyButton.setAttribute("aria-label", `Copy Pretty ${issueKind}`);
  }

  if (!collapseExpandButton) return;

  const onFilesPage = isOnFilesPage();
  collapseExpandButton.disabled = !onFilesPage;

  if (onFilesPage) {
    collapseExpandButton.title = "Toggle all files";
  } else {
    collapseExpandButton.title = "Toggle all files (Files tab)";
  }
}

function getTitleElement(): HTMLElement | null {
  const selectors = [
    ".gh-header-title .js-issue-title",
    ".gh-header-title",
    "[data-component='PH_Title']",
    "[class*='PageHeader-Title']",
    "bdi.js-issue-title",
  ];

  for (const selector of selectors) {
    const element = document.querySelector<HTMLElement>(selector);
    if (element?.innerText.trim()) {
      return element;
    }
  }

  return null;
}

function buildFormattedContent() {
  const headerTitle = getTitleElement();

  if (!headerTitle) {
    throw new Error("Could not find PR title.");
  }

  if (!options.pullRequestTemplate) {
    throw new Error("Pull request template is not set.");
  }

  const context = createTemplateContext(
    window.location,
    headerTitle.innerText,
    options
  );

  if (!context) {
    throw new Error("Unsupported page URL.");
  }

  const html = renderTemplate(options.pullRequestTemplate, context, "html");
  const text = htmlToPlainText(html);

  return { html, text };
}

function fallbackCopyToClipboard(html: string, text: string) {
  const handleCopy = (event: ClipboardEvent) => {
    event.clipboardData?.setData("text/html", html);
    event.clipboardData?.setData("text/plain", text);
    event.preventDefault();
  };

  document.addEventListener("copy", handleCopy, { once: true });
  document.execCommand("copy");
}

async function copyFormattedContent() {
  const { html, text } = buildFormattedContent();

  if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
    const clipboardItem = new ClipboardItem({
      "text/html": new Blob([html], { type: "text/html" }),
      "text/plain": new Blob([text], { type: "text/plain" }),
    });

    await navigator.clipboard.write([clipboardItem]);
    return;
  }

  fallbackCopyToClipboard(html, text);
}

function createFloatingToolbar() {
  const existingToolbar = document.getElementById("prettygit-toolbar");
  if (existingToolbar) {
    existingToolbar.remove();
  }

  const toolbarContainer = document.createElement("div");
  toolbarContainer.innerHTML = toolbarHtml;

  document.body.appendChild(toolbarContainer);

  updateToolbarState();
}

function addEventListeners() {
  const prettifyPrButton = document.getElementById("prettifyPr");

  if (!prettifyPrButton) {
    console.error(`${LOG_TAG} Could not find #prettifyPr button.`);
    return;
  }

  prettifyPrButton.addEventListener("click", () => {
    void copyFormattedContent()
      .then(() => {
        showToast("success", `Copied Pretty ${getIssueKind()} to clipboard!`);
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error ? error.message : "Copy failed unexpectedly.";
        console.error(`${LOG_TAG} ${message}`, error);
        showToast("error", message);
      });
  });

  const collapseExpandFilesButton = document.getElementById(
    "collapseExpandFiles"
  );

  if (!collapseExpandFilesButton) {
    console.error(`${LOG_TAG} Could not find #collapseExpandFiles button.`);
    return;
  }

  collapseExpandFilesButton.addEventListener("click", () => {
    const selectors = [
      "button[aria-label='Toggle diff contents'][aria-expanded]",
      "[class*=Diff-module__diffHeader] button[aria-expanded]",
      ".file button[aria-expanded]",
      ".btn-octicon.js-details-target",
    ];

    let buttons: Element[] = [];

    for (const selector of selectors) {
      const found = Array.from(document.querySelectorAll(selector));
      if (found.length > 0) {
        buttons = found;
        break;
      }
    }

    if (buttons.length === 0) {
      showToast("warning", "No file toggles found on this page.");
      return;
    }

    const isExpanded = (button: Element) => {
      const ariaExpanded = button.getAttribute("aria-expanded");
      if (ariaExpanded === "true") return true;
      if (ariaExpanded === "false") return false;
      return !!button.querySelector(".octicon-chevron-down");
    };

    const shouldCollapse = buttons.some((button) => isExpanded(button));

    buttons.forEach((button: Element) => {
      const expanded = isExpanded(button);

      if (shouldCollapse && expanded) {
        (button as HTMLButtonElement).click();
      } else if (!shouldCollapse && !expanded) {
        (button as HTMLButtonElement).click();
      }
    });

    const action = shouldCollapse ? "collapsed" : "expanded";
    showToast("success", `All files ${action}!`);
  });
}

const setup = () => {
  createFloatingToolbar();
  addEventListeners();
  updateToolbarState();
};

setup();

let lastUrl = location.href;
const handleNavigation = () => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setup();
  }
};

document.addEventListener("pjax:end", handleNavigation);
document.addEventListener("turbo:render", handleNavigation);
window.addEventListener("popstate", handleNavigation);

const observer = new MutationObserver(() => {
  handleNavigation();
  if (!document.getElementById("prettygit-toolbar")) {
    setup();
  }
});

observer.observe(document.documentElement, { subtree: true, childList: true });
