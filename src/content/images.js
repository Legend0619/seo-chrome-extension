async function processImages(imgList) {
    const modern = [];
    const large = [];

    await Promise.all(
        imgList.map(async (img) => {
            const response = await fetch(img);
            const format = response.headers.get("Content-Type").split("/")[1];
            const fileSize = (await response.blob()).size / 1024;

            if (format !== "webp") {
                modern.push(img);
            }
            if (fileSize > 100) {
                large.push(img);
            }
        })
    );

    return { modern, large };
}

export const getImages = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    const tabId = tab.id;
    const images = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            const imgs = document.querySelectorAll("img");
            let noAltList = [];
            let imgList = [];
            imgs.forEach((img) => {
                imgList.push(img.src);
                const txt = img.alt || "";
                if (txt == "") noAltList.push(img.src);
            });

            return { imgList, noAltList };
        },
        args: [],
    });
    const { imgList, noAltList } = images[0].result;
    const { modern, large } = await processImages(imgList);

    console.log(imgList, noAltList, large, modern);

    return { imgList, noAltList, large, modern };
};
