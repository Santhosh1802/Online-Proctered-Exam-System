import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Image } from "primereact/image";

const PermissionDialog = ({ visible, onHide, onGrant }) => {
  return (
    <Dialog
      header="Permissions Required"
      visible={visible}
      style={{ width: "50vw" }}
      modal
      onHide={onHide}
    >
      <p>This test requires the following permissions:</p>
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        <ul>
          <li>Camera access for Face Detection</li>
          <Image
            src="https://i.ibb.co/gbhBtTcm/Screenshot-2025-03-09-171954.png"
            width="150px"
          />
          <li>Microphone access for Noise Detection</li>
          <Image
            src="https://i.ibb.co/gF7VsR81/Screenshot-2025-03-09-171938.png"
            width="150px"
          />
        </ul>
      </div>
      <p>
        Please grant these permissions in your browser to proceed with the test.
      </p>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button label="Proceed to test" onClick={onGrant} />
      </div>
    </Dialog>
  );
};

export default PermissionDialog;
