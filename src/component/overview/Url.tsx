import { useState, useEffect } from 'react';
import { getUrl } from "../../content/overview";

const Url = () => {
    const [url, setUrl] = useState<String>('');

    useEffect(() => {
        const fetchData =async () => {
            const txt = await getUrl() ?? "";
            setUrl(txt);
        }

        fetchData()
    }, []);

    return (
        <div className="grid grid-cols-5 gap-4 mb-2 pb-2 border-b-2">
            <div className="text-base">Url</div>
            <div className="col-span-4">
                <p className='text-sm break-words'>{url}</p>
            </div>
        </div>
    );
}

export default Url;