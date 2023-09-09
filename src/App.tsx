import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faHeading, faImage, faLink, faDatabase } from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import Overview from './component/overview';

function App() {
    const [activeTab, setActiveTab] = useState<Number>(0);

    const handleActiveTab = (active: Number) => {
        setActiveTab(active);
    }

    return (
        <div className="App">
            <div className="bg-green-300 px-4 py-2 text-lg">
                Easy SEO Extenison 1.0
            </div>
            <div className='flex'>
                <ul className="menu p-0">
                    <li>
                        <a className={`tooltip tooltip-right rounded-none ${activeTab === 0 ? "" : "active"}`} data-tip="Overview" onClick={() => handleActiveTab(0)}>
                            <FontAwesomeIcon className='text-xl py-2' icon={faHouse} />
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
                        <a className={`tooltip tooltip-right rounded-none active h-60`} />
                    </li>
                </ul>
                <div className='w-full'>
                    {activeTab === 0 && <Overview />}
                </div>
            </div>
        </div>
    );
}

export default App;
