import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button, Form, Table } from "react-bootstrap";
import {
  FaEye,
  FaDownload,
  FaTrash,
  FaUpload,
  FaEdit,
} from "react-icons/fa";
import Papa from "papaparse";
import { useNavigate, useLocation } from "react-router-dom";
import { saveAs } from "file-saver";

const BASE_URL = "https://mintflix.live:8086/api/Auto";

function ApprovalBatchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const batchData = location.state?.batchData || null; // Get batchData from navigation state
  const fileInputRef = useRef();
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isGSTApplied, setIsGSTApplied] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [caseCount, setCaseCount] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    invoiceNo: false,
    invoiceDate: false,
    invoiceAmount: false,
    caseCount: false,
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = invoices.slice(indexOfFirstItem, indexOfLastItem);
  const selectedAAno = invoices.filter((invoice) => invoice.isChecked);

  const totalRepairCharges = currentInvoices.reduce((total, invoice) => {
    const cleanedAmount = invoice.repairCharges?.toString().replace(/,/g, "");
    const amount = parseFloat(cleanedAmount);
    return total + (isNaN(amount) ? 0 : amount);
  }, 0);

  const grossAmount = currentInvoices.reduce((total, invoice) => {
    const cleanedAmount = invoice.total?.toString().replace(/,/g, "");
    const amount = parseFloat(cleanedAmount);
    return total + (isNaN(amount) ? 0 : amount);
  }, 0);

  const finalAmount = isGSTApplied
    ? (grossAmount * 1.18).toFixed(2)
    : grossAmount.toFixed(2);

  useEffect(() => {
    console.log("row data", batchData);
    if (!batchData) return;
    setCaseCount(batchData.caseCount || "");
    setInvoiceNo(batchData.invoiceNo || "");
    setInvoiceDate(batchData.invoiceDate || "");
    setInvoiceAmount(batchData.invoiceAmount || "");
  }, [batchData]);

  useEffect(() => {
    if (!batchData) return;
    setLoading(true);
    if (batchData.aaNo) {
      const aaNumbers = batchData.aaNo.split(",").map((val) => val.trim());
      aaNumbers.forEach((aaNo, index) => {
        console.log(`aaNo ${index + 1}: ${aaNo}`);
      });

      Promise.all(
        aaNumbers.map((aaNo) =>
          fetch(`${BASE_URL}/GetGadgetCaseDetailsByAA?aaNumbers=${aaNo}`)
            .then((response) => {
              if (!response.ok) {
                console.error(`HTTP error for aaNo ${aaNo}: ${response.status}`);
                return { status: false, aA_Number: aaNo, dataItems: [] };
              }
              return response.json();
            })
            .then((responseData) => {
              if (!responseData || responseData.status === false) {
                return { status: false, aA_Number: aaNo, dataItems: [] };
              }
              return {
                status: responseData.status,
                aA_Number: aaNo,
                dataItems: Array.isArray(responseData.dataItems)
                  ? responseData.dataItems
                  : [],
              };
            })
            .catch((error) => {
              console.error(`Error fetching API data for ${aaNo}:`, error);
              return { status: false, aA_Number: aaNo, dataItems: [] };
            })
        )
      )
        .then((results) => {
          const combinedData = results.filter((item) => item);
          setApiData(combinedData);
        })
        .catch((error) => {
          console.error("Error in Promise.all:", error);
          setApiData([]);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [batchData]);

  useEffect(() => {
    if (!batchData) return;
    const splitData = (key) =>
      batchData[key]
        ?.split(",")
        .map((val) => (val === "NULL" ? "-" : val.trim())) || [];
    const invoicesArray = splitData("aaNo").map((_, i) => ({
      aA_Number: splitData("aaNo")[i],
      imeiNumber: splitData("imeiNo")[i],
      creationDate: batchData.creationDate || "",
      closureDate: batchData.closureDate || "",
      customerName: splitData("customerName")[i],
      serviceType: splitData("serviceType")[i],
      brand: splitData("brand")[i],
      makeModel: splitData("makeModel")[i],
      repairCharges: splitData("repairCharges")[i],
      chargesInclGST: splitData("chargesInclGST")[i],
      total: splitData("total")[i],
      invoiceStatus: batchData.invoiceStatus || "",
      sellingPartner: splitData("sellingPartner")[i],
      batchNo: batchData.batchNo || "",
      isChecked: true,
      comment: "",
    }));
    setInvoices(invoicesArray);
  }, [batchData]);

  const normalize = (value) =>
    (value ? value.toString().trim() : "").toLowerCase();

  const getRowClassName = useCallback(
    (invoice) => {
      if (!Array.isArray(apiData) || apiData.length === 0) return "row-red";
      const matchedData = apiData.find(
        (item) => item.aA_Number === invoice.aA_Number
      );
      if (!matchedData || matchedData.status === false) return "row-red";
      if (
        matchedData.status === true &&
        Array.isArray(matchedData.dataItems) &&
        matchedData.dataItems.length > 0
      ) {
        const dataItem = matchedData.dataItems[0];
        if (
          normalize(dataItem.serviceType) !== normalize(invoice.serviceType) ||
          normalize(dataItem.repairCharges) !==
            normalize(invoice.repairCharges) ||
          normalize(dataItem.total) !== normalize(invoice.total) ||
          normalize(dataItem.imeiNumber) !== normalize(invoice.imeiNumber) ||
          normalize(dataItem.sellingPartner) !==
            normalize(invoice.sellingPartner)
        ) {
          return "row-yellow";
        }
        return "row-green";
      }
      return "row-red";
    },
    [apiData]
  );

  const getDifferencesData = (invoice) => {
    const matchedData = apiData.find(
      (item) => item.aA_Number === invoice.aA_Number
    );
    if (!matchedData || matchedData.status === false)
      return [
        { field: "AA Number", table: invoice.aA_Number, api: "Not Found" },
      ];
    const dataItem = matchedData.dataItems[0] || {};
    const differences = [];
    if (normalize(dataItem.serviceType) !== normalize(invoice.serviceType)) {
      differences.push({
        field: "Service Type",
        table: invoice.serviceType || "-",
        api: dataItem.serviceType || "-",
      });
    }
    if (normalize(dataItem.imeiNumber) !== normalize(invoice.imeiNumber)) {
      differences.push({
        field: "IMEI Number",
        table: invoice.imeiNumber || "-",
        api: dataItem.imeiNumber || "-",
      });
    }
    if (
      normalize(dataItem.sellingPartner) !== normalize(invoice.sellingPartner)
    ) {
      differences.push({
        field: "Selling Partner",
        table: invoice.sellingPartner || "-",
        api: dataItem.sellingPartner || "-",
      });
    }
    if (normalize(dataItem.repairCharges) !== normalize(invoice.repairCharges)) {
      differences.push({
        field: "Repair Charges",
        table: invoice.repairCharges || "-",
        api: dataItem.repairCharges || "-",
      });
    }
    if (
      normalize(dataItem.chargesInclGST) !== normalize(invoice.chargesInclGST)
    ) {
      differences.push({
        field: "GST Charges",
        table: invoice.chargesInclGST || "-",
        api: dataItem.chargesInclGST || "-",
      });
    }
    if (normalize(dataItem.total) !== normalize(invoice.total)) {
      differences.push({
        field: "Total Amount",
        table: invoice.total || "-",
        api: dataItem.total || "-",
      });
    }
    return differences.length > 0 ? differences : [];
  };

  const handleDelete = (index) => {
    const updatedInvoices = invoices.filter((_, i) => i !== index);
    setInvoices(updatedInvoices);
  };

  const handleCheckboxChange = (invoiceId) => {
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.aA_Number === invoiceId
          ? { ...invoice, isChecked: !invoice.isChecked }
          : invoice
      )
    );
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const extension = file.name.split(".").pop().toLowerCase();
    setFileType(extension);
    setUploadedFile(file);
    if (extension === "csv") {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const row = results.data[0];
          setInvoiceNo(row["Invoice No"] || "");
          setInvoiceDate(row["Invoice Date"] || "");
          setInvoiceAmount(row["Invoice Amount"] || "");
          setCaseCount(row["Case Count"] || caseCount);
        },
        error: (err) => {
          console.error("CSV parsing error:", err);
          alert("Failed to read CSV file.");
        },
      });
    } else {
      console.log("Non-CSV file uploaded:", file.name);
    }
  };

  const downloadCSV = () => {
    const headers = [
      "AA Number",
      "IMEI Number",
      "Creation Date",
      "Closure Date",
      "Customer Name",
      "Service Type",
      "Brand",
      "Make Model",
      "Repair Charges",
      "GST Charges",
      "Total",
      "Comment",
    ];
    const today = new Date().toLocaleDateString("en-GB");
    const data = currentInvoices.map((invoice) => ({
      aaNumber: invoice.aA_Number || "",
      imeiNumber: invoice.imeiNumber || "",
      creationDate: today,
      closureDate: invoice.closureDate || "",
      customerName: invoice.customerName || "",
      serviceType: invoice.serviceType || "",
      brand: invoice.brand || "",
      makeModel: invoice.makeModel || "",
      repairCharges: invoice.repairCharges || "",
      chargesInclGST: invoice.chargesInclGST || "",
      total: invoice.total || "",
      comment: invoice.comment || "",
    }));
    const csv = Papa.unparse({
      fields: headers,
      data: data.map((row) => Object.values(row)),
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "invoice-list.csv");
  };

  const handleSubmit = async () => {
    try {
      const selected = invoices.filter((inv) => inv.isChecked);
      if (selected.length === 0) {
        alert("Please select at least one invoice.");
        return;
      }
      if (!uploadedFile) {
        const confirmProceed = window.confirm(
          "No invoice file uploaded. Do you want to continue without uploading?"
        );
        if (!confirmProceed) {
          return;
        }
      }
      if (uploadedFile) {
        const newErrors = {
          invoiceNo: !invoiceNo,
          invoiceDate: !invoiceDate,
          invoiceAmount: !invoiceAmount,
          caseCount: !caseCount,
        };
        setFieldErrors(newErrors);
        if (Object.values(newErrors).some(Boolean)) {
          alert("Please fill all required invoice fields.");
          return;
        }
        if (parseFloat(invoiceAmount) !== parseFloat(finalAmount)) {
          alert("Invoice Amount and Final Amount do not match.");
          return;
        }
        if (parseInt(caseCount) !== selectedAAno.length) {
          alert("Case Count does not match the number of selected services.");
          return;
        }
      }
      const formData = new FormData();
      const extract = (key) =>
        selected.map((item) => item[key] || "").join(", ");
      formData.append("AANo", extract("aA_Number"));
      formData.append("IMEINo", extract("imeiNumber"));
      formData.append("CreationDate", extract("creationDate"));
      formData.append("ClosureDate", extract("closureDate"));
      formData.append("CustomerName", extract("customerName"));
      formData.append("VendorName", batchData?.vendorName || "");
      formData.append("finalAmount", finalAmount);
      formData.append("TotalRepairCharges", totalRepairCharges.toFixed(2));
      formData.append("BatchNo", batchData?.batchNo || "");
      formData.append("ServiceType", extract("serviceType"));
      formData.append("Brand", extract("brand"));
      formData.append("MakeModel", extract("makeModel"));
      formData.append("RepairCharges", extract("repairCharges"));
      formData.append("Total", extract("total"));
      formData.append("SellingPartner", extract("sellingPartner"));
      formData.append(
        "InvoiceStatus",
        uploadedFile ? "Invoice Uploaded" : extract("invoiceStatus")
      );
      formData.append("InvoiceNo", invoiceNo || "");
      formData.append("InvoiceDate", invoiceDate || "");
      formData.append("InvoiceAmount", invoiceAmount || "");
      formData.append("CaseCount", caseCount || selected.length.toString());
      formData.append("IsGSTApplied", isGSTApplied ? "true" : "false");
      if (uploadedFile) {
        formData.append("Invoice", uploadedFile, uploadedFile.name);
      }
      console.log("FormData payload:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      const response = await fetch(`${BASE_URL}/SaveApprovalBatchData`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      console.log("API response:", result);
      if (!response.ok) {
        alert("Error submitting batch. Check the payload or try again.");
        return;
      }
      alert("Batch submitted successfully.");
      navigate(invoiceNo ? "/approval" : "/");
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Submission failed. Please check console for details.");
    }
  };

  return (
    <>
      <style>
        {`
          .row-red {
            background-color: #ffe6e6;
            color: #d32f2f;
          }
          .row-yellow {
            background-color: #fff9c4;
          }
          .row-green {
            background-color: #e8f5e9;
          }
          .approval-page-container {
            padding: 20px;
            max-width: 1400px;
            margin: 0 auto;
          }
        `}
      </style>
      <div className="approval-page-container">
        <h2 className="mb-4">Upload Invoice</h2>
        <div className="mt-4">
          <div className="netwrok_table_main_content">
            <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
              <div className="d-flex flex-wrap gap-4 align-items-center">
                {batchData?.batchNo && (
                  <div className="fw-semibold">
                    <span>Batch No: </span>
                    <span className="text-primary">{batchData.batchNo}</span>
                  </div>
                )}
                {batchData?.vendorName && (
                  <div className="fw-semibold">
                    <span>Vendor: </span>
                    <span className="text-success">{batchData.vendorName}</span>
                  </div>
                )}
              </div>
              <div className="d-flex gap-2">
                <button className="batch_popup_upload" onClick={handleClick}>
                  <FaUpload /> <span className="ms-2">Upload Invoice</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  accept="*"
                />
              </div>
            </div>
            <div className="text-end uplaod_file_ext_name">
              {fileType && (
                <div style={{ fontWeight: "bold", color: "green" }}>
                  Uploaded File Type: {fileType}
                </div>
              )}
            </div>
            <div className="table-responsive mt-3">
              <Table className="bg-white text-center border-0 network_table">
                <thead
                  style={{
                    backgroundColor: "#EEF4FF",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <tr className="text-dark fw-semibold table_th_border">
                    <th className="border-start">View</th>
                    <th>Edit</th>
                    <th style={{ whiteSpace: "nowrap" }}>AA No</th>
                    <th style={{ whiteSpace: "nowrap" }}>IMEI No</th>
                    <th style={{ whiteSpace: "nowrap" }}>Creation Date</th>
                    <th style={{ whiteSpace: "nowrap" }}>Closure Date</th>
                    <th style={{ whiteSpace: "nowrap" }}>Customer Name</th>
                    <th style={{ whiteSpace: "nowrap" }}>Service Type</th>
                    <th style={{ whiteSpace: "nowrap" }}>Brand</th>
                    <th style={{ whiteSpace: "nowrap" }}>Make Model</th>
                    <th style={{ whiteSpace: "nowrap" }}>Repair Charges</th>
                    <th style={{ whiteSpace: "nowrap" }}>Total</th>
                    <th style={{ whiteSpace: "nowrap" }}>Invoice Status</th>
                    <th style={{ whiteSpace: "nowrap" }}>Mismatched Data</th>
                    <th style={{ whiteSpace: "nowrap" }}>Remarks</th>
                    <th className="border-end" style={{ whiteSpace: "nowrap" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan="16" className="text-center py-3">
                        Validating data...
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    currentInvoices.map((invoice, index) => (
                      <tr
                        key={invoice.aA_Number || `${invoice.aA_Number}-${index}`}
                        className={`text-center border-bottom network_td_item ${getRowClassName(
                          invoice
                        )}`}
                        aria-label={
                          getRowClassName(invoice).replace("row-", "") + " row"
                        }
                      >
                        <td className="border-start align-middle">
                          <FaEye
                            className="text-purple review_fa_eye"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate("/invoice-template", {
                                state: { aaNumber: invoice.aA_Number },
                              })
                            }
                          />
                        </td>
                        <td className="align-middle">
                          <FaEdit
                            className="text-purple review_fa_eye"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate("/Edit-data", {
                                state: {
                                  invoice: invoice,
                                  batchData: batchData,
                                  remarks: invoice.comment || "",
                                },
                              })
                            }
                          />
                        </td>
                        <td className="align-middle">
                          {invoice.aA_Number || "-"}
                        </td>
                        <td className="align-middle">
                          {invoice.imeiNumber || "-"}
                        </td>
                        <td className="align-middle">
                          {new Date().toLocaleDateString("en-GB")}
                        </td>
                        <td className="align-middle">
                          {invoice.closureDate || "-"}
                        </td>
                        <td className="align-middle">
                          {invoice.customerName || "-"}
                        </td>
                        <td className="align-middle">
                          {invoice.serviceType || "-"}
                        </td>
                        <td className="align-middle">
                          {invoice.brand || "-"}
                        </td>
                        <td className="align-middle">
                          {invoice.makeModel || "-"}
                        </td>
                        <td className="align-middle">
                          {invoice.repairCharges || "-"}
                        </td>
                        <td className="align-middle">
                          {invoice.total || "-"}
                        </td>
                        <td className="align-middle">
                          <span
                            className="vendore_invoice_status px-3 py-1 rounded-pill"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {invoice.invoiceStatus || "-"}
                          </span>
                        </td>
                        <td
                          className="align-middle position-relative"
                          onMouseEnter={() => setHoveredRow(index)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          {getDifferencesData(invoice).length > 0
                            ? "Mismatch"
                            : "Valid"}
                          {hoveredRow === index &&
                            getDifferencesData(invoice).length > 0 && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "100%",
                                  left: "-18%",
                                  transform: "translateX(-50%)",
                                  zIndex: 1000,
                                  backgroundColor: "#fff",
                                  border: "1px solid #ddd",
                                  padding: "10px",
                                  boxShadow:
                                    "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                  minWidth: "300px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <table className="table table-sm table-bordered mb-0">
                                  <thead>
                                    <tr>
                                      <th>Field</th>
                                      <th>Excel Data</th>
                                      <th>System Data</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {getDifferencesData(invoice).map(
                                      (diff, i) => (
                                        <tr key={i}>
                                          <td>{diff.field}</td>
                                          <td>{diff.table}</td>
                                          <td>{diff.api}</td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            )}
                        </td>
                        <td className="align-middle">
                          {invoice.comment || "no comment"}
                        </td>
                        <td className="align-middle border-end">
                          <FaTrash
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDelete(index)}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div
                className="batch_popup_gross_ammount p-3 d-inline-block"
                style={{ backgroundColor: "#eef4ff", marginTop: "1rem" }}
              >
                <span className="fw-semibold text-secondary me-2">
                  Total no of selected Service:
                </span>
                <span className="fw-bold text-dark">
                  {selectedAAno.length}
                </span>
              </div>
              <div
                className="batch_popup_gross_ammount"
                style={{ backgroundColor: "#eef4ff", marginTop: "1rem" }}
              >
                <div className="text-start batch_popup_amount">
                  <div className="fw-bold batch_gross">
                    Total Repair Charges
                  </div>
                  <div className="batch_amount_to_fix">
                    ₹ {parseFloat(totalRepairCharges).toFixed(2)}
                  </div>
                </div>
                <div className="text-start batch_popup_amount">
                  <div className="fw-bold batch_gross">
                    Total Gross Amount
                  </div>
                  <div className="batch_amount_to_fix">
                    ₹ {grossAmount.toFixed(2)}
                  </div>
                </div>
                <div className="text-start batch_popup_amount">
                  <div className="fw-bold batch_gross">Final Amount</div>
                  <div className="batch_amount_to_fix">₹ {finalAmount}</div>
                  <div className="batch_gross ms-3">
                    Charges ({isGSTApplied ? "incl GST 18%" : "excl GST"})
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center border rounded p-3 mt-4">
              <div className="fw-bold ms-2">
                <span>GST</span>
              </div>
              <div className="d-flex gap-3">
                <label className="regestration_kc_radio">
                  <input
                    type="radio"
                    name="kcApplication"
                    id="kcApplicationYes"
                    value="Yes"
                    checked={isGSTApplied === true}
                    onChange={() => setIsGSTApplied(true)}
                  />
                  <span className="regestration_applied_yes">Yes</span>
                </label>
                <span className="mx-1">/</span>
                <label className="regestration_kc_radio">
                  <input
                    type="radio"
                    name="kcApplication"
                    id="kcApplicationNo"
                    value="No"
                    checked={isGSTApplied === false}
                    onChange={() => setIsGSTApplied(false)}
                  />
                  <span className="regestration_applied_yes">No</span>
                </label>
              </div>
            </div>
            <div>
              <form className="mt-4 invoice_form">
                <div className="row align-items-center">
                  <div className="col-md-4 align-items-center mb-3">
                    <label className="me-2 fw-semibold w-50">
                      Case Count
                    </label>
                    <input
                      type="text"
                      className={`form-control border-dark ${
                        uploadedFile && fieldErrors.caseCount
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter Case Count"
                      value={caseCount}
                      onChange={(e) => setCaseCount(e.target.value)}
                    />
                    {uploadedFile && fieldErrors.caseCount && (
                      <div
                        className="text-danger mt-1"
                        style={{ fontSize: "14px" }}
                      >
                        Case Count is required.
                      </div>
                    )}
                  </div>
                  <div className="col-md-4 align-items-center mb-3">
                    <label className="me-2 fw-semibold w-50">
                      Invoice No
                    </label>
                    <input
                      type="text"
                      className={`form-control border-dark ${
                        uploadedFile && fieldErrors.invoiceNo
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter Invoice No"
                      value={invoiceNo}
                      onChange={(e) => setInvoiceNo(e.target.value)}
                    />
                    {uploadedFile && fieldErrors.invoiceNo && (
                      <div
                        className="text-danger mt-1"
                        style={{ fontSize: "14px" }}
                      >
                        Invoice No is required.
                      </div>
                    )}
                  </div>
                  <div className="col-md-4 align-items-center mb-3">
                    <label className="me-2 fw-semibold w-50">
                      Invoice Date
                    </label>
                    <input
                      type="date"
                      className={`form-control border-dark ${
                        uploadedFile && fieldErrors.invoiceDate
                          ? "is-invalid"
                          : ""
                      }`}
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      max={new Date().toISOString().split("T")[0]}
                    />
                    {uploadedFile && fieldErrors.invoiceDate && (
                      <div
                        className="text-danger mt-1"
                        style={{ fontSize: "14px" }}
                      >
                        Invoice Date is required.
                      </div>
                    )}
                  </div>
                  <div className="col-md-4 align-items-center mb-3">
                    <label className="me-2 fw-semibold w-50">
                      Invoice Amount
                    </label>
                    <input
                      type="text"
                      className={`form-control border-dark ${
                        uploadedFile &&
                        (fieldErrors.invoiceAmount || amountError)
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter Invoice Amount"
                      value={invoiceAmount}
                      onChange={(e) => {
                        const enteredAmount = e.target.value;
                        setInvoiceAmount(enteredAmount);
                        if (uploadedFile) {
                          if (
                            parseFloat(enteredAmount) !==
                            parseFloat(finalAmount)
                          ) {
                            setAmountError(
                              "Invoice Amount and Final Amount do not match."
                            );
                          } else {
                            setAmountError("");
                          }
                        }
                      }}
                    />
                    {uploadedFile && fieldErrors.invoiceAmount && (
                      <div
                        className="text-danger mt-1"
                        style={{ fontSize: "14px" }}
                      >
                        Invoice Amount is required.
                      </div>
                    )}
                    {amountError && (
                      <div
                        className="text-danger mt-1"
                        style={{ fontSize: "14px" }}
                      >
                        {amountError}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
            <div className="d-flex mt-4 justify-content-center align-items-center flex-wrap gap-3">
              <Button
                onClick={downloadCSV}
                className="d-flex align-items-center"
                style={{
                  backgroundColor: "rgb(248 238 255)",
                  border: "1px solid #8000d7",
                  padding: "10px 50px",
                  borderRadius: "8px",
                  fontWeight: "500",
                  fontSize: "16px",
                  color: "#8000d7",
                }}
              >
                <FaDownload />
                <span className="ms-2">Download</span>
              </Button>
              <Button
                onClick={handleSubmit}
                className="d-flex align-items-center"
                style={{
                  backgroundColor: "#8000d7",
                  border: "none",
                  padding: "10px 50px",
                  borderRadius: "8px",
                  fontWeight: "500",
                  fontSize: "16px",
                  color: "white",
                }}
              >
                <span className="ms-2">Submit</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ApprovalBatchPage;