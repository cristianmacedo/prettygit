const defaultOptions = {
  pullRequestTemplate: `<blockquote>Project: <a href="\${repo.url}">\${repo.title}</a><br />:github-pull-request-opened: <a href="\${issue.url}">\${issue.title}</a></blockquote>`,
};

window.onload = async () => {
  // In-page cache of the user's options
  const options = {};
  const optionsForm = document.getElementById("form");
  const optionsSave = document.getElementById("save");
  const optionsReset = document.getElementById("reset");

  // Immediately persist options changes
  optionsSave.addEventListener("click", async () => {
    options.pullRequestTemplate = optionsForm.pullRequestTemplate.value;
    chrome.storage.sync.set({ options });
  });

  // Reset options to their default values
  optionsReset.addEventListener("click", async () => {
    optionsForm.pullRequestTemplate.value = defaultOptions.pullRequestTemplate;
    options.pullRequestTemplate = defaultOptions.pullRequestTemplate;
    chrome.storage.sync.set({ options });
  });

  // Initialize the form with the user's option settings
  const data = await chrome.storage.sync.get("options");
  Object.assign(options, data.options);
  optionsForm.pullRequestTemplate.value = options.pullRequestTemplate;
};
