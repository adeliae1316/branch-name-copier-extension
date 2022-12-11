/**
 * Context menu.
 * 
 */
const menuItem = chrome.contextMenus.create(
  {
    id: chrome.runtime.id,
    title: "Copy branch name"
  }, () => {
    chrome.tabs.query({ active: true, currentWindow: true })
      .then(tab => {
        chrome.contextMenus.update(
          menuItem, { visible: String(tab.url).includes('github') }
        )
      });
    const lastError = chrome.runtime.lastError;
    if (lastError) {
      console.error(`Runtime error occured: ${lastError.message}`);
      chrome.runtime.lastError = null;
    }
  }
);

/**
 * Update context manu visibility.
 * 
 */
const updateVisibility = async (tabId) => {
  const tab = await chrome.tabs.get(tabId);
  await chrome.contextMenus.update(
    menuItem, { visible: String(tab.url).includes('github') }
  );
};

/**
 * EventListener of tabs.onActivated.
 * 
 */
chrome.tabs.onActivated.addListener((activeInfo) => {
  updateVisibility(activeInfo.tabId);
});

/**
 * EventListener of tabs.onUpdated.
 * 
 */
chrome.tabs.onUpdated.addListener((tabId) => {
  updateVisibility(tabId);
});

/**
 * Set current branch name to clipboard.
 * 
 */
const setCurrentBranchName2Clipboard = () => {
  let isCopied = false;

  if (!isCopied) {
    const first = document.querySelector("a.SelectMenu-item[aria-checked='true']");
    if (first &&
      first.querySelector('span') &&
      first.querySelector('span').textContent) {
      navigator.clipboard.writeText(first.querySelector('span').textContent);
      isCopied = true;
    }
  }

  if (!isCopied) {
    const first = document.querySelector("#branch-select-menu.js-branch-select-menu");
    if (first &&
      first.querySelector('summary') &&
      first.querySelector('summary').title != 'Switch branches or tags') {
      navigator.clipboard.writeText(first.querySelector('summary').title);
      isCopied = true;
    }
  }

  if (!isCopied) {
    const first = document.querySelector("#branch-select-menu.js-branch-select-menu");
    if (first &&
      first.querySelector('span') &&
      first.querySelector('span').textContent) {
      navigator.clipboard.writeText(first.querySelector('span').textContent);
      isCopied = true;
    }
  }

  if (!isCopied) {
    console.error('Failed to copy current branch name.');
  }
};

/**
 * EventListener of contextMenus.onClicked.
 * 
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: setCurrentBranchName2Clipboard
  });
});
