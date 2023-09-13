export const getSubHeading = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    const tabId = tab.id;
    const headings = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            const hTags = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
            let tags = [];
            hTags.forEach((tag) => {
                tags.push([tag.tagName, String(tag.innerText).trim()]);
            });
            return tags;
        },
        args: [],
    });

    return headings[0].result;
};

export const setHighLight = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    const tabId = tab.id;
    await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            const HBCOLOR = [
                "#1D4ED8",
                "#A16207",
                "#BE185D",
                "#10803D",
                "#BEF264",
                "#6B86D4",
            ];

            const hTags = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
            hTags.forEach((tag) => {
                let borderColor = HBCOLOR[parseInt(tag.tagName[1]) - 1];

                tag.style.border = `2px solid ${borderColor}`;
                tag.style.position = "relative";
                let mark = document.createElement("span");
                mark.textContent = tag.tagName;
                mark.style.position = "absolute";
                mark.style.right = 0;
                mark.style.top = 0;
                mark.style.backgroundColor = borderColor;
                mark.style.color = "white";
                mark.style.fontWeight = "bold";
                mark.style.fontSize = "14px";
                mark.style.padding = "0 3px";
                tag.appendChild(mark);
            });
        },
        args: [],
    });
};
