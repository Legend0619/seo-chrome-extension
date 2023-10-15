import { useState, useEffect } from "react";

const Keyword = () => {
    const [keyword, setKeyword] = useState("");
    const [result, setResult] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [progress, setProgress] = useState(0);

    const checkState = () => {
        const interval = setInterval(() => {
            chrome.runtime.sendMessage({ action: "getState" }, state => {
                setProgress(state.progress);
                if (!state.tabId) {
                    // chrome.storage.local.set({
                    //     loading: false
                    // })
                    // .then(() => {
                        setDisabled(false);
                        setResult(state.result.join("\n"));
                        clearInterval(interval);
                        if (!state.result || !state.result.length) {
                            setResult("Can't fetch result from the server. Please try again.");
                        }
                    // });
                }
            })
        })
    }

    useEffect(() => {
        chrome.storage.local.get(["keyword"]).then(opt => {
            setKeyword(opt.keyword || "human");
        });

        // chrome.storage.local.get(["loading"]).then(opt => {
        //     setDisabled(opt.disabled || false);
        // });

        chrome.runtime.sendMessage({ action: "getState" }, state => {
            if (state.tabId) {
                setDisabled(true);
                checkState();
            }
        })
    }, []);

   

    const handleStart = () => {
        chrome.storage.local.set({
            keyword: keyword
        }).then(() => {
            setDisabled(true);
            setProgress(5);
            chrome.runtime.sendMessage({ action: "start", keyword: keyword });
            checkState();
        })
    }

    return (
        <div className="p-4">
            <div className="h-10 flex justify-between items-center border-b-2 pb-2">
                <p className="text-xl">Keyword Sniper</p>
            </div>
            <div className="grid grid-cols-3 gap-5 my-2">
                <div className="text-lg text-right">Keyword:</div>
                <div className="col-span-2">
                    <input type="text" placeholder="Title" className="input input-bordered input-sm w-80" value={keyword} onChange={e => setKeyword(e.target.value)} />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-5 mb-2">
                <div className="text-lg text-right">Result:</div>
                <div className="col-span-2">
                    {disabled ? (
                        <div className="w-80 h-8 border-2 rounded-md">
                            <div className="h-full bg-green-400 rounded-md p-1 text-sm text-white" style={{width: `${progress}%`}}>{`${progress}%`}</div>
                        </div>
                    ) : (
                        <textarea className="textarea textarea-bordered w-80 mb-1" rows={10} placeholder="">{result}</textarea>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-3 gap-5 mb-2">
                <div></div>
                <div className="col-span-2">
                    <button className={`btn btn-sm btn-success w-80 text-white ${disabled ? "btn-disabled" : ""}`} onClick={handleStart}>
                        {disabled && <span className="loading loading-spinner"></span>}
                        {disabled ? "Please wait..." : "Start"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Keyword;