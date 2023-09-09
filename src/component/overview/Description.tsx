import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { DESCRIPTION_RANGE } from "../../utils/consts";
import { getDescription } from "../../content/overview";

const Description = () => {
    const [content, setContent] = useState<String>('');
    const [status, setStatus] = useState<String>('bg-yellow-500');

    useEffect(() => {
        const fetchData = async () => {
            const txt = await getDescription() ?? "";
            onDescriptionChange(txt);
        }

        fetchData();
    }, []);

    const handleChange = (e: any) => {
        const text = e.target.value;
        onDescriptionChange(text);
    }

    const onDescriptionChange = (txt: string) => {
        setContent(txt);
        if (txt.length < DESCRIPTION_RANGE[0])
            setStatus('bg-yellow-400');
        else if (txt.length > DESCRIPTION_RANGE[2])
            setStatus('bg-red-400');
        else
            setStatus('bg-green-500');
    }

    return (
        <div className="grid grid-cols-5 gap-4 mb-2 pb-2 border-b-2">
            <div className="text-base">Description</div>
            <div className="col-span-4">
                <textarea className="textarea textarea-bordered w-full mb-1" placeholder="Description" value={String(content)} onChange={handleChange} />
                <br />
                <span className={`px-2 py-1 rounded-xl text-white ${status}`}>
                    <FontAwesomeIcon icon={faCheck} />
                    {` ${content.length} characters`}
                </span>
            </div>
        </div>
    );
}

export default Description;