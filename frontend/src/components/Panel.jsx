import React from "react";

const Panel = ({ title, content, actions, className, noInnerPadding = false, contentWrapperClassName }) => {
    return (
        <div className={(className ? className : '') + ' accentuated rounded-sm bg-gray-dark shadow-xl pb-4'}>
            <div className="px-4 py-2 text-xl text-dirty-white font-bold">
                {title}
            </div>
            <div className={
                "text-white rounded-sm bg-gray-medium shadow-inner mx-4 " +
                (noInnerPadding ? "" : 'px-6 pt-4 pb-4 ') +
                (contentWrapperClassName || "")
            }>
                {typeof content === "function" ? content() : content}
            </div>
            {actions
                ? <div className="mx-4 pt-4 flex justify-end gap-2">
                    {typeof actions === "function" ? actions() : actions}
                  </div>
                : null
            }
        </div>
    );
};

export default Panel;
