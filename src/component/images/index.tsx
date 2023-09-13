import { useState, useEffect } from "react";
// import {} from "../../content/images";

const Images = () => {
    return (
        <div className="p-4">
            <div className="h-10 flex justify-between items-center border-b-2 pb-2">
                <p className="text-xl">Images</p>
            </div>
            <div className="grid grid-cols-4 mt-4 pl-4 gap-4">
                <div>
                    <p className="text-base font-bold">29</p>
                    <p className="text-sm">Images</p>
                </div>
                <div>
                    <p className="text-base font-bold">27</p>
                    <p className="text-sm">Without alt text</p>
                </div>
            </div>
        </div>
    )
}

export default Images;