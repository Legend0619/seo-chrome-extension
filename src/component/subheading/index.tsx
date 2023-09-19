import { useState, useEffect } from "react";
import { getSubHeading, setHighLight } from "../../content/subheading";
import { getHeadings } from "../../content/overview";
import { HCOLOR } from "../../utils/consts";

const Subheading = () => {
    const [data, setData] = useState<string[][]>([]);
    const [headings, setHeadings] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);
    const [disable, setDisable] = useState(false);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getSubHeading();
            const data: string[][] = Array.from(res);
            setData(data);

            const heads = await getHeadings();
            setHeadings(heads);
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleHightLight = async () => {
        await setHighLight();
        setDisable(true)
    }

    const handleCopyToClipboard = () => {
        setCopied(true);
        let copyText = '';
        data.forEach(tag => {
            copyText += `${tag[1]} ${tag[0]}\n`;
        });
        navigator.clipboard.writeText(copyText);
        setTimeout(() => {
            setCopied(false);
        }, 5000);
    }

    return (
        <div className="p-4">
            <div className="h-10 flex justify-between items-center border-b-2 pb-2">
                <p className="text-xl">Subheadings</p>
                <div>
                    <button className={`btn btn-sm mr-2`} onClick={() => handleCopyToClipboard()}>{copied ? "Copied" : "Copy to Clipboard"}</button>
                    <button className={`btn btn-warning btn-sm ${disable ? 'btn-disabled' : ''}`} onClick={() => handleHightLight()}>highlight Subheadings</button>
                </div>
            </div>
            {
                loading ? 
                <div className="flex justify-center items-center h-60">
                    <span className="loading loading-dots loading-lg m-auto"></span>
                </div>
                :
                <>
                    <div className="mt-4">
                        <div className='grid grid-cols-6 gap-2 mb-3'>
                            <div className="text-center">
                                <p className="font-bold">H1</p>
                                <p><span className={headings[0] !== 1 ? "text-red-400" : ""}>{headings[0]}</span></p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold">H2</p>
                                <p>{headings[1]}</p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold">H3</p>
                                <p>{headings[2]}</p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold">H4</p>
                                <p>{headings[3]}</p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold">H5</p>
                                <p>{headings[4]}</p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold">H6</p>
                                <p>{headings[5]}</p>
                            </div>
                        </div>
                    </div>
                    <div className="font-bold">
                        {headings[0] === 0 && <div>
                            <span className="rounded-xl bg-red-500 text-white text-sm px-2">Missing H1 Tag</span>
                        </div>}
                        {
                            data.map((ele, index) => {
                                const firstH1 = data.findIndex(tag => tag[0] === 'H1');

                                switch (ele[0]) {
                                    case 'H1':
                                        return (
                                            <div key={index} className="flex items-center my-3">
                                                <span className={`rounded-xl ${(firstH1 !== -1 && firstH1 < index) ? "bg-red-500" : `${HCOLOR[0]}`} text-white text-sm px-2`}>H1</span>
                                                <p className={`mb-0 text-sm ml-2 ${(firstH1 !== -1 && firstH1 < index) ? "text-red-500" : ""}`}>{ele[1]}</p>
                                                {(firstH1 !== -1 && firstH1 < index) && <span className="ml-4 rounded-xl bg-red-500 text-white text-sm px-2">Multiple H1 Tags</span>}
                                            </div>
                                        );
                                    case 'H2':
                                        return (
                                            <div key={index} className="flex items-center my-3">
                                                <div className="w-4 mr-2 border-b-2"></div>
                                                <span className={`rounded-xl ${HCOLOR[1]} text-white text-sm px-2`}>H2</span>
                                                <p className="mb-0 text-sm ml-2">{ele[1]}</p>
                                            </div>
                                        );
                                    case 'H3':
                                        return (
                                            <div key={index} className="flex items-center my-3">
                                                <div className="w-8 mr-2 border-b-2"></div>
                                                <span className={`rounded-xl ${HCOLOR[2]} text-white text-sm px-2`}>H3</span>
                                                <p className="mb-0 text-sm ml-2">{ele[1]}</p>
                                            </div>
                                        );
                                    case 'H4':
                                        return (
                                            <div key={index} className="flex items-center my-3">
                                                <div className="w-12 mr-2 border-b-2"></div>
                                                <span className={`rounded-xl ${HCOLOR[3]} text-white text-sm px-2`}>H4</span>
                                                <p className="mb-0 text-sm ml-2">{ele[1]}</p>
                                            </div>
                                        );
                                    case 'H5':
                                        return (
                                            <div key={index} className="flex items-center my-3">
                                                <div className="w-16 mr-2 border-b-2"></div>
                                                <span className={`rounded-xl ${HCOLOR[4]} text-white text-sm px-2`}>H5</span>
                                                <p className="mb-0 text-sm ml-2">{ele[1]}</p>
                                            </div>
                                        );
                                    case 'H6':
                                        return (
                                            <div key={index} className="flex items-center my-1">
                                                <div className="w-20 mr-2 border-b-2"></div>
                                                <span className={`rounded-xl ${HCOLOR[5]} text-white text-sm px-2`}>H6</span>
                                                <p className="mb-0 text-sm ml-2">{ele[1]}</p>
                                            </div>
                                        );
                                    default:
                                        return <></>;
                                }
                            })
                        }
                    </div>
                </>
            }
        </div>
    );
};

export default Subheading;
