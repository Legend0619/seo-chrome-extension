var searchEnginesToIgnore = [
    "www.google.com",
    "google.com",
    "www.bing.com",
    "bing.com",
    "yahoo.com",
    "search.yahoo.com",
];

var statusInfo = new Map();

chrome.webRequest.onHeadersReceived.addListener(
    function (details) {
        const statusCode = details.statusCode;
        const url = details.url;
        const redirect = false;
        const tabId = details.tabId;

        let newStatusInfo = statusInfo.get(tabId) || {
            canBeReset: false,
            statusData: [],
        };
        if (newStatusInfo.canBeReset) {
            newStatusInfo.statusData = [];
            newStatusInfo.canBeReset = false;
        }

        if (
            searchEnginesToIgnore.indexOf(new URL(details.url).hostname) === -1
        ) {
            newStatusInfo.statusData.push({ statusCode, url, redirect });
        }

        console.log("headerReceived", newStatusInfo);
        statusInfo.set(tabId, newStatusInfo);
    },
    { urls: ["http://*/*", "https://*/*"], types: ["main_frame"] },
    ["extraHeaders"]
);

chrome.webNavigation.onCompleted.addListener(function (details) {
    if (details.frameId !== 0) return;
    if (!details.url.match(/^http.*/)) return;
    if (details.url.match(/^https?:\/\/chrome\.google\.com\/webstore/)) return;

    const tabId = details.tabId;
    let newStatusInfo = statusInfo.get(tabId) || {
        canBeReset: false,
        statusData: [],
    };
    newStatusInfo.canBeReset = true;
    console.log("onCompleted", newStatusInfo);
    statusInfo.set(tabId, newStatusInfo);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "Get Status Info") {
        const data = statusInfo.get(request.tabId);
        const res = data && data.statusData;

        sendResponse(res ? res : []);
    }
});
