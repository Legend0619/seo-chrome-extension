import { useState, useEffect } from "react";
import { getLinks, exportLink, highLightNoFollow } from "../../content/links";

interface Link {
    url: string,
    txt: string,
    status: number,
    isInternal: boolean,
    type: string
}

interface LinkData {
    allLink: Array<Link>,
    unique: Map<string, string>,
    internal: Array<Link>,
    external: Array<Link>,
    broken: Array<Link>,
}

const Links = () => {
    const [data, setData] = useState<LinkData>();
    const [openIdx, setOpenIdx] = useState<number>(-1);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            const res: LinkData =  await getLinks();
            setData(res);
            setLoading(false);
        }

        fetchData();
    }, []);

    const handleOpen = (idx: number) => {
        if (openIdx === idx) {
            setOpenIdx(-1);
        } else {
            setOpenIdx(idx);
        }
    }

    return (
        <div className="p-4">
            <div className="h-10 flex justify-between items-center border-b-2 pb-2">
                <p className="text-xl">Links</p>
                <div>
                    <button className={`btn btn-warning btn-sm`} onClick={() => highLightNoFollow()}>highlight Nofollow Links</button>
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
                        <div className='grid grid-cols-5 gap-2 mb-3 text-center'>
                            <div>
                                <p className="text-base font-bold">Total</p>
                                <p className="text-base font-bold">{data?.allLink?.length}</p>
                            </div>
                            <div>
                                <p className="text-base font-bold">Unique</p>
                                <p className="text-base font-bold">{data?.unique?.size}</p>
                            </div>
                            <div>
                                <p className="text-base font-bold">Internal</p>
                                <p className="text-base font-bold">{data?.internal?.length}</p>
                            </div>
                            <div>
                                <p className="text-base font-bold">External</p>
                                <p className="text-base font-bold">{data?.external?.length}</p>
                            </div>
                            <div>
                                <p className="text-base font-bold">Broken</p>
                                <span className={`text-base font-bold ${data?.broken?.length ? 'bg-red-400' : ''}`}>{data?.broken?.length}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="collapse collapse-arrow bg-base-200 mb-3">
                            <input type="radio" name="my-accordion-2" checked={openIdx === 0 ? true : false} onClick={() => handleOpen(0)} /> 
                            <div className="collapse-title text-xl font-medium">
                                Internal
                            </div>
                            <div className="collapse-content"> 
                                {
                                    data?.internal?.map((link, index) => (
                                        <div key={index} className="grid grid-cols-4 mb-2">
                                            <div className="text-sm">
                                                <p>Anchor Text</p>
                                                <p>{link.type}</p>
                                            </div>
                                            <div className="col-span-3">
                                                <p className="break-all text-sm">{link.txt}</p>
                                                <a href={link.url} target="_blank" className="text-yellow-500 break-all">{link.url}</a>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="collapse collapse-arrow bg-base-200 mb-3">
                            <input type="radio" name="my-accordion-2" checked={openIdx === 1 ? true : false} onClick={() => handleOpen(1)} /> 
                            <div className="collapse-title text-xl font-medium">
                                External
                            </div>
                            <div className="collapse-content"> 
                                {
                                    data?.external?.map((link, index) => (
                                        <div key={index} className="grid grid-cols-4 mb-2">
                                            <div className="text-sm">
                                                <p>Anchor Text</p>
                                                <p>{link.type}</p>
                                            </div>
                                            <div className="col-span-3">
                                                <p className="break-all text-sm">{link.txt}</p>
                                                <a href={link.url} target="_blank" className="text-yellow-500 break-all">{link.url}</a>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="collapse collapse-arrow bg-base-200 mb-3">
                            <input type="radio" name="my-accordion-2" checked={openIdx === 2 ? true : false} onClick={() => handleOpen(2)} /> 
                            <div className="collapse-title text-xl font-medium">
                                Broken
                            </div>
                            <div className="collapse-content"> 
                                {
                                    data?.broken?.map((link, index) => (
                                        <div key={index} className="grid grid-cols-4 mb-2">
                                            <div className="text-sm">
                                                <p>Anchor Text</p>
                                                <p>{link.type}</p>
                                            </div>
                                            <div className="col-span-3">
                                                <p className="break-all text-sm">{link.txt}</p>
                                                <a href={link.url} target="_blank" className="text-yellow-500 break-all">{link.url}</a>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between">
                                <button className={`btn btn-sm bg-green-600 text-white ${data?.allLink ? '' : 'btn-disabled'}`} onClick={() => exportLink('All Links', data?.allLink)}>
                                    Export All
                                </button>
                                <button className={`btn btn-sm bg-green-600 text-white ${data?.internal ? '' : 'btn-disabled'}`} onClick={() => exportLink('Internal Links', data?.internal)}>
                                    Export Internal
                                </button>
                                <button className={`btn btn-sm bg-green-600 text-white ${data?.external ? '' : 'btn-disabled'}`} onClick={() => exportLink('External Links', data?.external)}>
                                    Export External
                                </button>
                                <button className={`btn btn-sm bg-green-600 text-white ${data?.broken ? '' : 'btn-disabled'}`} onClick={() => exportLink('Broken Links', data?.broken)}>
                                    Export Broken
                                </button>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default Links;