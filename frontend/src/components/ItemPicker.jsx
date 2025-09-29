import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useRef,
} from "react";
import { Inventory } from "./Inventory";
import Button from "./Button";

const ItemPicker = forwardRef(({ modalManagerRef }, ref) => {
  const inventoryRef = useRef(null);

  const handleClose = () => {
    inventoryRef.current = null;
    modalManagerRef.current?.closeModal({ id: "inventory_picker" });
  };

  const handleCancel = () => {
    console.log("[ITEM PCIKER] Cancel");
    handleClose();
  };

  const handleChoose = (chosen) => {
    console.log("[ITEM PCIKER] Chosen:", chosen.name);
    handleClose();
  };

  const onSelect = (selected) => {
    modalManagerRef.current?.updateModal({
      id: "inventory_picker",
      actions: (
        <>
          <Button
            type={"success"}
            onClick={(e) => handleChoose(selected)}
          >
            Choose {selected?.name}
          </Button>
          <Button onClick={handleCancel} type={"danger"}>
            Cancel
          </Button>
        </>
      ),
    });
  };

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    open() {
      modalManagerRef.current?.addModal({
        id: "inventory_picker",
        title: `Item Picker`,
        noInnerPadding: true,
        panelCN: "!w-[600px]",
        content: <Inventory ref={inventoryRef} onSelect={onSelect} />,
      });
    },
  }));
});

export default ItemPicker;
