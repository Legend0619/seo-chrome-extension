import { useState, useEffect } from "react";
import { getRedirect } from "../../content/overview";

interface HttpStatusCodes {
  [key: number]: string;
  200: string;
  301: string;
  307: string;
  308: string;
}

const STATUS_CODE: HttpStatusCodes = {
  200: 'OK',
  301: 'Moved Permanently',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect'
};
interface Path {
    redirect: boolean,
    statusCode: number,
    url: string
};

const RedirectPath = () => {
    const [data, setData] = useState<Path[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getRedirect();
            console.log(res);
            setData(res);
        }

        fetchData();
    }, []);
    if (data.length == 0) return <div></div>
    return (
        <div className="grid grid-cols-5 gap-4 mb-2 pb-2 border-b-2">
            <div className="text-base">Redirect Path</div>
            <div className="col-span-4 p-3 mb-2">
                {
                    data?.map((path, index) => (
                        <div key={index} className="border-b-2">
                            <div className={`p-3 ${path.statusCode === 200 ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                {`${path.statusCode} (${STATUS_CODE[path.statusCode]})`}
                            </div>
                            <div className="p-3">{path.url}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default RedirectPath;