import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import axios from "axios";

const ExcelToJson = () => {
  const [jsonData, setJsonData] = useState([]);
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const fileUploadRef = useRef(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileUpload = (event) => {
    const uploadedFile = event.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setJsonData(parsedData);
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jsonData.length) {
      setShowModal(true);
      return;
    }
    try {
      const res = await axios.post(process.env.REACT_APP_ADMIN_BULK_UPLOAD_STUDENT, { students: jsonData }, { withCredentials: true });
      setError("");
      setMessage(res.data.message);
    } catch (error) {
      setMessage("");
      setError(error.response?.data?.error || "An error occurred while uploading the data.");
    }
  };

  const handleReset = () => {
    setError("");
    setMessage("");
    setJsonData([]);
    setFile(null);
    if (fileUploadRef.current) {
      fileUploadRef.current.clear();
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Card title="Bulk Upload Students" className="p-4">
        <Button
          label="Download Bulk Upload Template"
          icon="pi pi-download"
          onClick={() => {
            const fileUrl =
              "https://docs.google.com/spreadsheets/d/1ScAFHTJN632P6vR_HY2DopjpaYKQqq0h/export?format=xlsx";
            const a = document.createElement("a");
            a.href = fileUrl;
            a.download = "Bulk Upload Template.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
          style={{ marginBottom: "1em" }}
        />
        <form onSubmit={handleSubmit}>
          <div className="p-field">
            <FileUpload
              ref={fileUploadRef}
              mode="basic"
              accept=".xlsx, .xls"
              maxFileSize={1000000}
              chooseLabel="Choose Excel File"
              onSelect={handleFileUpload}
            />
          </div>

          {file && (
            <p style={{ marginTop: "10px", fontWeight: "bold" }}>
              Uploaded File: {file.name}
            </p>
          )}

          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <Button
              type="submit"
              label="Submit Data"
              icon="pi pi-check"
              className="p-button-success p-button-sm"
            />
            {file && (
              <Button
                label="Reset"
                icon="pi pi-refresh"
                className="p-button-secondary p-button-sm"
                onClick={handleReset}
              />
            )}
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {message && <p style={{ color: "green" }}>{message}</p>}
        </form>

        <Dialog
          visible={showModal}
          onHide={() => setShowModal(false)}
          header="Error"
          footer={<Button label="OK" onClick={() => setShowModal(false)} />}
        >
          <p>Please upload an Excel file before submitting.</p>
        </Dialog>
      </Card>
    </div>
  );
};

export default ExcelToJson;