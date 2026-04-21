import {
  DEFAULT_OPTIONS,
  STORAGE_KEY,
  type ExtensionOptions,
} from "./shared/options";

function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`Missing required element #${id}`);
  }

  return element as T;
}

async function loadOptions(): Promise<ExtensionOptions> {
  const result = await chrome.storage.sync.get({
    [STORAGE_KEY]: DEFAULT_OPTIONS,
  });

  return {
    ...DEFAULT_OPTIONS,
    ...(result[STORAGE_KEY] as ExtensionOptions),
  };
}

async function saveOptions(options: ExtensionOptions, status: HTMLElement) {
  await chrome.storage.sync.set({ [STORAGE_KEY]: options });
  status.textContent = "Saved";
}

function clearStatus(status: HTMLElement) {
  window.setTimeout(() => {
    if (status.textContent === "Saved") {
      status.textContent = "";
    }
  }, 1800);
}

window.addEventListener("DOMContentLoaded", async () => {
  const form = getElement<HTMLFormElement>("options-form");
  const templateInput = getElement<HTMLTextAreaElement>("pullRequestTemplate");
  const repoPrefixInput = getElement<HTMLInputElement>("repoTitleRemove");
  const resetButton = getElement<HTMLButtonElement>("reset");
  const status = getElement<HTMLElement>("status");

  const loadedOptions = await loadOptions();
  templateInput.value = loadedOptions.pullRequestTemplate;
  repoPrefixInput.value = loadedOptions.repoTitleRemove;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    await saveOptions(
      {
        pullRequestTemplate: templateInput.value.trim(),
        repoTitleRemove: repoPrefixInput.value.trim(),
      },
      status
    );
    clearStatus(status);
  });

  resetButton.addEventListener("click", async () => {
    templateInput.value = DEFAULT_OPTIONS.pullRequestTemplate;
    repoPrefixInput.value = DEFAULT_OPTIONS.repoTitleRemove;
    await saveOptions(DEFAULT_OPTIONS, status);
    clearStatus(status);
  });
});
