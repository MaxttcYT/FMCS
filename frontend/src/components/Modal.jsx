import Panel from "./Panel";
import React from "react";
import * as ReactDom from "react-dom";

const modalRoot = document.getElementById('modal-root');

const Modal = ({ title, content, isOpen, actions = null, noInnerPadding=false, panelCN="" }) => {
  return ReactDom.createPortal(
    isOpen && (
      <div className="relative z-40">
        <div className="bg-black bg-opacity-75 fixed top-0 left-0 z-10 w-full min-h-screen">
          <Panel
            title={title}
            noInnerPadding={noInnerPadding}
            className={"w-1/3 mx-auto mt-6 " + panelCN}
            content={typeof content === "function" ? content() : content}
            actions={typeof actions === "function" ? actions() : actions}
          />
        </div>
      </div>
    ),
    modalRoot
  );
};

export default Modal;
