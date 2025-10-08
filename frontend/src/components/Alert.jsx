import { InfoIcon } from "lucide-react";
import React from "react";

function Alert({children, type}) {
    return (
        <div className="h-fit w-fit bg-[#1f192295] text-[#75dafb] gap-2 text-[18px] px-4 my-4 py-2 flex items-center border-l-[5px] border-l-[#2d396d]">
            <InfoIcon size={24} /> {children}
        </div>
    );
}

export default Alert;