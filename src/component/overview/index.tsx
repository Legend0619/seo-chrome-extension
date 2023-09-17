import Title from './Title';
import Description from './Description';
import Url from './Url';
import Canonical from './Canonical';
import Indexability from './Indexability';
import Heading from "./Heading";
import HiddenCheck from './HiddenCheck';
import RedirectPath from './RedirectPath';

const Overview = () => {
    return (
        <div className='p-4'>
            <div className="text-xl h-10">Overview</div>
            <Title />
            <Description />
            <Canonical />
            <Url />
            <Indexability />
            <HiddenCheck />
            <RedirectPath />
            <Heading />
        </div>
    );
}

export default Overview;