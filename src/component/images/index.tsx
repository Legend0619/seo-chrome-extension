import { useState, useEffect } from "react";
import { getImages } from "../../content/images";

interface MyType {
    imgList: Array<string>,
    noAltList: Array<string>,
    large: Array<string>,
    modern: Array<string>
}

const Images = () => {
    const [data, setData] = useState<MyType>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            const res: MyType = await getImages();
            setData(res);
            setLoading(false);
        }
        
        fetchData();
    }, []);

    return (
        <div className="p-4">
            <div className="h-10 flex justify-between items-center border-b-2 pb-2">
                <p className="text-xl">Images</p>
            </div>
            {
                loading ? 
                <div className="flex justify-center items-center h-60">
                    <span className="loading loading-dots loading-lg m-auto"></span>
                </div>
                :
                <>
                    <div className="grid grid-cols-4 mt-4 gap-4 mb-3">
                        <div>
                            <p className="text-base font-bold">{data?.imgList?.length}</p>
                            <p className="text-sm">Images</p>
                        </div>
                        <div>
                            <p className="text-base font-bold">{data?.noAltList?.length}</p>
                            <p className="text-sm">Without alt text</p>
                        </div>
                    </div>
                    <div className="mb-3">
                        <p className="text-sm inline-block px-1 rounded-sm bg-purple-400 text-white mb-1">Missing alt text:</p>
                        <div className="border-2 rounded-md pl-6 py-2 pr-2">
                            <ul className="list-disc list-outside">
                                {
                                    data?.noAltList?.map((img, idx) => <li key={idx} className="my-1 break-all">{img}</li>)
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="mb-3">
                        <p className="text-sm inline-block px-1 rounded-sm bg-purple-400 text-white mb-1">Large image files:</p>
                        <div className="border-2 rounded-md pl-6 py-2 pr-2">
                            <ul className="list-disc list-outside">
                                {
                                    data?.large?.map((img, idx) => <li key={idx} className="my-1 break-all">{img}</li>)
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="mb-3">
                        <p className="text-sm inline-block px-1 rounded-sm bg-purple-400 text-white mb-1">Images without modern format:</p>
                        <div className="border-2 rounded-md pl-6 py-2 pr-2">
                            <ul className="list-disc list-outside">
                                {
                                    data?.modern?.map((img, idx) => <li key={idx} className="my-1 break-all">{img}</li>)
                                }
                            </ul>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default Images;