import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Dropdown, Table, Button } from "react-bootstrap";
import pdfimage from "../images/pdf_downlaod.png";

const ApprovalPopup = ({ show, handleClose, batchData }) => {
  // console.log(batchData , "approval batch data")
  // Use the batchData prop instead of local state
  const customerNames =
    batchData?.customerName
      ?.split(",")
      .map((item) => (item === "NULL" ? "-" : item)) || [];
  const aaNos =
    batchData?.aaNo?.split(",").map((item) => (item === "NULL" ? "-" : item)) ||
    [];
  const imeis =
    batchData?.imeiNo
      ?.split(",")
      .map((item) => (item === "NULL" ? "-" : item)) || [];
  const serviceTypes =
    batchData?.serviceType
      ?.split(",")
      .map((item) => (item === "NULL" ? "-" : item)) || [];
  const brands =
    batchData?.brand
      ?.split(",")
      .map((item) => (item === "NULL" ? "-" : item)) || [];
  const models =
    batchData?.makeModel
      ?.split(",")
      .map((item) => (item === "NULL" ? "-" : item)) || [];
  const repairs =
    batchData?.repairCharges
      ?.split(",")
      .map((item) => (item === "NULL" ? "-" : item)) || [];
  const gstCharges =
    batchData?.chargesInclGST
      ?.split(",")
      .map((item) => (item === "NULL" ? "-" : item)) || [];
  const grossAmounts =
    batchData?.total
      ?.split(",")
      .map((item) => (item === "NULL" ? "-" : item)) || [];

  const maxLength = Math.max(
    customerNames.length,
    aaNos.length,
    imeis.length,
    serviceTypes.length,
    brands.length,
    models.length,
    repairs.length,
    gstCharges.length,
    grossAmounts.length
  );

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="hold_reason_modal"
      backdrop="static"
      size="lg"
    >
      <Modal.Header
        style={{ backgroundColor: "#e6f0ff" }}
        closeButton
        className="hold_popup_header"
      >
        <Modal.Title>
          <div>Batch No: {batchData?.batchNo || "N/A"}</div>
        </Modal.Title>
      </Modal.Header>

      {/* <Modal.Body className="hold_popup_body">
        <Button
          variant="contained"
          onClick={() => {
            if (batchData?.invoice) {
              const link = document.createElement("a");
              link.href = batchData.invoice;
              link.target = "_blank";
              link.download = "";
              link.click();
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px", // spacing between icon and text
          }}
        >
          <img
            src={pdfimage}
            alt="Download PDF"
            style={{ height: "20px", cursor: "pointer" }}
            title="Download PDF"
          />
          Download Invoice
        </Button>
        <div className="table-responsive">
          <Table className="bg-white text-center border-0 network_table">
            <thead style={{ backgroundColor: "#EEF4FF" }}>
              <tr className="text-dark fw-semibold table_th_border">
                <th className="border-start" style={{ whiteSpace: "nowrap" }}>
                  Customer Name
                </th>
                <th style={{ whiteSpace: "nowrap" }}>AA No</th>
                <th style={{ whiteSpace: "nowrap" }}>IMEI No</th>
                <th style={{ whiteSpace: "nowrap" }}>Service Type</th>
                <th style={{ whiteSpace: "nowrap" }}> Brand</th>
                <th style={{ whiteSpace: "nowrap" }}>Model</th>
                <th style={{ whiteSpace: "nowrap" }}>Repair Charges</th>
                <th style={{ whiteSpace: "nowrap" }}>GST Charges</th>
                <th style={{ whiteSpace: "nowrap" }}>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(maxLength)].map((_, index) => (
                <tr
                  className="text-center border-bottom network_td_item"
                  key={index}
                >
                  <td className="border-start align-middle">
                    {customerNames[index] || "-"}
                  </td>
                  <td className="align-middle">{aaNos[index] || "-"}</td>
                  <td className="align-middle">{imeis[index] || "-"}</td>
                  <td className="align-middle">{serviceTypes[index] || "-"}</td>
                  <td className="align-middle">{brands[index] || "-"}</td>
                  <td className="align-middle">{models[index] || "-"}</td>
                  <td className="align-middle">{repairs[index] || "-"}</td>
                  <td className="align-middle">{gstCharges[index] || "-"}</td>
                  <td className="align-middle border-end">
                    {grossAmounts[index] || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Modal.Body> */}

      <Modal.Body className="hold_popup_body">
        {/* Button aligned to top-right */}
        <div className="d-flex justify-content-end mb-3">
          <Button
            variant="contained"
            SX={{backgroundColor:"red"}}
            onClick={() => {
              if (batchData?.invoice) {
                const link = document.createElement("a");
                link.href = batchData.invoice;
                link.target = "_blank";
                link.download = "";
                link.click();
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <img
              src={pdfimage}
              alt="Download PDF"
              style={{ height: "20px", cursor: "pointer" }}
              title="Download PDF"
            />
            Download Invoice
          </Button>
        </div>

        <div className="table-responsive">
          <Table className="bg-white text-center border-0 network_table">
            <thead style={{ backgroundColor: "#EEF4FF" }}>
              <tr className="text-dark fw-semibold table_th_border">
                <th className="border-start" style={{ whiteSpace: "nowrap" }}>
                  Customer Name
                </th>
                <th style={{ whiteSpace: "nowrap" }}>AA No</th>
                <th style={{ whiteSpace: "nowrap" }}>IMEI No</th>
                <th style={{ whiteSpace: "nowrap" }}>Service Type</th>
                <th style={{ whiteSpace: "nowrap" }}>Brand</th>
                <th style={{ whiteSpace: "nowrap" }}>Model</th>
                <th style={{ whiteSpace: "nowrap" }}>Repair Charges</th>
                <th style={{ whiteSpace: "nowrap" }}>GST Charges</th>
                <th style={{ whiteSpace: "nowrap" }}>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(maxLength)].map((_, index) => (
                <tr
                  className="text-center border-bottom network_td_item"
                  key={index}
                >
                  <td className="border-start align-middle">
                    {customerNames[index] || "-"}
                  </td>
                  <td className="align-middle">{aaNos[index] || "-"}</td>
                  <td className="align-middle">{imeis[index] || "-"}</td>
                  <td className="align-middle">{serviceTypes[index] || "-"}</td>
                  <td className="align-middle">{brands[index] || "-"}</td>
                  <td className="align-middle">{models[index] || "-"}</td>
                  <td className="align-middle">{repairs[index] || "-"}</td>
                  <td className="align-middle">{gstCharges[index] || "-"}</td>
                  <td className="align-middle border-end">
                    {grossAmounts[index] || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-end">
        <button onClick={handleClose} className="btn btn-warning px-4">
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ApprovalPopup;
