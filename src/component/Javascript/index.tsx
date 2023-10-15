import { useState, useEffect, ChangeEvent } from "react";
import { getContentSetting, setContentSetting } from "../../content/javascript";

const Javascript = () => {
    const [isAllowed, setIsAllowed] = useState<boolean>(true);

    useEffect(() => {
        const getData = async () => {
            const res: string = await getContentSetting();
            setIsAllowed(res === "allow" ? true : false);
        }

        getData();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setContentSetting("allow");   
        } else {
            setContentSetting("block");
        }
        setIsAllowed(e.target.checked);
    }

    return (
        <div className="p-4">
            <div className="h-10 flex justify-between items-center border-b-2 pb-2">
                <p className="text-xl">Javascript</p>
            </div>
            <p className="text-base font-bold my-2">JavaScript Checks:</p>
            <ul className="list-disc pl-5">
                <li className="text-sm">Does the main navigation load when JS is disabled?</li>
                <li className="text-sm">Does the body content and images load when JS is disabled?</li>
                <li className="text-sm">Can pagination load when JS is disabled?</li>
                <li className="text-sm">Is the site operable?</li>
                <li className="text-sm">Check your home, category, product and blog pages.</li>
            </ul>
            <div className="flex items-center mt-3">
                <div className="form-control w-40">
                    <label className="cursor-pointer label">
                    <span className="label-text">{isAllowed ? "Enabled" : "Disabled"}</span> 
                    <input type="checkbox" className="toggle toggle-accent" onChange={handleChange} checked={isAllowed} />
                    </label>
                </div>
            </div>
        </div>
    );
}

export default Javascript;