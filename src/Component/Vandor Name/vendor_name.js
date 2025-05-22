import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom"; // Import useLocation
import Header from "../Header/header";
import { Table } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
import { MdFileUpload } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { fetchGadgetCaseDetailsByVendor } from "../../api/api"; // API function
import BatchPopup from "./batchPopup";
import { Circles } from "react-loader-spinner";

function Vendor_name() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAAno, setSelectedAAno] = useState([]);
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [isExcelUpload, setIsExcelUpload] = useState(false);
  const itemsPerPage = 8;

  // Get vendorName and vendorId from location state
  const location = useLocation();
  const { vendorName, vendorId } = location.state || {}; // Destructure vendorName and vendorId from state
  console.log(vendorName, vendorId, "vendorrrrr name");

  useEffect(() => {
    const fetchData = async () => {
      if (vendorName) {
        try {
          const result = await fetchGadgetCaseDetailsByVendor(
            vendorName,
            vendorId
          );
          if (result.success) {
            setInvoices(result.data || []);
          } else {
            setError(result.message || "Failed to fetch data");
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [vendorName]);

  // Pagination logic
  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = invoices.slice(indexOfFirstItem, indexOfLastItem);
  // console.log(currentInvoices, "current invoicesssss");
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const taoatlAmount = currentInvoices.reduce((total, invoice) => {
    const cleanedAmount = invoice.total?.toString().replace(/,/g, "");
    const amount = parseFloat(cleanedAmount);
    return total + (isNaN(amount) ? 0 : amount);
  }, 0);

  // const formatDate = (dateTimeStr) => {
  //   if (!dateTimeStr) return "--";
  //   const [datePart] = dateTimeStr.split(" ");
  //   const [day, month, year] = datePart.split("-");
  //   return `${day}/${month}/${year}`;
  // };
  ////////////////////////
  // const formatDate = (dateTimeStr) => {
  //   if (!dateTimeStr) return "--";

  //   const str = String(dateTimeStr); // Force it to string
  //   const [datePart] = str.split(" ");
  //   if (!datePart || !datePart.includes("-")) return "--";

  //   const [day, month, year] = datePart.split("-");
  //   if (!day || !month || !year) return "--";

  //   return `${day}/${month}/${year}`;
  // };
  const formatDate = (dateTimeStr) => {
    if (!dateTimeStr || typeof dateTimeStr !== "string") return "--";

    // if it’s an Excel serial date accidentally passed as a number string, try converting
    if (!isNaN(dateTimeStr)) {
      const serial = parseFloat(dateTimeStr);
      const utc_days = Math.floor(serial - 25569);
      const utc_value = utc_days * 86400;
      const date_info = new Date(utc_value * 1000);
      return date_info.toLocaleDateString("en-GB"); // DD/MM/YYYY
    }

    const [datePart] = dateTimeStr.split(" ");
    if (!datePart.includes("-")) return "--";

    const [day, month, year] = datePart.split("-");
    if (!day || !month || !year) return "--";

    return `${day}/${month}/${year}`;
  };
  // const [selectedInvoices, setSelectedInvoices] = useState([]);
  // const handleSubmit = () => {
  //   const selectedInvoiceData = invoices.filter((invoice) =>
  //     selectedAAno.includes(invoice.aA_Number) // ✅ match the selection field
  //   );
  //   setSelectedInvoices(selectedInvoiceData);
  //   setShowHoldModal(true);
  //   console.log("Submitted full invoices:", selectedInvoiceData);
  // };
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const handleCheckboxChange = (invoiceId) => {
    // Toggle the checkbox state for the invoice
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.aA_Number === invoiceId
          ? { ...invoice, isChecked: !invoice.isChecked }
          : invoice
      )
    );

    // Update selectedAAno array based on the checkbox selection
    setSelectedAAno((prevSelectedAAno) => {
      if (selectedAAno.includes(invoiceId)) {
        // If already selected, remove it
        return prevSelectedAAno.filter((aaNo) => aaNo !== invoiceId);
      } else {
        // If not selected, add it
        return [...prevSelectedAAno, invoiceId];
      }
    });
  };

  const handleSubmit = () => {
    const selectedInvoiceData = invoices.filter((invoice) => invoice.isChecked);
    if (selectedInvoiceData.length === 0) {
      alert("Please select at least one invoice before submitting.");
      return;
    }

    setSelectedInvoices(selectedInvoiceData); // Store selected invoices
    setShowHoldModal(true); // Open the popup
    console.log("Submitted selected invoices:", selectedInvoiceData);
  };

  ///////////////////////// uplaod invoice funactioalony

  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      const fileExtension = file.name.split(".").pop().toLowerCase();
  
      reader.onload = (e) => {
        let data;
        if (fileExtension === "csv") {
          const csvData = e.target.result;
          const workbook = XLSX.read(csvData, { type: "string" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        } else {
          const binaryData = new Uint8Array(e.target.result);
          const workbook = XLSX.read(binaryData, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        }
  
        const [headers, ...rows] = data;
        const formattedData = rows.map((row) =>
          headers.reduce((acc, key, i) => {
            // Map Excel headers to your expected keys
            const mappedKey =
              {
                "AA No": "aA_Number",
                "IMEI No": "imeiNumber",
                "Creation Date": "creationDate",
                "Closure Date": "closureDate",
                "Customer Name": "customerName",
                "Service Type": "serviceType",
                Brand: "brand",
                "Make Model": "makeModel",
                "Repair Charges": "repairCharges",
                "Charges( incl GST)": "chargesIncGST",
                Total: "total",
                "Invoice Status": "invoiceStatus",
              }[key] || key;
  
            let value = row[i];
  
            // Format specific fields to have 2 decimal places if they are numeric
            if (["repairCharges", "total"].includes(mappedKey)) {
              if (value === null || value === undefined || value === "") {
                value = "0.00";
              } else {
                const num = parseFloat(value);
                value = isNaN(num) ? "0.00" : num.toFixed(2);
              }
            }
  
            acc[mappedKey] = value;
            return acc;
          }, {})
        );
  
        setSelectedInvoices(formattedData);
        setShowHoldModal(true);
        setIsExcelUpload(true);
      };
  
      if (fileExtension === "csv") {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    }
  };
  
  /////////////////////////////////////// end excel sheet
  return (
    <div>
      {/* <Header /> */}
      <div className="container mt-4">
        <div className="netwrok_table_main_content">
          <div>
            <div className="d-flex justify-content-between network_filter_div">
              <h5 className="fw-bold m-0">
                {vendorName} / {vendorId}
              </h5>
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center"
                onClick={triggerFileInput}
                style={{
                  backgroundColor: "#8000d7",
                  border: "none",
                  padding: "10px 50px",
                  borderRadius: "8px",
                  fontWeight: "500",
                  fontSize: "16px",
                }}
              >
                <MdFileUpload />
                <span className="ms-2">Upload Excel</span>
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
            />
          </div>
          {loading ? (
            // <div className="text-center mt-4">Loading invoices...</div>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "200px" }}
            >
              <Circles
                height="60"
                width="60"
                color="#FE850E"
                ariaLabel="circles-loading"
                visible={true}
              />
            </div>
          ) : (
            <div className="table-responsive mt-3">
              <Table className="bg-white text-center border-0 network_table">
                <thead style={{ backgroundColor: "#EEF4FF" }}>
                  <tr className="text-dark fw-semibold table_th_border">
                    {/* <th className="border-start">View</th> */}
                    <th>Select</th>
                    {/* <th style={{ whiteSpace: "nowrap" }}>Selling Partner</th> */}
                    <th style={{ whiteSpace: "nowrap" }}>AA No</th>
                    <th style={{ whiteSpace: "nowrap" }}>IMEI No</th>
                    <th style={{ whiteSpace: "nowrap" }}>Creation Date</th>
                    <th style={{ whiteSpace: "nowrap" }}>Closure Date</th>
                    <th style={{ whiteSpace: "nowrap" }}>Customer Name</th>
                    <th style={{ whiteSpace: "nowrap" }}>Service Type</th>
                    <th style={{ whiteSpace: "nowrap" }}>Brand</th>
                    <th style={{ whiteSpace: "nowrap" }}>Make Model</th>
                    <th style={{ whiteSpace: "nowrap" }}>Repair Charges</th>
                    <th style={{ whiteSpace: "nowrap" }}>Charges( incl GST)</th>
                    <th>Total</th>
                    <th className="border-end" style={{ whiteSpace: "nowrap" }}>
                      Invoice Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentInvoices.length > 0 ? (
                    currentInvoices.map((invoice) => (
                      <tr
                        key={invoice.aA_Number}
                        className="text-center border-bottom network_td_item"
                      >
                        {/* <td className="border-start align-middle">
                          <FaEye className="text-purple review_fa_eye" />
                        </td> */}
                        <td className="align-middle vendor_checkbox">
                          <input
                            type="checkbox"
                            id="cb1"
                            checked={invoice.isChecked || false} // Ensure checkbox reflects 'isChecked' state
                            onChange={() =>
                              handleCheckboxChange(invoice.aA_Number)
                            } // Toggle the 'isChecked' state
                          />
                        </td>
                        {/* <td className="align-middle">--</td> */}
                        <td className="align-middle">
                          {invoice.aA_Number || "--"}
                        </td>
                        <td className="align-middle">
                          {invoice.imeiNumber || "--"}
                        </td>
                        <td className="align-middle">
                          {invoice.creationDate
                            ? formatDate(invoice.creationDate)
                            : "--"}
                        </td>
                        {/* <td className="align-middle">
                          {invoice.closureDate || "--"}
                        </td> */}
                        <td className="align-middle">
                          {invoice.closureDate
                            ? formatDate(invoice.closureDate)
                            : "--"}
                        </td>
                        <td className="align-middle">
                          {invoice.customerName || "--"}
                        </td>
                        <td className="align-middle">
                          {invoice.serviceType || "--"}
                        </td>
                        <td className="align-middle">
                          {invoice.brand || "--"}
                        </td>
                        <td className="align-middle">
                          {invoice.makeModel || "--"}
                        </td>
                        <td className="align-middle">
                          {invoice.repairCharges || "--"}
                        </td>
                        <td className="align-middle">
                          {invoice.chargesIncGST || "--"}
                        </td>
                        <td className="align-middle">
                          {invoice.total || "--"}
                        </td>
                        <td
                          className="align-middle border-end"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          <span className="vendore_invoice_status px-3 py-1 rounded-pill">
                            {invoice.invoiceStatus || "--"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="15" className="text-center py-4">
                        Data not available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
          <div className="d-flex justify-content-between align-items-center pagination-container network_previous">
            <button
              className="network_previous"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="network_previous"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          <div className="d-flex justify-content-between">
            <div
              className="border border-2 rounded-3 p-3 d-inline-block mt-4"
              style={{ borderColor: "#8000ff" }}
            >
              <span className="fw-semibold text-secondary me-2">
                Total no of selected Service :
              </span>
              <span className="fw-bold text-dark">{selectedAAno.length}</span>
            </div>
            <div
              className="border border-2 rounded-3 p-3 d-inline-block mt-4"
              style={{ borderColor: "#8000ff" }}
            >
              <span className="fw-semibold text-secondary me-2">
                Total Charges :
              </span>
              <span className="fw-bold text-dark">₹{taoatlAmount}</span>
            </div>
          </div>
          <div className="d-flex mt-4 vendor_submit_btn justify-content-between align-items-center flex-wrap gap-3">
            {/* Selected SRNs on the left */}
            <div className="d-flex flex-wrap gap-2">
              {selectedAAno.map((aaNo, index) => {
                const aaNumber =
                  invoices.find((inv) => inv.aA_Number === aaNo)?.aA_Number ||
                  aaNo;

                return (
                  <p
                    key={index}
                    className="vendor_srn_no d-flex align-items-center"
                  >
                    AA no <span className="ms-1">{aaNumber}</span>
                    <button
                      type="button"
                      className="btn-close ms-2"
                      onClick={() => {
                        // Remove from selectedAAno
                        setSelectedAAno((prev) =>
                          prev.filter((item) => item !== aaNo)
                        );

                        // Uncheck the corresponding invoice
                        setInvoices((prevInvoices) =>
                          prevInvoices.map((invoice) =>
                            invoice.aA_Number === aaNo
                              ? { ...invoice, isChecked: false }
                              : invoice
                          )
                        );
                      }}
                      aria-label="Remove"
                    ></button>
                  </p>
                );
              })}
            </div>

            {/* Clear All Button + Submit Button */}
            <div className="d-flex align-items-center gap-2">
              {/* Submit Button */}
              <button
                className="btn btn-primary d-flex align-items-center"
                style={{
                  backgroundColor: "#8000d7",
                  border: "none",
                  padding: "10px 50px",
                  borderRadius: "8px",
                  fontWeight: "500",
                  fontSize: "16px",
                  opacity: invoices.some((inv) => inv.isChecked) ? 1 : 0.6,
                  cursor: invoices.some((inv) => inv.isChecked)
                    ? "pointer"
                    : "not-allowed",
                }}
                onClick={handleSubmit}
                disabled={!invoices.some((inv) => inv.isChecked)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <BatchPopup
        show={showHoldModal}
        handleClose={() => setShowHoldModal(false)}
        selectedInvoices={selectedInvoices}
      /> */}
      <BatchPopup
        show={showHoldModal}
        handleClose={() => setShowHoldModal(false)}
        selectedInvoices={selectedInvoices}
        vendorName={vendorName}
        vendorId={vendorId}
        isExcelUpload={isExcelUpload}
      />
    </div>
  );
}

export default Vendor_name;
