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

async function processLinks(links) {
    const broken = [];

    await Promise.all(
        links.map(async (link) => {
            try {
                const response = await fetch(link.url);
                broken.push({
                    ...link,
                    status: response.status,
                });
            } catch (err) {
                broken.push({
                    ...link,
                    status: 503,
                });
            }
        })
    );

    return broken;
}

export const getLinks = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    const tabId = tab.id;

    const curUrl = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            return window.location.href;
        },
        args: [],
    });

    const urlName = curUrl[0].result;

    const links = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            const curDomain = window.location.hostname;
            const anchors = document.querySelectorAll("a");
            let links = [];
            anchors.forEach((anchor) => {
                let type = "Text";
                if (anchor.href.startsWith("mailto")) type = "Email";
                if (anchor.href.startsWith("tel")) type = "Telephone";
                if (anchor.querySelector("img") !== null) type = "Image";

                const linkElement = document.createElement("a");
                linkElement.href = anchor.href;

                if (anchor.href !== "")
                    links.push({
                        url: anchor.href,
                        txt: anchor.innerText,
                        isInternal: linkElement.hostname === curDomain,
                        type: type,
                    });
            });
            return links;
        },
        args: [],
    });

    const all = links[0].result;

    // let allLink = [];
    let allLink = await processLinks(all);
    // const savedData = await chrome.storage.sync.get([urlName]);
    // if (savedData[`${urlName}`]) allLink = JSON.parse(savedData[`${urlName}`]);
    // else allLink = await processLinks(all);

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

    // let saveData = {};
    // saveData[urlName] = JSON.stringify(allLink);
    // await chrome.storage.sync.set(saveData);

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
