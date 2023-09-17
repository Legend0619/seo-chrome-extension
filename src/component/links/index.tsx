import { useState, useEffect } from "react";
import { getLinks, exportLink, highLightNoFollow } from "../../content/links";

interface Link {
    url: string,
    txt: string
}

interface LinkData {
    all: Array<Link>,
    unique: Map<string, string>,
    internal: Array<Link>,
    external: Array<Link>,
    broken: Array<Link>,
}

const Links = () => {
    const [data, setData] = useState<LinkData>();

    useEffect(() => {
        const fetchData = async () => {
            const res: LinkData =  await getLinks();
            setData(res);
        }

        fetchData();
    }, []);

    return (
        <div className="p-4">
            <div className="h-10 flex justify-between items-center border-b-2 pb-2">
                <p className="text-xl">Links</p>
                <div>
                    <button className={`btn btn-warning btn-sm`} onClick={() => highLightNoFollow()}>highlight Nofollow Links</button>
                </div>
            </div>
            <div className="mt-4">
                <div className='grid grid-cols-5 gap-2 mb-3 text-center'>
                    <div>
                        <p className="text-base font-bold">Total</p>
                        <p className="text-base font-bold">{data?.all?.length}</p>
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
                        <p className="text-base font-bold">{data?.broken?.length}</p>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <div className="collapse collapse-arrow bg-base-200 mb-3">
                    <input type="radio" name="my-accordion-2" /> 
                    <div className="collapse-title text-xl font-medium">
                        Internal
                    </div>
                    <div className="collapse-content"> 
                        {
                            data?.internal?.map((link, index) => (
                                <div key={index} className="grid grid-cols-4 mb-2">
                                    <div className="text-sm">Anchor Link</div>
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
                    <input type="radio" name="my-accordion-2" /> 
                    <div className="collapse-title text-xl font-medium">
                        External
                    </div>
                    <div className="collapse-content"> 
                        {
                            data?.external?.map((link, index) => (
                                <div key={index} className="grid grid-cols-4 mb-2">
                                    <div className="text-sm">Anchor Link</div>
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
                    <input type="radio" name="my-accordion-2" /> 
                    <div className="collapse-title text-xl font-medium">
                        Broken
                    </div>
                    <div className="collapse-content"> 
                        {
                            data?.broken?.map((link, index) => (
                                <div key={index} className="grid grid-cols-4 mb-2">
                                    <div className="text-sm">Anchor Link</div>
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
                <div className="grid grid-cols-3">
                    <div className="m-auto">
                        <button className={`btn btn-sm bg-green-600 text-white ${data?.internal ? '' : 'btn-disabled'}`} onClick={() => exportLink('Internal Links', data?.internal)}>
                            Export Internal
                        </button>
                    </div>
                    <div className="m-auto">
                        <button className={`btn btn-sm bg-green-600 text-white ${data?.external ? '' : 'btn-disabled'}`} onClick={() => exportLink('External Links', data?.external)}>
                            Export External
                        </button>
                    </div>
                    <div className="m-auto">
                        <button className={`btn btn-sm bg-green-600 text-white ${data?.all ? '' : 'btn-disabled'}`} onClick={() => exportLink('All Links', data?.all)}>
                            Export All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Links;