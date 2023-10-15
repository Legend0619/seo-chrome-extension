import { useState, useEffect } from 'react';
import Title from './Title';
import Description from './Description';
import Url from './Url';
import Canonical from './Canonical';
import Indexability from './Indexability';
import Heading from "./Heading";
import HiddenCheck from './HiddenCheck';
import RedirectPath from './RedirectPath';
import { getHiddenCheck, getDomain } from '../../content/overview';

const Overview = () => {
    const [data, setData] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [domain, setDomain] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const res = await getHiddenCheck();
            setData(res);
            const hostname = await getDomain();
            setDomain(hostname);
            setLoading(false);
        }

        fetchData();
    }, []);

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
                    <div className='grid grid-cols-2 gap-4 mt-2'>
                        <div className='text-base'>
                            <a className="link link-primary" href={`https://${domain}/robots.txt`} target='_blank'>Robots.txt</a>
                        </div>
                        <div className='text-base'>
                            <a className="link link-accent" href={`https://${domain}/sitemap.xml`} target='_blank'>sitemap.xml</a>
                        </div>
                    </div>
                </>
            }
        </div>
    );
}

export default Overview;