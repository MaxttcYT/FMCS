import React, { useImperativeHandle, forwardRef, useRef } from "react";
import { Inventory } from "./Inventory";
import Button from "./Button";

const ItemPicker = forwardRef(({ modalManagerRef, projectId }, ref) => {
  const inventoryRef = useRef(null);
  const promiseRef = useRef({ resolve: null, reject: null });

  const handleClose = () => {
    inventoryRef.current = null;
    modalManagerRef.current?.closeModal({ id: "inventory_picker" });
  };

  const handleCancel = () => {
    console.log("[ITEM PICKER] Cancel");
    handleClose();
    promiseRef.current.reject?.();
    promiseRef.current = { resolve: null, reject: null };
  };

  const handleChoose = (chosen) => {
    console.log("[ITEM PICKER] Chosen:", chosen.name);
    handleClose();
    promiseRef.current.resolve?.(chosen);
    promiseRef.current = { resolve: null, reject: null };
  };

  const onSelect = (selected) => {
    modalManagerRef.current?.updateModal({
      id: "inventory_picker",
      actions: (
        <>
          <Button type="success" onClick={() => handleChoose(selected)}>
            Choose {selected?.name}
          </Button>
          <Button type="danger" onClick={handleCancel}>
            Cancel
          </Button>
        </>
      ),
    });
  };

  useImperativeHandle(ref, () => ({
    open() {
      modalManagerRef.current?.addModal({
        id: "inventory_picker",
        title: `Item Picker`,
        noInnerPadding: true,
        panelCN: "!w-[600px]",
        content: (
          <Inventory
            ref={inventoryRef}
            onSelect={onSelect}
            projectid={projectId}
          />
        ),
        actions: (
          <>
            <Button type="danger" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        ),
      });

      // Return a promise that resolves/rejects based on user action
      return new Promise((resolve, reject) => {
        promiseRef.current = { resolve, reject };
      });
    },
  }));

  return null;
});

export default ItemPicker;
