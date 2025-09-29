import React, { useState, useImperativeHandle, forwardRef } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Error from "./Error";

const ModalManager = forwardRef((props, ref) => {
  const [modals, setModals] = useState([]);

  useImperativeHandle(ref, () => ({
    addModal: (modalData) => {
      const newModal = {
        id: modalData.id || Date.now(),
        isOpen: true,
        title: modalData.title,
        content: modalData.content,
        actions: modalData.actions,
        noInnerPadding: modalData.noInnerPadding,
        panelCN: modalData.panelCN,
      };
      setModals([...modals, newModal]);
    },

    addSaveConfirmModal: (modalData = { fileName: "123.lua" }) => {
      const newModal = {
        id: Date.now(),
        title: "File saving",
        content: (
          <div>
            <h1 className="text-dirty-white text-xl">
              Do you want to save the changes you made to {modalData.fileName}?
            </h1>
            <p>Your changes will be lost if you don't save them</p>
          </div>
        ),
        isOpen: true,
        actions: (
          <>
            <Button
              size="sm"
              type="success"
              onClick={() => {
                modalData.onSave?.();
                setModals(modals.filter((modal) => modal.id !== newModal.id));
              }}
            >
              Save changes
            </Button>
            <Button
              size="sm"
              type="danger"
              onClick={() => {
                modalData.onDontSave?.();
                setModals(modals.filter((modal) => modal.id !== newModal.id));
              }}
            >
              Don't Save
            </Button>
            <Button
              size="sm"
              type="default"
              onClick={() => {
                modalData.onCancel?.();
                setModals(modals.filter((modal) => modal.id !== newModal.id));
              }}
            >
              Cancel
            </Button>
          </>
        ),
      };
      setModals([...modals, newModal]);
    },

    addConfirmModal: (
      modalData = {
        title: "Confirmation",
        content: <p>Do you really want to do this?</p>,
      }
    ) => {
      const newModal = {
        id: Date.now(),
        title: modalData.title,
        content: modalData.content,
        isOpen: true,
        actions: (
          <>
            <Button
              size="sm"
              type="success"
              onClick={() => {
                modalData.onYes?.();
                setModals(modals.filter((modal) => modal.id !== newModal.id));
              }}
            >
              Yes
            </Button>
            <Button
              size="sm"
              type="danger"
              onClick={() => {
                modalData.onCancel?.();
                setModals(modals.filter((modal) => modal.id !== newModal.id));
              }}
            >
              Cancel
            </Button>
          </>
        ),
      };
      setModals([...modals, newModal]);
    },

    addWizard: ({ title, steps, onFinish }) => {
      const modalId = Date.now();
      let currentStep = 0;
      let errorMessage = null;

      let stepsList = [...steps];
      const addSteps = (newSteps) => {
        stepsList = [...stepsList, ...newSteps];
        updateWizardModal();
      };

      const updateWizardModal = () => {
        const step = stepsList[currentStep];

        const handleNext = () => {
          if (typeof step.onNext === "function") {
            const result = step.onNext({ addSteps });
            if (result !== true) {
              errorMessage = result;
              updateWizardModal();
              return;
            }
          }
          errorMessage = null;
          if (currentStep < stepsList.length - 1) {
            currentStep++;
            updateWizardModal();
          } else {
            onFinish?.();
            close();
          }
        };

        const handleBack = () => {
          errorMessage = null;
          if (currentStep > 0) {
            currentStep--;
            updateWizardModal();
          }
        };

        const close = () => {
          setModals((prev) => prev.filter((m) => m.id !== modalId));
        };

        const modalData = {
          id: modalId,
          title: `${title} - ${currentStep + 1}/${stepsList.length}`,
          content: (
            <div>
              {errorMessage && <Error message={errorMessage} error={true} />}
              {/* Step kann entweder ein Objekt mit content sein oder direkt eine Komponente */}
              {React.isValidElement(step) ? (
                step
              ) : typeof step === "function" ? (
                <step addSteps={addSteps} />
              ) : (
                step.content
              )}
            </div>
          ),
          isOpen: true,
          actions: (
            <>
              <Button type="danger" onClick={close}>
                Cancel
              </Button>
              {currentStep > 0 && (
                <Button type="default" onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button type="success" onClick={handleNext}>
                {currentStep === stepsList.length - 1 ? "Finish" : "Next"}
              </Button>
            </>
          ),
        };

        setModals((prev) => {
          const existing = prev.find((m) => m.id === modalId);
          if (existing) {
            return prev.map((m) => (m.id === modalId ? modalData : m));
          }
          return [...prev, modalData];
        });
      };

      updateWizardModal();
    },

    closeModal: (modalData) => {
      setModals(modals.filter((modal) => modal.id !== modalData.id));
    },
    updateModal: ({ id, title, content, actions }) => {
      setModals((prev) =>
        prev.map((modal) =>
          modal.id === id
            ? {
                ...modal,
                title: title !== undefined ? title : modal.title,
                content: content !== undefined ? content : modal.content,
                actions: actions !== undefined ? actions : modal.actions,
              }
            : modal
        )
      );
    },
  }));

  return (
    <div>
      {modals.map((modal) => (
        <Modal
          key={modal.id}
          title={modal.title}
          isOpen={modal.isOpen}
          content={modal.content}
          actions={modal.actions}
          noInnerPadding={modal.noInnerPadding}
          panelCN={modal.panelCN}
        />
      ))}
    </div>
  );
});

export default ModalManager;
