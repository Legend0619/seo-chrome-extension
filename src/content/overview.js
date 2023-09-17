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
    const tabId = tab.id;

    const statusCode = await fetch(url);

    const xRobotsTag = statusCode.headers.get("x-robots-tag");

    const pageSize = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            const size = (
                document.documentElement.innerHTML.length / 1024
            ).toFixed(2);
            return size;
        },
        args: [],
    });

    const robotsTag = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            const metaTag = document.querySelector('meta[name="robots"]');
            return metaTag ? metaTag.getAttribute("content") : "";
        },
        args: [],
    });

    const words = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            const htmlContent = document.body.innerText;
            const wordList = htmlContent.split(/\s+/).filter(Boolean);
            return wordList.length;
        },
        args: [],
    });

    const lang = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            const htmlLang = document.querySelector("html");
            const metaLang = document.querySelector(
                'meta[property="og:locale"]'
            );
            return htmlLang
                ? htmlLang.getAttribute("lang")
                : metaLang
                ? metaLang.getAttribute("content")
                : "";
        },
        args: [],
    });
    const author = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            const authorTag = document.querySelector('meta[name="author"]');
            return authorTag ? authorTag.getAttribute("content") : "";
        },
        args: [],
    });

    const publisher = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            const publisherTag = document.querySelector(
                'meta[name="publisher"]'
            );
            return publisherTag ? publisherTag.getAttribute("content") : "";
        },
        args: [],
    });

    return {
        status: statusCode.status,
        pageSize: pageSize[0].result,
        robots: robotsTag[0].result,
        xRobots: xRobotsTag ? xRobotsTag : "",
        wordCount: words[0].result,
        lang: lang[0].result,
        author: author[0].result,
        publisher: publisher[0].result,
    };
};

export const getHiddenCheck = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    const tabId = tab.id;
    let issues = [];
    const h1 = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            const h1Tags = document.querySelectorAll("h1");
            return h1Tags.length === 0 ? true : false;
        },
        args: [],
    });
    if (h1[0].result) issues.push("Missing H1");

    let redirected = true;
    if (tab.url.endsWith("/")) {
        const response = await fetch(tab.url.slice(0, tab.url.length - 1));
        if (response.redirected && response.url === tab.url) redirected = true;
        else redirected = false;
    } else {
        const response = await fetch(`${tab.url}/`);
        if (response.redirected && response.url === tab.url) redirected = true;
        else redirected = false;
    }
    if (!redirected) issues.push("Trailing Slash");

    const img = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            const imgTags = document.querySelectorAll("img");
            return imgTags.length === 0 ? true : false;
        },
        args: [],
    });
    if (img[0].result) issues.push("Missing images");

    const structure = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            const htmlText = document.documentElement.innerHTML;
            const h1Idx = htmlText.indexOf("<h1");
            const h2Idx = htmlText.indexOf("<h2");
            const h3Idx = htmlText.indexOf("<h3");
            const h4Idx = htmlText.indexOf("<h4");
            const h5Idx = htmlText.indexOf("<h5");
            const h6Idx = htmlText.indexOf("<h6");
            return (
                (h2Idx !== -1 && h2Idx < h1Idx) ||
                (h3Idx !== -1 && h3Idx < h1Idx) ||
                (h4Idx !== -1 && h4Idx < h1Idx) ||
                (h5Idx !== -1 && h5Idx < h1Idx) ||
                (h6Idx !== -1 && h6Idx < h1Idx)
            );
        },
        args: [],
    });
    if (structure[0].result) issues.push("Illogical heading");

    return issues;
};

export const getHeadings = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    const tabId = tab.id;
    const result = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            const h1 = document.querySelectorAll("h1");
            const h2 = document.querySelectorAll("h2");
            const h3 = document.querySelectorAll("h3");
            const h4 = document.querySelectorAll("h4");
            const h5 = document.querySelectorAll("h5");
            const h6 = document.querySelectorAll("h6");
            const anchor = document.querySelectorAll("a");
            const img = document.querySelectorAll("img");
            return [
                h1.length,
                h2.length,
                h3.length,
                h4.length,
                h5.length,
                h6.length,
                anchor.length,
                img.length,
            ];
        },
        args: [],
    });

    return result[0].result;
};

export const getRedirect = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    const tabId = tab.id;
    const res = await chrome.runtime.sendMessage({
        action: "Get Status Info",
        tabId: tabId,
    });

    console.log("123", res);

    return res;
};
