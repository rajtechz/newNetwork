import React, { useState, useRef, useEffect } from "react";
import Header from "../Header/header";
import { IoFilterSharp } from "react-icons/io5";
import { FaFilePdf } from "react-icons/fa";
import { Dropdown, Table, Button } from "react-bootstrap";
import { FaChevronDown, FaEye } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import Search_vendor_popup from "./search_vendor_popup";
import pdf_img from "../images/pdf_downlaod.png";
import random_pdf from "../images/dummy-pdf_2.pdf";
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import BatchPopup from "./batchPopup";
import Chip from "@mui/material/Chip";
// import { FaChevronDown } from "react-icons/fa";
import {
  fetchBatchInvoiceData,
  updateBatchInvoiceStatus,
  updateBatchFinanceStatus,
} from "../../api/api";
import { Circles } from "react-loader-spinner";
// import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReviewHooksFile } from "./reviewHooksFile";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Review_batches() {
  const [showHoldModalBatch, setShowHoldModalBatch] = useState(false);
  const [selectedBatchData, setSelectedBatchData] = useState(null);
  // Later in your component:
  const closePopup = () => {
    setShowHoldModalBatch(false);
  };

  const [invoicesData, setInvoicesData] = useState([]);
  const [vendorSearch, setVendorSearch] = useState("");
  const [srnSearch, setSrnSearch] = useState("");
  const [searchInvoiceNo, setSeachInvoiceNo] = useState("");
  const [batchSearch, setBatchSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showHoldModal, setShowHoldModal] = useState(false);
  const itemsPerPage = 8;
  const dateInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const vendorList = Array.isArray(invoicesData)
    ? invoicesData.map(({ vendorName, srnNo }) => ({ vendorName, srnNo }))
    : [];

  const handleIconClick = () => {
    dateInputRef.current?.setFocus();
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const filteredInvoices = Array.isArray(invoicesData)
    ? invoicesData.filter((inv) => {
        // Remove the strict date requirement
        // if (!inv.batchCreationDate) return false;

        const creationDateObj = inv.batchCreationDate
          ? new Date(inv.batchCreationDate)
          : null;

        const vendorName = inv.vendorName?.toString().toLowerCase() || "";
        const srnNo = inv.srnNo?.toString().toLowerCase() || "";
        const batchNo = inv.batchNo?.toString().toLowerCase() || "";
        const financeStatus = inv.financeStatus?.toString().toLowerCase() || "";
        const invoiceNumber = inv.invoiceNumber?.toString().toLowerCase() || "";

        const vendorMatch = vendorName.includes(vendorSearch.toLowerCase());
        const srnMatch = srnNo.includes(srnSearch.toLowerCase());
        const batchMatch = batchNo.includes(batchSearch.toLowerCase());
        const invoiceNoMatch = invoiceNumber.includes(
          searchInvoiceNo.toLowerCase()
        );

        const dateMatch = selectedDate
          ? creationDateObj &&
            creationDateObj.toDateString() === selectedDate.toDateString()
          : true;

        const statusMatch =
          selectedStatus && selectedStatus !== "All"
            ? financeStatus === selectedStatus.toLowerCase()
            : true;

        return (
          vendorMatch &&
          srnMatch &&
          batchMatch &&
          dateMatch &&
          statusMatch &&
          invoiceNoMatch
        );
      })
    : [];

  useEffect(() => {
    setCurrentPage(1);
  }, [
    vendorSearch,
    srnSearch,
    batchSearch,
    selectedDate,
    selectedStatus,
    searchInvoiceNo,
  ]);

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  console.log(currentInvoices, "cureent invoce data");

  const handleInvoiceStatusChange = async (index, newStatus) => {
    const globalIndex = indexOfFirstItem + index;
    const selectedInvoice = invoicesData[globalIndex];
    const batchNo = selectedInvoice?.batchNo;

    console.log("Updating invoice status...");
    console.log("Selected Batch No:", batchNo);
    console.log("New Status:", newStatus);

    try {
      const reason = newStatus === "Rejected" ? "Some rejection reason" : "";

      const response = await updateBatchInvoiceStatus({
        batchNo,
        status: newStatus,
        reason,
      });

      setInvoicesData((prev) =>
        prev.map((item, i) =>
          i === globalIndex
            ? {
                ...item,
                invoiceStatus: newStatus,
                financeStatus: newStatus === "Approved" ? "Submitted" : "",
              }
            : item
        )
      );

      toast.success("Invoice status updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error("Failed to update invoice status.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleFinanceStatusChange = async (index, newStatus) => {
    const globalIndex = indexOfFirstItem + index;
    const selectedInvoice = invoicesData[globalIndex];
    const batchNo = selectedInvoice?.batchNo;

    console.log("Updating finance status...");
    console.log("Selected Batch No:", batchNo);
    console.log("New Finance Status:", newStatus);
    try {
      const reason = newStatus === "Rejected" ? "Finance rejected" : "";

      const response = await updateBatchFinanceStatus({
        batchNo,
        status: newStatus,
        reason,
      });

      setInvoicesData((prev) =>
        prev.map((item, i) =>
          i === globalIndex
            ? {
                ...item,
                financeStatus: newStatus,
                invoiceStatus:
                  newStatus !== "Approved" ? "Hold" : item.invoiceStatus,
              }
            : item
        )
      );

      toast.success("Finance status updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error("Failed to update finance status.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const data = await fetchBatchInvoiceData();
        if (Array.isArray(data.dataItems)) {
          setInvoicesData(data.dataItems);
        } else {
          setInvoicesData([]);
        }
      } catch (err) {
        console.error("Failed to load invoice data", err);
        setInvoicesData([]);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // console.log(currentInvoices, "current Invoice");
  const totalGrossAmount = invoicesData.reduce(
    (total, invoice) => total + (parseFloat(invoice.grossAmount) || 0),
    0
  );
  ///////////////////////////// uplaod invoce
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click(); // Trigger the hidden input
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      console.log("Selected PDF:", file.name);
      // Handle file upload logic here (e.g. send to backend)
    } else {
      alert("Please select a valid PDF file.");
    }
  };
  return (
    <div>
      {/* <Header /> */}
      <ToastContainer />
      <div className="container mt-4">
        <div className="netwrok_table_main_content">
          <div className="d-flex justify-content-between  network_filter_div">
            <h5 className="fw-bold m-0">Review Batches</h5>


            <button
              className="btn btn-primary d-flex align-items-center"
              style={{
                backgroundColor: "#8000d7", 
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: "500",
                fontSize: "16px",
              }}
              onClick={() => setShowHoldModal(true)}
            >
              <FaCirclePlus className="me-2" />
              Create Batch
            </button>
          </div>
          <div className="d-flex justify-content-between  network_filter_div">
            <div className="d-flex justify-content-between align-items-center all_search_input">
              <div
                className="review_batch_seach input-group"
                style={{ maxWidth: "280px" }}
              >
                <div className="fa_search_main">
                  <span className="input-group-text bg-light fasearch">
                    <FaSearch className="text-muted" />
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control bg-light border-start-0"
                  placeholder="Search by Vendor Name"
                  value={vendorSearch}
                  onChange={(e) => setVendorSearch(e.target.value)}
                  style={{ borderLeft: "none", boxShadow: "none" }}
                />
              </div>
              <div
                className="review_batch_seach input-group"
                style={{ maxWidth: "240px" }}
              >
                <div className="fa_search_main">
                  <span className="input-group-text bg-light fasearch">
                    <FaSearch className="text-muted" />
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control bg-light border-start-0"
                  placeholder="Search by Invoice No"
                  value={searchInvoiceNo}
                  onChange={(e) => setSeachInvoiceNo(e.target.value)}
                  style={{ borderLeft: "none", boxShadow: "none" }}
                />
              </div>
              <div
                className="review_batch_seach input-group"
                style={{ maxWidth: "240px" }}
              >
                <div className="fa_search_main">
                  <span className="input-group-text bg-light fasearch">
                    <FaSearch className="text-muted" />
                  </span>
                </div>
                <input
                  type="number"
                  className="form-control bg-light border-start-0"
                  placeholder="Search by Batch No"
                  value={batchSearch}
                  onChange={(e) => setBatchSearch(e.target.value)}
                  style={{ borderLeft: "none", boxShadow: "none" }}
                />
              </div>
            </div>

            <div className="d-flex justify-content-between  all_search_input">
              <div
                className="custom_date_wrapper review_batch_seach"
                style={{ maxWidth: "240px" }}
              >
                <DatePicker
                  ref={dateInputRef}
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="dd-mm-yyyy"
                  className="custom-date-input"
                />
                <span className="calendar-icon" onClick={handleIconClick}>
                  <FaRegCalendarAlt />
                </span>
              </div>
              <div
                className=" input-group review_batch_status"
                style={{ maxWidth: "240px" }}
              >
                <select
                  className="form-select bg-light custom-status-dropdown"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Hold">Hold</option>
                  <option value="All">All</option>
                </select>
              </div>
            </div>
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
                    <th className="border-start">View</th>
                    {/* <th style={{ whiteSpace: "nowrap" }}>AA no</th> */}
                    <th style={{ whiteSpace: "nowrap" }}>Batch No</th>
                    <th style={{ whiteSpace: "nowrap" }}>Vendor Name</th>
                    <th style={{ whiteSpace: "nowrap" }}>
                      Batch Creation Date
                    </th>
                    <th style={{ whiteSpace: "nowrap" }}>Batch Closure Date</th>
                    <th style={{ whiteSpace: "nowrap" }}>Invoice No</th>
                    <th style={{ whiteSpace: "nowrap" }}>Invoice Date</th>
                    <th style={{ whiteSpace: "nowrap" }}>Invoice Amount</th>
                    <th style={{ whiteSpace: "nowrap" }}>Final Amount</th>
                    <th style={{ whiteSpace: "nowrap" }}>Gross Amount</th>
                    <th style={{ whiteSpace: "nowrap" }}>
                      Total Service Charge
                    </th>
                    <th style={{ whiteSpace: "nowrap" }}>
                      Total Repair Charge
                    </th>
                    <th style={{ whiteSpace: "nowrap" }}>Remarks</th>
                    {/* <th style={{ whiteSpace: "nowrap" }}>Upload invoice</th> */}
                    <th style={{ whiteSpace: "nowrap" }}>Invoice Status</th>
                    {/* <th className="border-end" style={{ whiteSpace: "nowrap" }}>
                      Finance Status
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {currentInvoices.map((invoice, index) => (
                    <tr
                      key={index}
                      className="text-center border-bottom network_td_item"
                    >
                      <td
                        className="border-start align-middle cursor-pointer"
                        onClick={() => {
                          setSelectedBatchData(invoice); // or the array of records
                          setShowHoldModalBatch(true);
                        }}
                      >
                        <FaEye
                          className="text-purple review_fa_eye"
                          onClick={() => {
                            console.log("Clicked invoice row:", invoice); // 👈 This will log the row data

                            const splitData = (key) =>
                              invoice[key]?.split(",").map((v) => v.trim()) ||
                              [];

                            const invoicesArray = splitData("aaNo").map(
                              (_, i) => ({
                                aA_Number: splitData("aaNo")[i] || "",
                                imeiNumber: splitData("imeiNo")[i] || "",
                                creationDate: invoice.creationDate || "",
                                closureDate: invoice.closureDate || "",
                                customerName:
                                  splitData("customerName")[i] || "",
                                serviceType: splitData("serviceType")[i] || "",
                                brand: splitData("brand")[i] || "",
                                makeModel: splitData("makeModel")[i] || "",
                                repairCharges:
                                  splitData("repairCharges")[i] || "",
                                // chargesIncGST:
                                //   splitData("chargesInclGST")[i] || "",
                                total: splitData("total")[i] || "",
                                invoiceStatus: invoice.invoiceStatus || "",
                                sellingPartner:
                                  splitData("sellingPartner")[i] || "",
                              })
                            );

                            setSelectedBatchData({
                              vendorName: invoice.vendorName,
                              invoiceList: invoicesArray,
                            });

                            setShowHoldModalBatch(true);
                          }}
                        />
                      </td>

                      <td className="align-middle">
                        {invoice.batchNo ?? "--"}
                      </td>
                      <td className="align-middle">
                        {invoice.vendorName ?? "--"}
                      </td>
                      <td className="align-middle">
                        {invoice.creationDate
                          ? new Date(invoice.creationDate).toLocaleDateString(
                              "en-GB"
                            )
                          : "--"}
                      </td>
                      <td className="align-middle">
                        {invoice.batchClosureDate
                          ? new Date(
                              invoice.batchClosureDate
                            ).toLocaleDateString("en-GB")
                          : "--"}
                      </td>
                      <td className="align-middle">
                        {invoice.invoiceNumber ?? "--"}
                      </td>
                      <td className="align-middle">
                        {invoice.invoiceDate
                          ? new Date(invoice.invoiceDate).toLocaleDateString(
                              "en-GB"
                            )
                          : "--"}
                      </td>
                      <td className="align-middle">
                        {invoice.invoiceAmount ?? "--"}
                      </td>
                      <td className="align-middle">
                        {invoice.finalAmount ?? "--"}
                      </td>
                      <td className="align-middle">
                        ₹{totalGrossAmount.toLocaleString() ?? "--"}
                      </td>
                      <td className="align-middle">
                        ₹{invoice.totalServiceCharges ?? "0"}
                      </td>
                      <td className="align-middle">
                        ₹{invoice.totalRepairCharges ?? "0"}
                      </td>
                      <td className="align-middle">
                        {invoice.remarks ?? "No Remarks"}
                      </td>
                      {/* <td className="align-middle">
                        <button type="button" onClick={handleUploadClick}>
                          Upload Invoice
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="application/pdf"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                      </td> */}
                      {/* Invoice Status Dropdown */}
                      <td className="align-middle">
                        <Chip
                          label={invoice.invoiceStatus}
                          variant="outlined"
                          sx={{
                            // borderColor: "#046C4E",
                            // backgroundColor: "#BCF0DA",
                            color: "#31C48D",
                          }}
                        />
                      </td>

                      {/* Finance Status Dropdown */}
                      {/* <td className="align-middle border-end">
                        {invoice.financeStatus === "" ? (
                          <div className="network_table_main">
                            <span className="custom-dropdown-toggle network_table_approve">
                              --
                            </span>
                          </div>
                        ) : (
                          <Dropdown className="network_table_main">
                            <Dropdown.Toggle
                              className={`custom-dropdown-toggle network_table_approve ${getStatusBadgeClass(
                                invoice.financeStatus
                              )}`}
                            >
                              {invoice.financeStatus}{" "}
                              <FaChevronDown className="dropdown-icon" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="custom-dropdown-menu">
                              {financeOptions.map((status) => (
                                <Dropdown.Item
                                  key={status}
                                  onClick={() =>
                                    handleFinanceStatusChange(index, status)
                                  }
                                  className="custom-dropdown-item"
                                >
                                  {status}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                      </td> */}
                    </tr>
                  ))}
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
            <span className="page-info ">
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
        </div>
      </div>
      <Search_vendor_popup
        show={showHoldModal}
        handleClose={() => setShowHoldModal(false)}
        vendors={vendorList}
      />

      <BatchPopup
        show={showHoldModalBatch}
        handleClose={closePopup}
        selectedBatchData={selectedBatchData}
      />
    </div>
  );
}

export default Review_batches;
