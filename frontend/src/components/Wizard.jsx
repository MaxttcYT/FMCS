// Wizard.js
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import Modal from "./Modal";
import Button from "./Button";
import Error from "./Error";

export function Wizard({
  open,
  setOpen,
  title,
  children,
  onFinish,
  onCancle,
  startStep = 0,
}) {
  const steps = React.Children.toArray(children);
  const [currentStep, setCurrentStep] = React.useState(startStep);
  const [errorMessages, setErrorMessages] = React.useState([]);

  // Keep refs for each step
  const stepRefs = React.useRef(steps.map(() => React.createRef()));

const handleNext = () => {
  const stepRef = stepRefs.current[currentStep]?.current;
  if (stepRef?.validate) {
    const result = stepRef.validate();
    console.log("Validation result:", result);
    if (result !== true) {
      setErrorMessages(typeof result === "string" ? [result] : result);
      return;
    }
  }

  setErrorMessages([]);
  if (currentStep < steps.length - 1) {
    setCurrentStep(currentStep + 1);
  } else {
    onFinish?.();
    setCurrentStep(0);
    setOpen(false);
  }
};

  return (
    <Modal
      isOpen={open}
      title={`${title} - ${currentStep + 1}/${steps.length}`}
      content={
        <div>
          {errorMessages.length > 0 && (
            <div className="error-messages">
              {errorMessages.map((msg, index) => (
                <Error key={index} message={msg} error />
              ))}
            </div>
          )}
          <div className="mt-2">
            {steps.map((step, i) =>
              i === currentStep
                ? React.cloneElement(step, {
                    ref: (el) => {
                      stepRefs.current[i] = { current: el }; // create a ref on the fly
                    },
                    key: i,
                  })
                : null
            )}
          </div>
        </div>
      }
      actions={
        <>
          <Button
            type="danger"
            onClick={() => {
              setErrorMessages([]);
              onCancle?.();
              setCurrentStep(0);
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          {currentStep > 0 && (
            <Button
              type="default"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Back
            </Button>
          )}
          <Button type="success" onClick={handleNext}>
            {currentStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </>
      }
    />
  );
}

export const WizardStep = forwardRef(({ children, validate }, ref) => {
  // Expose validate to parent via ref
  useImperativeHandle(ref, () => ({
    validate,
  }));

  return <div>{children}</div>;
});

export function WizardContent({ children }) {
  return <div className="p-2">{children}</div>;
}
