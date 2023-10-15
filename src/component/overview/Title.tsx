import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { getTitle, measureText } from "../../content/overview";
import { TITLE_RANGE } from "../../utils/consts";

const Title = () => {
    const [content, setContent] = useState<string>('');
    const [status, setStatus] = useState<string>('bg-yellow-500');
    const [des, setDes] = useState<string>('')
    const [len, setLen] = useState<number>(0);

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

    const onTitleChange = async (txt: string) => {
        const titleLen = await measureText(txt, "title");
        setLen(titleLen);
        setContent(txt);
        let statusTmp = '', desTmp = '';
        if (titleLen < TITLE_RANGE[2]) {
            statusTmp = 'bg-yellow-400';
            desTmp = ' - Too Short!';
        }
        else if (txt.length > TITLE_RANGE[1] || titleLen > TITLE_RANGE[3]) {
            statusTmp = 'bg-red-400';
            desTmp = ' - Too Long!';
        }
        else {
            statusTmp = 'bg-green-500';
            desTmp = '';
        }
        setStatus(statusTmp);
        setDes(desTmp);
    }

    return (
        <div className="grid grid-cols-5 gap-4 mb-2 pb-2 border-b-2">
            <div className="text-base">Title Tag</div>
            <div className="col-span-4">
                <input type="text" placeholder="Title" className="input input-bordered input-sm w-full mb-2" value={String(content)} onChange={handleChange} />
                <br />
                <span className={`px-2 py-1 rounded-xl text-white ${status}`}>
                    <FontAwesomeIcon icon={status === "bg-green-500" ? faCheck : faTimes} />
                    {` ${content.length} characters (${len} pixel)${des}`}
                </span>
            </div>
        </div>
    );
}

export default Title;