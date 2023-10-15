chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == "count_words") {
        const text = request.txt;
        if (text.length === 0) {
            alert("No text selected");
            return;
        }

        const words = text.split(/\s+/);
        const wordCount = words.length;
        const charCount = text.length;

        let totalLength = 0;
        let maxLength = 0;
        for (let i = 0; i < wordCount; i++) {
            const curLength = words[i].replace(
                /[.,?!()<>{}\[\]/\\+=~"`|:;]/g,
                ""
            ).length;
            totalLength += curLength;
            if (curLength > maxLength) {
                maxLength = curLength;
            }
        }
        const avgLength = wordCount == 0 ? 0 : totalLength / wordCount;

        alert(`Word Count: ${wordCount}
Character Count: ${charCount}
Average Word Length: ${avgLength.toFixed(2)}
Longest Word Length: ${maxLength}`);
    }
});
