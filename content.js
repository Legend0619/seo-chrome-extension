chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.runtime.sendMessage({ type: "getTitle", tab: activeTab });
});
