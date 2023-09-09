export const getTitle = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0].title;
};

export const getDescription = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    const tabId = tab.id;
    const result = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            const metaTag = document.querySelector('meta[name="description"]');
            return metaTag ? metaTag.getAttribute("content") : null;
        },
        args: [],
    });

    return result[0].result;
};

export const getUrl = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    return tab.url;
};

export const getCanonical = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    const tabId = tab.id;
    const result = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            const linkTag = document.querySelector('link[rel="canonical"]');
            return linkTag ? linkTag.getAttribute("href") : null;
        },
        args: [],
    });

    return [result[0].result, tab.url];
};

export const getIndexability = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    const url = tab.url;
    const status = await fetch(url);
    console.log(status);
};
