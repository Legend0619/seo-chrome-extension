import { useState, useEffect } from 'react';
import { getCanonical } from "../../content/overview";

const Canonical = () => {
    const [canonical, setCanonical] = useState<String>('');
    const [state, setState] = useState<String>('');
    const [color, setColor] = useState<String>('');

    useEffect(() => {
        const fetchData = async () => {
            const res = await getCanonical();
            setCanonical(String(res[0]));
            if (res[0] == null) {
                setState('Missing');
                setColor('bg-red-400');
            }                
            else if (res[0] == res[1]) {
                setState('self-referencing');
                setColor('bg-green-500');
            }
            else {
                setState('not the canonical');
                setColor('bg-yellow-400');
            }
        }

        fetchData();
    }, []);

    return (
        <div className="grid grid-cols-5 gap-4 mb-2 pb-2 border-b-2">
            <div className="text-base">Canonical</div>
            <div className="col-span-4">
                <div className='flex justify-end'>
                    <span className={`px-2 py-1 rounded-xl text-white ${color}`}>{state}</span>
                </div>
                <p className='text-sm break-words'>{canonical}</p>
            </div>
        </div>
    );
}

export default Canonical;