const brokenStatus = [400, 401, 403, 404, 405, 410, 500, 502, 503];

function createFileCsvAndDownload(name, rows) {
    let csvContent =
        "data:text/csv;charset=utf-8," +
        rows.map((e) => e.join(",")).join("\n");

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", name);

    link.click();
}

const colorLink = async (url, status) => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    const tabId = tab.id;

    await chrome.scripting.executeScript({
        target: { tabId },
        func: (link, code) => {
            const anchors = document.querySelectorAll("a");
            anchors.forEach((anchor) => {
                if (anchor.href === link) {
                    anchor.style.color = "white";
                    if (code === 200) anchor.style.backgroundColor = "#8bc34a";
                    else anchor.style.backgroundColor = "#e97960";
                }
            });
            return idx;
        },
        args: [url, status],
    });
};

async function processLinks(links, setCount) {
    const broken = [];

    await Promise.all(
        links.map(async (link) => {
            let code = 200;
            try {
                if (link.type !== "Email" && link.type !== "Telephone") {
                    const response = await fetch(link.url);
                    broken.push({
                        ...link,
                        status: response.status,
                    });
                    code = response.status;
                } else {
                    broken.push({
                        ...link,
                        status: 200,
                    });
                }
            } catch (err) {
                broken.push({
                    ...link,
                    status: 503,
                });
                code = 503;
            }
            setCount((cnt) => cnt + 1);
            await colorLink(link.url, code);
        })
    );

    return broken;
}

export const getLinks = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    const tabId = tab.id;

    const links = await chrome.scripting.executeScript({
        target: { tabId },
        func: async () => {
            const curDomain = window.location.hostname;
            const anchors = document.querySelectorAll("a");
            let broken = [];
            anchors.forEach((anchor) => {
                let type = "Text";
                if (anchor.href.startsWith("mailto")) type = "Email";
                if (anchor.href.startsWith("tel")) type = "Telephone";
                if (anchor.querySelector("img") !== null) type = "Image";
                if (anchor.href.startsWith("http")) {
                    broken.push({
                        url: anchor.href,
                        txt: anchor.innerText,
                        isInternal: anchor.hostname === curDomain,
                        type: type,
                    });
                }
            });
            return broken;
        },
        args: [],
    });

    const allLink = links[0].result;
    return allLink;
};

export const makeData = async (links, setCount) => {
    const allLink = await processLinks(links, setCount);

    let internal = [];
    let external = [];
    let broken = [];
    const unique = new Map();

    allLink.forEach((link) => {
        unique.set(link.url, link.txt);

        if (brokenStatus.includes(link.status)) broken.push(link);

        if (link.isInternal) internal.push(link);
        else external.push(link);
    });

    return { allLink, unique, internal, external, broken };
};

export const exportLink = async (type, links) => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    const tabId = tab.id;

    const hostName = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            const anchor = document.createElement("a");
            anchor.href = window.location.href;
            return anchor.hostname;
        },
        args: [],
    });

    const name = `${type}_${hostName[0].result}.csv`;
    const rows = [["Type", "URL", "Anchor", "Status"]];

    for (const all_link of links) {
        rows.push([
            all_link.isInternal ? "Internal Link" : "External Link",
            all_link.url.replace(/#/g, "%23"),
            '"' + all_link.txt + '"',
            '"' + all_link.status + '"',
        ]);
    }

    createFileCsvAndDownload(name, rows);
};

export const highLightNoFollow = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    const tabId = tab.id;

    await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            anchors = document.querySelectorAll('a[rel~="nofollow"]');
            if (anchors.length > 0) {
                for (const anchor of anchors) {
                    anchor.style.backgroundColor = "pink";
                    anchor.style.color = "white";
                }
            } else {
                alert("Nofollow Links were not found.");
            }
        },
        args: [],
    });
};
