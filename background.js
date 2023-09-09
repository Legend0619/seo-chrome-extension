chrome.action.onClicked.addListener(async (tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: (tab) => {
            const title = document.title;
            console.log(title);
        },
    });
});
