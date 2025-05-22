import React, { useState, useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchVendorSuggestions } from "../../api/api";

const Search_vendor_popup = ({ show, handleClose }) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [noProvidersFound, setNoProvidersFound] = useState(false); // NEW
  const [hasManuallySelectedVendor, setHasManuallySelectedVendor] =
    useState(false);

  const getVendorSuggestions = async (query) => {
    try {
      const result = await fetchVendorSuggestions(query);

      if (result?.status === true && result?.dataItems?.length > 0) {
        const mapped = result.dataItems.map((item) => ({
          id: item.id,
          vendorName: item.serviceProviderName,
        }));
        setFilteredVendors(mapped);
        setNoProvidersFound(false); // Reset
      } else {
        setFilteredVendors([]);
        setNoProvidersFound(true); // Show "no providers"
      }
    } catch (error) {
      console.error("Failed to fetch vendor suggestions:", error);
      setFilteredVendors([]);
      setNoProvidersFound(true);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (hasManuallySelectedVendor) {
        setHasManuallySelectedVendor(false); // Skip this round
        return;
      }

      if (searchText.trim() !== "") {
        getVendorSuggestions(searchText);
      } else {
        setFilteredVendors([]);
        setNoProvidersFound(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const handleVendorClick = (vendor) => {
    setSearchText(`${vendor.vendorName} (${vendor.id})`);
    setSelectedVendorId(vendor.id);
    setFilteredVendors([]);
    setNoProvidersFound(false);
    setHasManuallySelectedVendor(true); // NEW
  };

  // const handleSubmit = () => {
  //   handleClose({ vendorId: selectedVendorId, vendorText: searchText });
  //   navigate("/vendor-name", { state: { vendorId: selectedVendorId } });
  // };
  const handleSubmit = () => {
    const vendorName = searchText.split(" (")[0]; // Extract name before " (ID)"

    console.log("Selected Vendor ID:", selectedVendorId);
    console.log("Search Text:", searchText);
    console.log("Vendor Name (extracted):", vendorName);

    handleClose({ vendorId: selectedVendorId, vendorText: searchText });
    navigate("/vendor-name", {
      state: { vendorName, vendorId: selectedVendorId },
    });
  };
  return (
    <Modal
      show={show}
      onHide={() => handleClose(null)}
      centered
      className="hold_reason_modal"
      backdrop="static"
    >
      <Modal.Header
        style={{ backgroundColor: "#e6f0ff" }}
        closeButton
        className="hold_popup_header"
      >
        <Modal.Title>Search Vendor</Modal.Title>
      </Modal.Header>
      <Modal.Body className="hold_popup_body">
        <Form className="hold_popup_input">
          <Form.Group controlId="holdReason">
            <Form.Label>Search Vendor Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search vendor name"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              autoComplete="off"
            />
            {filteredVendors.length > 0 && (
              <ul className="vendor-suggestion-list suggestion_list">
                {filteredVendors.map((vendor) => (
                  <li
                    key={vendor.id}
                    onClick={() => handleVendorClick(vendor)}
                    className="suggestion-item"
                  >
                    (ID: {vendor.id})  {vendor.vendorName}
                  </li>
                ))}
              </ul>
            )}
            {noProvidersFound && (
              <div className="no-results-found text-danger mt-2">
                No providers found.
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center hold_popup_btn">
        <button
          onClick={handleSubmit}
          disabled={!selectedVendorId || !searchText.trim()}
        >
          Submit
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default Search_vendor_popup;
