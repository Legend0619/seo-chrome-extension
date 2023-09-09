import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { getTitle } from "../../content/overview";
import { TITLE_RANGE } from "../../utils/consts";

const Title = () => {
    const [content, setContent] = useState<String>('');
    const [status, setStatus] = useState<String>('bg-yellow-500');

    useEffect(() => {
        const fetchData = async () => {
            const txt = await getTitle() ?? "";
            onTitleChange(txt);
        }

        fetchData();
    }, []);

    const handleChange = (e: any) => {
        const text = e.target.value;
        onTitleChange(text);
    }

    const onTitleChange = (txt: string) => {
        setContent(txt);
        if (txt.length < TITLE_RANGE[0])
            setStatus('bg-yellow-400');
        else if (txt.length > TITLE_RANGE[1])
            setStatus('bg-red-400');
        else
            setStatus('bg-green-500');
    }

    return (
        <div className="grid grid-cols-5 gap-4 mb-2 pb-2 border-b-2">
            <div className="text-base">Title Tag</div>
            <div className="col-span-4">
                <input type="text" placeholder="Title" className="input input-bordered input-sm w-full mb-2" value={String(content)} onChange={handleChange} />
                <br />
                <span className={`px-2 py-1 rounded-xl text-white ${status}`}>
                    <FontAwesomeIcon icon={faCheck} />
                    {` ${content.length} characters`}
                </span>
            </div>
        </div>
    );
}

export default Title;