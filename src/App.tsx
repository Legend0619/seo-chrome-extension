import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faHeading, faImage, faLink, faDatabase, faCode, faSmile, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import Overview from './component/overview';
import SubHeading from './component/subheading';
import Images from "./component/images";
import Links from "./component/links";
import Schema from './component/schema';
import Javascript from './component/Javascript';
import Tips from './component/Tips';
import Keyword from './component/keyword';

function App() {
    const [activeTab, setActiveTab] = useState<Number>(0);
    const [title, setTitle] = useState("");

    useEffect(() => {
        setTitle(chrome.runtime.getManifest()["name"]);
    }, []);

    const handleActiveTab = (active: Number) => {
        setActiveTab(active);
    }

    return (
        <div className="App">
            <div className="banner px-4 py-2 text-lg text-white">
                {title}
            </div>
            <div className='flex'>
                <ul className="menu p-0 mainHeight">
                    <li>
                        <a className={`tooltip tooltip-right rounded-none ${activeTab === 0 ? "" : "active"}`} data-tip="Overview" onClick={() => handleActiveTab(0)}>
                            <FontAwesomeIcon className='text-xl py-2' icon={faHouse} />
                        </a>
                    </li>
                    <li>
                        <a className={`tooltip tooltip-right rounded-none ${activeTab === 7 ? "" : "active"}`} data-tip="Keyword Sniper" onClick={() => handleActiveTab(7)}>
                            <FontAwesomeIcon className='text-xl py-2' icon={faMagnifyingGlass} />
                        </a>
                    </li>
                    <li>
                        <a className={`tooltip tooltip-right rounded-none ${activeTab === 1 ? "" : "active"}`} data-tip="Subheading" onClick={() => handleActiveTab(1)}>
                            <FontAwesomeIcon className='text-xl py-2' icon={faHeading} />
                        </a>
                    </li>
                    <li>
                        <a className={`tooltip tooltip-right rounded-none ${activeTab === 2 ? "" : "active"}`} data-tip="Images" onClick={() => handleActiveTab(2)}>
                            <FontAwesomeIcon className='text-xl py-2' icon={faImage} />
                        </a>
                    </li>
                    <li>
                        <a className={`tooltip tooltip-right rounded-none ${activeTab === 3 ? "" : "active"}`} data-tip="Links" onClick={() => handleActiveTab(3)}>
                            <FontAwesomeIcon className='text-xl py-2' icon={faLink} />
                        </a>
                    </li>
                    <li>
                        <a className={`tooltip tooltip-right rounded-none ${activeTab === 4 ? "" : "active"}`} data-tip="Schemas" onClick={() => handleActiveTab(4)}>
                            <FontAwesomeIcon className='text-xl py-2' icon={faDatabase} />
                        </a>
                    </li>
                    <li>
                        <a className={`tooltip tooltip-right rounded-none ${activeTab === 5 ? "" : "active"}`} data-tip="Javascript" onClick={() => handleActiveTab(5)}>
                            <FontAwesomeIcon className='text-xl py-2' icon={faCode} />
                        </a>
                    </li>
                    <li>
                        <a className={`tooltip tooltip-right rounded-none ${activeTab === 6 ? "" : "active"}`} data-tip="SEO Tips" onClick={() => handleActiveTab(6)}>
                            <FontAwesomeIcon className='text-xl py-2' icon={faSmile} />
                        </a>
                    </li>
                    <li>
                        <a className={`tooltip tooltip-right rounded-none active h-24`} />
                    </li>
                </ul>
                <div className='w-full mainHeight overflow-y-scroll'>
                    {activeTab === 0 && <Overview />}
                    {activeTab === 1 && <SubHeading />}
                    {activeTab === 2 && <Images />}
                    {activeTab === 3 && <Links />}
                    {activeTab === 4 && <Schema />}
                    {activeTab === 5 && <Javascript />}
                    {activeTab === 6 && <Tips />}
                    {activeTab === 7 && <Keyword />}
                </div>
            </div>
        </div>
    );
}

export default App;
