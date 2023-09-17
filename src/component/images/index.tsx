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

    useEffect(() => {
        const fetchData = async () => {
            const res: MyType = await getImages();
            setData(res);
        }
        
        fetchData();
    }, []);

    return (
        <div className="p-4">
            <div className="h-10 flex justify-between items-center border-b-2 pb-2">
                <p className="text-xl">Images</p>
            </div>
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
                <p className="text-sm">Missing alt text:</p>
                <div className="border-2 rounded-md pl-6 py-2 pr-2">
                    <ul className="list-disc list-outside">
                        {
                            data?.noAltList?.map((img, idx) => <li key={idx} className="my-1 break-all">{img}</li>)
                        }
                    </ul>
                </div>
            </div>
            <div className="mb-3">
                <p className="text-sm">Large image files:</p>
                <div className="border-2 rounded-md pl-6 py-2 pr-2">
                    <ul className="list-disc list-outside">
                        {
                            data?.large?.map((img, idx) => <li key={idx} className="my-1 break-all">{img}</li>)
                        }
                    </ul>
                </div>
            </div>
            <div className="mb-3">
                <p className="text-sm">Images without modern format:</p>
                <div className="border-2 rounded-md pl-6 py-2 pr-2">
                    <ul className="list-disc list-outside">
                        {
                            data?.modern?.map((img, idx) => <li key={idx} className="my-1 break-all">{img}</li>)
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Images;