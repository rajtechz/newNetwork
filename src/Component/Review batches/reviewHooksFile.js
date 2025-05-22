// src/hooks/useInvoices.js
import { useState, useEffect, useRef } from "react";
import { fetchBatchInvoiceData } from "../../api/api"

export const ReviewHooksFile = () => {
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

  const invoiceOptions = ["Invoice", "Approved", "Hold", "Rejected", "Submitted"];
  const financeOptions = ["Paid", "Approved", "Hold", "Query", "Bank", "Rejected"];

  const vendorList = Array.isArray(invoicesData)
    ? invoicesData.map(({ vendorName, srnNo }) => ({ vendorName, srnNo }))
    : [];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Batch":
        return "batch_badge_orange";
      case "Approved":
        return "approved_badge_green";
      case "Submitted":
        return "submitted_badge_red";
      case "Invoice":
        return "invoice_badge_blue";
      case "Hold":
        return "batch_badge_orange";
      case "Rejected":
        return "rejected_badge_red";
      case "Paid":
        return "paid_badge_red";
      case "Query":
        return "query_badge_red";
      default:
        return "badge-gray";
    }
  };

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
        if (!inv.batchCreationDate) return false;
        const creationDateObj = new Date(inv.batchCreationDate);

        const vendorName = inv.vendorName?.toLowerCase() || "";
        const srnNo = inv.srnNo?.toLowerCase() || "";
        const batchNo = inv.batchNo?.toLowerCase() || "";
        const financeStatus = inv.financeStatus?.toLowerCase() || "";
        const invoiceNumber = inv.invoiceNumber?.toLowerCase() || "";

        const vendorMatch = vendorName.includes(vendorSearch.toLowerCase());
        const srnMatch = srnNo.includes(srnSearch.toLowerCase());
        const batchMatch = batchNo.includes(batchSearch.toLowerCase());
        const invoiceNoMatch = invoiceNumber.includes(searchInvoiceNo.toLowerCase());

        const dateMatch = selectedDate
          ? creationDateObj.toDateString() === selectedDate.toDateString()
          : true;

        const statusMatch = selectedStatus
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
  const currentInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);

  const handleInvoiceStatusChange = (index, newStatus) => {
    setInvoicesData((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              invoiceStatus: newStatus,
              financeStatus: newStatus === "Approved" ? "Submitted" : "",
            }
          : item
      )
    );
  };

  const handleFinanceStatusChange = (index, newStatus) => {
    setInvoicesData((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const isNotApproved = newStatus !== "Approved";
          return {
            ...item,
            financeStatus: newStatus,
            invoiceStatus: isNotApproved ? "Hold" : item.invoiceStatus,
          };
        }
        return item;
      })
    );
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

  return {
    invoicesData,
    currentInvoices,
    vendorList,
    vendorSearch,
    srnSearch,
    searchInvoiceNo,
    batchSearch,
    selectedDate,
    selectedStatus,
    showHoldModal,
    currentPage,
    totalPages,
    loading,
    invoiceOptions,
    financeOptions,
    dateInputRef,
    getStatusBadgeClass,
    setVendorSearch,
    setSrnSearch,
    setSeachInvoiceNo,
    setBatchSearch,
    setSelectedDate,
    setSelectedStatus,
    setShowHoldModal,
    setCurrentPage,
    handleNext,
    handlePrevious,
    handleIconClick,
    handleInvoiceStatusChange,
    handleFinanceStatusChange,
  };
};
