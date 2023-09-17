import { useState, useEffect } from "react";
import { getSchema } from "../../content/schema";

const Schema = () => {
    const [data, setData] = useState<string[]>();

    useEffect(() => {
        const fetchData = async () => {
            const res = await getSchema();
            setData(res);
        }

        fetchData();
    }, []);

    return (
        <div className="p-4">
            <div className="h-10 flex justify-between items-center border-b-2 pb-2">
                <p className="text-xl">Schema</p>
            </div>
            <div className="mt-4">
                {
                    data?.map((item, index) => {
                        const schema = JSON.parse(item);
                        const keys = Object.keys(schema);
                        return (
                            <div key={index} className="collapse collapse-arrow bg-base-200 mb-3">
                                <input type="radio" name="my-accordion-2" /> 
                                <div className="collapse-title text-xl font-medium">
                                    {schema['@type'].replace("http://schema.org/", "")}
                                </div>
                                <div className="collapse-content"> 
                                    {
                                        keys.map((keyName, index) => (<div key={index} className="grid grid-cols-4 mb-1">
                                            <div className="text-sm">{keyName}</div>
                                            <div className="col-span-3 text-sm break-all">
                                                {keyName === '@type' ? schema[keyName].replace("http://schema.org/", "") : schema[keyName]}
                                            </div>
                                        </div>))
                                    }
                                </div>
                            </div>
                        )
                    })
                }
                {data?.length === 0 && <div className="text-center text-base">There is no Schema</div>}
            </div>
        </div>
    );
}

export default Schema;
