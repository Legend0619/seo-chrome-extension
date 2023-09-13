import { useState, useEffect } from "react";
import { getHiddenCheck } from "../../content/overview";

const HiddenCheck = () => {
    const [data, setData] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getHiddenCheck();
            setData(res);
        }

        fetchData();
    }, []);

    if (data.length === 0) return (<div></div>);
    else return (
        <div className="grid grid-cols-5 gap-4 mb-2 pb-2 border-b-2">
            <div className="text-base">Hidden Check</div>
            <div className="col-span-4">
                <div className='grid grid-cols-2 gap-4 mb-3'>
                    {
                        data.map((issue, key) => <div key={key} className="text-base">
                            <span className="bg-red-300">{issue}</span>
                        </div>)
                    }
                </div>
            </div>
        </div>
    );
}

export default HiddenCheck;