import { useState, useEffect } from "react";
import { getHeadings } from "../../content/overview";

const Heading = () => {
    const [data, setData] = useState<number[]>([0,0,0,0,0,0,0,0]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getHeadings();
            setData(res);
        }

        fetchData();
    }, []);

    return (
        <div className="grid grid-cols-5 gap-4 pb-2  border-b-2">
            <div className="text-base">Heads, Links, Images</div>
            <div className="col-span-4">
                <div className='grid grid-cols-12 gap-2 mb-3'>
                    <div className="text-center">
                        <p className="font-bold">H1</p>
                        <p><span className={data[0] !== 1 ? "text-red-400" : ""}>{data[0]}</span></p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold">H2</p>
                        <p>{data[1]}</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold">H3</p>
                        <p>{data[2]}</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold">H4</p>
                        <p>{data[3]}</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold">H5</p>
                        <p>{data[4]}</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold">H6</p>
                        <p>{data[5]}</p>
                    </div>
                    <div></div>
                    <div className="col-span-2 text-center">
                        <p className="font-bold">LINKS</p>
                        <p>{data[6]}</p>
                    </div>
                    <div className="col-span-3 text-center">
                        <p className="font-bold">IMAGES</p>
                        <p><span className={data[7] === 0 ? "bg-red-400" : ""}>{data[7]}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Heading;