import { useState, useEffect } from 'react';
import Title from './Title';
import Description from './Description';
import Url from './Url';
import Canonical from './Canonical';
import Indexability from './Indexability';
import Heading from "./Heading";
import HiddenCheck from './HiddenCheck';
import RedirectPath from './RedirectPath';
import { getHiddenCheck } from '../../content/overview';

const Overview = () => {
    const [data, setData] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getHiddenCheck();
            setData(res);
            setLoading(false);
        }

        fetchData();
    })

    return (
        <div className='p-4'>
            <div className="text-xl h-10">Overview</div>
            {
                loading ? 
                <div className="flex justify-center items-center h-60">
                    <span className="loading loading-dots loading-lg m-auto"></span>
                </div>
                :
                <>
                    <Title />
                    <Description />
                    <Canonical />
                    <Url />
                    <Indexability />
                    <HiddenCheck data={ data } />
                    <RedirectPath />
                    <Heading />
                </>
            }
        </div>
    );
}

export default Overview;