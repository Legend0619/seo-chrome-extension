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

    return (
        <div className="grid grid-cols-5 gap-4 mb-2 pb-2 border-b-2">
            <div className="text-base">Hidden Check</div>
            {/* <div className="col-span-4">
                <div className='grid grid-cols-4 gap-4 mb-3'>
                    {
                        data.map((issue, key) => <div key={key}>{issue}</div>)
                    }
                </div>
            </div> */}
        </div>
    );
}

export default HiddenCheck;