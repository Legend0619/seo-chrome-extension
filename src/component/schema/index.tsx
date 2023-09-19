import { useState, useEffect } from "react";
import { getSchema } from "../../content/schema";

interface MySchema {
    [key: string ]: MySchema
}

interface ListType {
    title: string,
    value: string | number,
    depth: number
}

const Schema = () => {
    const [data, setData] = useState<ListType[][]>();
    const [openIdx, setOpenIdx] = useState<number>(-1);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getSchema();

            const change = res.map(str => JSON.parse(str));
            setData(showData(change));
            setLoading(false);
        }

        fetchData();
    }, []);

    const makeData = (schema: MySchema, list: Array<any>, depth: number) => {
        const keys = Object.keys(schema);
        for (const key of keys) {
            if (typeof schema[key] === 'object') {
                list.push({
                    title: key,
                    value: '',
                    depth: depth
                });
                makeData(schema[key], list, depth + 1);
            }
            else if (Array.isArray(schema[key])) {
                list.push({
                    title: key,
                    value: '',
                    depth: depth
                });
                makeData(schema[key], list, depth + 1);
            }
            else {
                list.push({
                    title: key,
                    value: schema[key],
                    depth: depth
                });
            }
        }
    }

    const showData = (schema: Array<MySchema>) => {
        let result: Array<Array<ListType>> = [];

        schema.forEach(item => {
            let tmp: Array<ListType> = [];
            makeData(item, tmp, 0);
            result.push(tmp);
        });
        return result;
    }

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
                <p className="text-xl">Schema</p>
            </div>
            <div className="mt-4">
                {
                    loading ? 
                    <div className="flex justify-center items-center h-60">
                        <span className="loading loading-dots loading-lg m-auto"></span>
                    </div>
                    :
                    <>
                        {
                            data?.map((ele, index: number) => (
                                <div key={index} className="collapse collapse-arrow bg-base-200 mb-3">
                                    <input type="radio" name="my-accordion-2" checked={openIdx === index ? true : false} onClick={() => handleOpen(index)} /> 
                                    <div className="collapse-title text-xl font-medium">
                                        {String(ele[ele.findIndex(iitem => iitem.title === '@type')].value).replace("http://schema.org/", "")}
                                    </div>
                                    <div className="collapse-content">
                                        {
                                            ele.map((item, idx) => (<div key={idx} className="grid grid-cols-3 text-sm border-b-2">
                                                <div className={`text-blue-500 ml-${2*item.depth} font-bold`}>{item.title}</div>
                                                <div className="col-span-2">{item.value}</div>
                                            </div>))
                                        }
                                    </div>
                                </div>))
                        }
                        {data?.length === 0 && <div className="text-center text-base">There is no Schema</div>}
                    </>
                }
            </div>
        </div>
    );
}

export default Schema;
