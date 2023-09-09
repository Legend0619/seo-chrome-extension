import { useState, useEffect } from 'react';
import { getIndexability } from "../../content/overview";

const Indexability = () => {
    useEffect(() => {
        const fetchData = async () => {
            const res = await getIndexability();
        }

        fetchData()
    }, []);

    return (
        <div className="grid grid-cols-5 gap-4 mb-2 pb-2 border-b-2">
            <div className="text-base">Indexability</div>
            <div className="col-span-4">
            </div>
        </div>
    )
}

export default Indexability;