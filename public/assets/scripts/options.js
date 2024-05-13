const defaultOptions = {
  pullRequestTemplate: `<blockquote>Project: <a href="\${repo.url}">\${repo.title}</a><br />:github-pull-request-opened: <a href="\${issue.url}">\${issue.title}</a></blockquote>`,
  repoTitleRemove: "fury_",
};

window.onload = async () => {
  const options = {};
  const optionsForm = document.getElementById("form");
  const optionsSave = document.getElementById("save");
  const optionsReset = document.getElementById("reset");

  optionsSave.addEventListener("click", async () => {
    options.pullRequestTemplate = optionsForm.pullRequestTemplate.value;
    options.repoTitleRemove = optionsForm.repoTitleRemove.value;
    chrome.storage.sync.set({ options });
  });

  optionsReset.addEventListener("click", async () => {
    optionsForm.pullRequestTemplate.value = defaultOptions.pullRequestTemplate;
    options.pullRequestTemplate = defaultOptions.pullRequestTemplate;

    optionsForm.repoTitleRemove.value = defaultOptions.repoTitleRemove;
    options.repoTitleRemove = defaultOptions.repoTitleRemove;

    chrome.storage.sync.set({ options });
  });

  const data = await chrome.storage.sync.get(defaultOptions);

  Object.assign(options, data);
  optionsForm.pullRequestTemplate.value = options.pullRequestTemplate;
  optionsForm.repoTitleRemove.value = options.repoTitleRemove;

  return chrome.storage.sync.set({ options });
};
