import { useState, useEffect } from 'react';
import { getIndexability } from "../../content/overview";

interface MyData {
    status: string,
    pageSize: Number,
    robots: string,
    xRobots: string,
    wordCount: Number,
    lang: string,
    author: string,
    publisher: string
}

const initData: MyData = {
    status: '',
    pageSize: 0,
    robots: '',
    xRobots: '',
    wordCount: 0,
    lang: '',
    author: '',
    publisher: ''
}

const Indexability = () => {
    const [data, setData] = useState<MyData>(initData);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getIndexability();
            const lang = res.lang ?? "N/A";
            const robots = res.robots ?? "N/A";
            const xRobots = res.xRobots ?? "N/A";
            const author = res.author ?? "N/A";
            const publisher = res.publisher ?? "N/A";
            const data: MyData = {
                ...res,
                status: res.status.toString(),
                pageSize: parseFloat(res.pageSize),
                robots: robots,
                xRobots: xRobots,
                wordCount: res.wordCount,
                lang: lang,
                author: author,
                publisher: publisher
            };
            setData(data);
        }

        fetchData()
    }, []);

    return (
        <div className="grid grid-cols-5 gap-4 mb-2 pb-2 border-b-2">
            <div className="text-base">Indexability</div>
            <div className="col-span-4">
                <div className='grid grid-cols-3 gap-4 mb-3'>
                    <div>
                        <p className="text-base">Status Code</p>
                        <p className="text-base-content">{data.status}</p>
                    </div>
                    <div>
                        <p className="text-base">Page Size</p>
                        <p className="text-base-content">{data.pageSize.toString()} KB</p>
                    </div>
                    <div>
                        <p className="text-base">Indexability</p>
                        <span className={`px-2 py-1 rounded-xl text-white ${(data.robots.indexOf('noindex') === -1 && data.xRobots.indexOf('noindex') === -1) ? 'bg-green-500' : 'bg-red-400'}`}>{(data.robots.indexOf('noindex') === -1 && data.xRobots.indexOf('noindex') === -1) ? "Allowed" : "Not allowed"}</span>
                    </div>
                </div>
                <div className='grid grid-cols-3 gap-4 mb-3'>
                    <div>
                        <p className="text-base">Robots</p>
                        <p className={`text-base-content ${data.robots === "" ? "text-gray-400" : ""}`}>{data.robots === "" ? "Missing" : data.robots }</p>
                    </div>
                    <div>
                        <p className="text-base">X-Robots</p>
                        <p className={`text-base-content ${data.xRobots === "" ? "text-gray-400" : ""}`}>{data.xRobots === "" ? "Missing" : data.robots }</p>
                    </div>
                    <div>
                        <p className="text-base">WordCount</p>
                        <p className="text-base-content">{data.wordCount.toString()}</p>
                    </div>
                </div>
                <div className='grid grid-cols-3 gap-4'>
                    <div>
                        <p className="text-base">Language</p>
                        <p className="text-base-content">{data.lang}</p>
                    </div>
                    <div>
                        <p className="text-base">Author</p>
                        <p className={`text-base-content ${data.author === "" ? "text-gray-400" : ""}`}>{data.author === "" ? "Missing" : data.author}</p>
                    </div>
                    <div>
                        <p className="text-base">Publisher</p>
                        <p className={`text-base-content ${data.publisher === "" ? "text-gray-400" : ""}`}>{data.publisher === "" ? "Missing" : data.publisher}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Indexability;