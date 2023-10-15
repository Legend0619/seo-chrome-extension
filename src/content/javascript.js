export const getContentSetting = async () => {
    const details = await chrome.contentSettings.javascript.get({
        primaryUrl: "http://*/*",
    });
    return details.setting;
};

export const setContentSetting = async (setting) => {
    await chrome.contentSettings.javascript.set({
        primaryPattern: "<all_urls>",
        setting: setting,
    });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.reload(tabs[0].id);
    });
};
