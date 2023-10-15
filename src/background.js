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

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "word_count",
        title: "Count Words",
        contexts: ["selection"],
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    const text = info.selectionText;
    chrome.tabs.sendMessage(tab.id, { message: "count_words", txt: text });
});

const searchUrl = "https://www.google.com/search?q=";
let state = {
    tabId: null,
    isActive: false,
    keyword: "",
    loading: true,
    result: [],
    progress: 0,
};

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (
        state.isActive &&
        state.loading &&
        tabId === state.tabId &&
        changeInfo.title
    ) {
        state.progress = 20;
    }
    if (
        state.isActive &&
        state.loading &&
        tabId === state.tabId &&
        changeInfo.status === "complete"
    ) {
        state.loading = false;
        state.progress = 30;
        injectScript();
        setTimeout(() => {
            if (state.progress <= 30 && state.tabId) {
                chrome.tabs.remove(state.tabId);
                state.tabId = null;
            }
        }, 20 * 1000);
    }
});

/**
 * Inject script into the Google Search page
 */
const injectScript = () => {
    chrome.scripting
        .executeScript({
            target: { tabId: state.tabId, allFrames: false },
            func: getSearchResults,
            args: [],
        })
        .catch((error) => {
            console.log(error);
            if (state.tabId) {
                chrome.tabs.remove(state.tabId);
                state.tabId = null;
            }
        })
        .then((injectionResults) => {
            if (
                injectionResults &&
                injectionResults[0] &&
                injectionResults[0].result
            ) {
                state.result = injectionResults[0].result;
                //console.log(state.result);
            } else {
                console.log("Empty result !!!");
            }
            if (state.tabId) {
                chrome.tabs.remove(state.tabId);
                state.tabId = null;
            }
        });
};

/**
 * Function to insert into Google page
 *
 * @returns {Promise<unknown>}
 */
const getSearchResults = () => {
    // hide Google page content
    let cover = document.createElement("div");
    cover.style.cssText =
        "position: fixed; width: 100%; left:0; top: 0; bottom: 0; background: white;z-index: 1000; padding-top: 200px; text-align: center;font-size: 40px";
    cover.innerText = "Loading...";
    document.body.appendChild(cover);

    return new Promise(async (resolve) => {
        const menuHeight = 70;
        let pagesToScroll = 10;
        let output = [];

        // Scroll pages
        const scrollPage = () => {
            const clientHeight = document.documentElement.clientHeight;

            if (
                0 < pagesToScroll-- &&
                document.documentElement.scrollTop + clientHeight - menuHeight <
                    document.documentElement.scrollHeight
            ) {
                document.documentElement.scrollBy(0, clientHeight - menuHeight);
                chrome.runtime.sendMessage({ action: "progress", inc: 5 });
                setTimeout(scrollPage, 300);
            } else {
                // Extract emphasized words from meta-descriptions
                document.querySelectorAll("#search em").forEach((el) => {
                    output.push(el.textContent.trim());
                });
                // Extract More to ask & People also ask
                document
                    .querySelectorAll('div[role="heading"] span')
                    .forEach((el) => {
                        if (
                            el.textContent == "More to ask" ||
                            el.textContent == "People also ask" ||
                            el.textContent == "Questions related to your search"
                        ) {
                            el.parentNode.parentNode.parentNode.parentNode
                                .querySelectorAll(
                                    'div[role="button"] span span'
                                )
                                .forEach((el2) => {
                                    output.push(el2.textContent.trim());
                                });
                        }
                    });
                // Extract People also search
                document.querySelectorAll("#bres a b").forEach((el) => {
                    output.push(el.parentNode.textContent.trim());
                });
                // Filter unique values
                output = output.filter((value, index, array) => {
                    return (
                        array.findIndex(
                            (item) => value.toLowerCase() === item.toLowerCase()
                        ) === index && value.length > 2
                    );
                });
                console.log(output);
                resolve(output);
            }
        };

        // Emulate typing to open suggestions dropdown list
        setTimeout(() => {
            const inputField = document.querySelector("textarea");
            if (inputField) {
                inputField.focus();
                inputField.selectionStart = inputField.value.length;
                setTimeout(() => {
                    let char = "*";
                    let event = new KeyboardEvent("keydown", {
                        key: char,
                        code: "Key" + char.toUpperCase(),
                        charCode: char.charCodeAt(0),
                        keyCode: char.charCodeAt(0),
                        which: char.charCodeAt(0),
                    });

                    inputField.dispatchEvent(event);
                    document.execCommand("insertText", false, char);

                    chrome.runtime.sendMessage({ action: "progress", inc: 5 });
                    setTimeout(() => {
                        // Extract words from dropdown list
                        document
                            .querySelectorAll(
                                'ul[role="listbox"] div[role="presentation"] span b'
                            )
                            .forEach((el) => {
                                output.push(el.textContent.trim());
                            });
                        setTimeout(scrollPage, 100);
                        chrome.runtime.sendMessage({
                            action: "progress",
                            inc: 5,
                        });
                    }, 1000);
                }, 100);
            } else {
                setTimeout(scrollPage, 100);
            }
        }, 100);
    });
};

// Communication with Popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    //console.log(request);
    if (request && request.action === "start") {
        state.isActive = true;
        state.loading = true;
        state.result = [];
        state.tabId = null;
        state.keyword = request.keyword;
        state.progress = 10;

        chrome.tabs
            .create({
                url: searchUrl + encodeURIComponent(state.keyword),
                active: false,
                pinned: true,
            })
            .then((tab) => {
                state.tabId = tab.id;
            });
    } else if (request && request.action === "getState") {
        sendResponse(state);
    } else if (
        request &&
        request.action === "progress" &&
        state.progress < 100
    ) {
        state.progress = state.progress + 5;
    }
});
