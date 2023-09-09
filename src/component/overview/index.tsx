import { useState } from 'react';
import Title from './Title';
import Description from './Description';
import Url from './Url';
import Canonical from './Canonical';
import Indexability from './Indexability';

const Overview = () => {
    return (
        <div className='p-4'>
            <div className="text-xl h-10">Overview</div>
            <Title />
            <Description />
            <Canonical />
            <Url />
            <Indexability />
        </div>
    );
}

export default Overview;