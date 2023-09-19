function getSchemaList() {
    let schema = [];

    const p = () => {
        const e = [
                ...document.querySelectorAll(
                    'script[type="application/ld+json"]'
                ),
            ].flatMap((e) => {
                const t = e.textContent.replace(/\n/g, "");
                try {
                    const e = JSON.parse(t);
                    // return [].concat(e);
                    return [].concat(e["@graph"] || e);
                } catch (i) {
                    return [{ "@type": "Parsing Error", __data: t }];
                }
            }),
            t = (e) => {
                const i = [...e.querySelectorAll("[itemprop]")]
                    .filter((t) => t.parentNode.closest("[itemscope]") === e)
                    .map((e) => ({
                        prop: e.getAttribute("itemprop"),
                        value: e.matches("[itemscope]")
                            ? t(e)
                            : ((e) => {
                                  switch (e.nodeName) {
                                      case "META":
                                          return e.getAttribute("content");
                                      case "AUDIO":
                                      case "EMBED":
                                      case "IFRAME":
                                      case "IMG":
                                      case "SOURCE":
                                      case "TRACK":
                                      case "VIDEO":
                                          return e.getAttribute("src");
                                      case "A":
                                      case "AREA":
                                      case "LINK":
                                          return e.getAttribute("href");
                                      case "OBJECT":
                                          return e.getAttribute("data");
                                      case "DATA":
                                      case "METER":
                                          return e.getAttribute("value");
                                      case "TIME":
                                          return e.getAttribute("datetime");
                                      default:
                                          return e.textContent;
                                  }
                              })(e),
                    }))
                    .reduce(
                        (e, { prop: t, value: i }) => (
                            e[t]
                                ? ((e[t] = [].concat(e[t])), e[t].push(i))
                                : (e[t] = i),
                            e
                        ),
                        {}
                    );
                return {
                    "@type": e.getAttribute("itemtype"),
                    "@id": e.getAttribute("itemid") || void 0,
                    ...i,
                };
            };
        return [
            ...e,
            ...[...document.querySelectorAll("[itemscope]")]
                .filter((e) => !e.matches("[itemscope] *"))
                .map((e) => t(e)),
        ];
    };

    const pData = p();
    for (const item of pData) {
        schema.push(JSON.stringify(item));
    }

    return schema;
}

export const getSchema = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    const tabId = tab.id;
    const schema = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
            const res = getSchemaList();
            return res;
        },
        args: [],
    });
    const data = schema[0].result;
    return data;
};
