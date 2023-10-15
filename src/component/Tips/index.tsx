import { useState, useEffect, ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler } from "react";
import { EMAIL_PUBLIC_KEY, EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, CONTACT_ADDRESS, EMAIL_TO } from "../../utils/consts";
import emailjs from "@emailjs/browser";

const Tips = () => {
    const [tips, setTips] = useState<string>("");
    const [senderEmail, setSenderEmail] = useState<string>("");
    const [sender, setSender] = useState<string>("");
    const [showToast, setShowToast] = useState<boolean>(false);
    const [link, setLink] = useState<string>("");

    useEffect(() => {
        emailjs.init(EMAIL_PUBLIC_KEY);
    }, []);

    const handleSend: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID,{
            sender: sender,
            message: tips,
            link: link,
            recipient: EMAIL_TO,
            sender_email: senderEmail,
            reply_to: senderEmail
        })
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            }, function(error) {
            console.log('FAILED...', error);
            });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    }

    return (
        <div className="p-4">
            <div className="h-10 flex justify-between items-center border-b-2 pb-2">
                <p className="text-xl">SEO Tips</p>
            </div>
            <div className="py-2 text-center">
                <div className="my-4">
                    <div className="avatar">
                        <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src="/assets/logo.jpg" alt="logo" />
                        </div>
                    </div>
                </div>
                <h3 className="text-lg font-bold">SEO Tip from Zukais</h3>
                <p>Link to your most important pages by using the most internally and externally linked-to pages.</p>
                <p>This is one of the most simplest yet most effective optimizations you can make.</p>
                <p className="my-3">Here is how to do it:</p>
                <p>- Log into Google Search Console</p>
                <p>- Click on "Links" (inside of "Legacy tools and reports")</p>
                <p>- Here, you will find the "Top linked pages" via "External Links" and "Inernal links"</p>
                <p>- Exclude unnecessary pages like the contact page, about page etc.</p>
                <p>- Identify 5 - 10 pages you want to link from and link to the pages you're trying to rank and the highest revenue generating pages.</p>
                <h5 className="text-md font-bold my-2">Where you can find Zukais: <a className="link link-accent" href={CONTACT_ADDRESS}>{CONTACT_ADDRESS}</a></h5>
                <h4 className="text-base font-bold">Want to get featured?</h4>
                <h5 className="text-md font-bold mb-2">Share your SEO tip</h5>
                <form onSubmit={(e) => handleSend(e as FormEvent<HTMLFormElement>)}>
                    <div className="mb-2">
                        <input type="text" placeholder="Your Name" className="input input-sm input-bordered input-primary w-full max-w-xs" value={sender} onChange={e => setSender(e.target.value)} required />
                    </div>
                    <div className="mb-2">
                        <input type="text" placeholder="Your Email" className="input input-sm input-bordered input-info w-full max-w-xs" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} required />
                    </div>
                    <div className="mb-2">
                        <input type="text" placeholder="A link to where people can find you" className="input input-sm input-bordered input-info w-full max-w-xs" value={link} onChange={e => setLink(e.target.value)} required />
                    </div>
                    <div className="mb-2">
                        <textarea className="textarea textarea-sm textarea-accent w-full max-w-xs" placeholder="Write your SEO tips" onChange={e => setTips(e.target.value)} required>{tips}</textarea>
                    </div>
                    <div className="mb-2">
                        <button className="btn btn-primary btn-sm" type="submit">Send</button>
                    </div>
                </form>
                {showToast && <div className="toast toast-end">
                    <div className="alert alert-success">
                        <span>Message sent successfully.</span>
                    </div>
                </div>}
            </div>
        </div>
    );
}

export default Tips;