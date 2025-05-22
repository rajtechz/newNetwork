// import React, { useState, useRef } from "react";
// import { Modal } from "react-bootstrap";
// import { useLocation } from "react-router-dom";
// import { raiseConcern } from "../../api/api";

// const Raise_concern_popup = ({ show, handleClose }) => {
//   const fileInputRef = useRef(null);
//   const location = useLocation();
//   const aaNumber = location.state?.aaNumber;

//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [status, setStatus] = useState("");
//   const [remarkCategory, setRemarkCategory] = useState("");
//   const [remarkIssue, setRemarkIssue] = useState("");
//   const [file, setFile] = useState(null);

//   const handleClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const droppedFile = e.dataTransfer.files[0];
//     setFile(droppedFile);
//     updateFileInput(droppedFile);
//   };

//   const updateFileInput = (newFile) => {
//     const dt = new DataTransfer();
//     dt.items.add(newFile);
//     fileInputRef.current.files = dt.files;
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile);
//     updateFileInput(selectedFile);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Console log all form data
//     console.log("Submitting concern with data:");
//     console.log({
//       Date: date,
//       Time: time,
//       Status: status,
//       RemarkCategory: remarkCategory,
//       RemarkIssue: remarkIssue,
//       SRN_No: aaNumber,
//       File: file,
//     });

//     const formData = new FormData();
//     formData.append("Date", date);
//     formData.append("Time", time);
//     formData.append("Status", status);
//     formData.append("RemarkCategory", remarkCategory);
//     formData.append("RemarkIssue", remarkIssue);
//     formData.append("SRN_No", aaNumber);
//     if (file) formData.append("Image", file);

//     try {
//       const response = await raiseConcern(formData);
//       alert("Concern raised successfully!");
//       handleClose();
//     } catch (err) {
//       alert("Failed to raise concern. Please try again.");
//     }
//   };

//   return (
//     <Modal
//       show={show}
//       onHide={handleClose}
//       centered
//       className="hold_reason_modal raise_concern_popup"
//       backdrop="static"
//     >
//       <Modal.Header
//         style={{ backgroundColor: "#e6f0ff" }}
//         closeButton
//         className="hold_popup_header"
//       >
//         <Modal.Title>Raise Concern</Modal.Title>
//       </Modal.Header>
//       <Modal.Body className="hold_popup_body">
//         <form className="raise_concern_popup_form" onSubmit={handleSubmit}>
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h5 className="mb-0 fw-bold">Vendor Name</h5>
//             <div className="bg-light border px-3 py-1 rounded-3 text-muted">
//               AA no - <strong>{aaNumber}</strong>
//             </div>
//           </div>

//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label htmlFor="inputDate" className="form-label fw-semibold">
//                 Date
//               </label>
//               <input
//                 type="date"
//                 id="inputDate"
//                 className="form-control py-3"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//               />
//             </div>
//             <div className="col-md-6 mb-3">
//               <label htmlFor="inputTime" className="form-label fw-semibold">
//                 Time
//               </label>
//               <input
//                 type="time"
//                 id="inputTime"
//                 className="form-control py-3"
//                 value={time}
//                 onChange={(e) => setTime(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="mb-3">
//             <label htmlFor="selectStatus" className="form-label fw-semibold">
//               Status
//             </label>
//             <select
//               id="selectStatus"
//               className="form-select py-3"
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               required
//             >
//               <option value="" disabled hidden>
//                 Select Status
//               </option>
//               <option value="approved">Approved</option>
//               <option value="pending">Pending</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>

//           <div className="mb-3">
//             <label htmlFor="selectCategory" className="form-label fw-semibold">
//               Remarks Category
//             </label>
//             <select
//               id="selectCategory"
//               className="form-select py-3"
//               value={remarkCategory}
//               onChange={(e) => setRemarkCategory(e.target.value)}
//               required
//             >
//               <option value="" disabled hidden>
//                 Select Remarks Category
//               </option>
//               <option value="technical">Technical</option>
//               <option value="service">Service</option>
//               <option value="other">Other</option>
//             </select>
//           </div>

//           <div className="mb-3">
//             <label htmlFor="textareaIssue" className="form-label fw-semibold">
//               Remarks Issue
//             </label>
//             <textarea
//               id="textareaIssue"
//               className="form-control rounded-2"
//               rows="4"
//               placeholder="Enter your issues"
//               value={remarkIssue}
//               onChange={(e) => setRemarkIssue(e.target.value)}
//               required
//             ></textarea>
//           </div>

//           <div
//             onClick={handleClick}
//             onDragOver={(e) => e.preventDefault()}
//             onDrop={handleDrop}
//             className="text-center p-4"
//             style={{
//               border: "1px dashed #ccc",
//               borderRadius: "8px",
//               cursor: "pointer",
//             }}
//           >
//             <input
//               type="file"
//               ref={fileInputRef}
//               className="d-none"
//               onChange={handleFileChange}
//             />
//             <p className="mt-2 mb-0 text-muted raise_drag">
//               Drag and drop or <span className="text-primary">browse</span> your files
//             </p>
//             {file && <p className="mt-2 text-success">File selected: {file.name}</p>}
//           </div>

//           <div className="text-center mt-4">
//             <button
//               type="submit"
//               className="btn btn-primary px-5 py-2"
//               style={{
//                 backgroundColor: "#8000d7",
//                 border: "none",
//                 fontWeight: "500",
//                 fontSize: "16px",
//               }}
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default Raise_concern_popup;

import React, { useState, useRef, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { raiseConcern } from "../../api/api";

const Raise_concern_popup = ({ show, handleClose }) => {
  const fileInputRef = useRef(null);
  const location = useLocation();
  const aaNumber = location.state?.aaNumber;

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    status: "",
    remarkCategory: "",
    remarkIssue: "",
    file: null,
  });

  const [errors, setErrors] = useState({
    date: "",
    time: "",
    status: "",
    remarkCategory: "",
    remarkIssue: "",
    file: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal is closed
  useEffect(() => {
    if (!show) {
      setFormData({
        date: "",
        time: "",
        status: "",
        remarkCategory: "",
        remarkIssue: "",
        file: null,
      });
      setErrors({
        date: "",
        time: "",
        status: "",
        remarkCategory: "",
        remarkIssue: "",
        file: "",
      });
    }
  }, [show]);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateFile(selectedFile);
  };

  const validateFile = (file) => {
    let error = "";
    if (file) {
      // Check file type (allow images and PDFs)
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        // "application/pdf",
      ];
      if (!validTypes.includes(file.type)) {
        error = "Only images (JPEG, PNG, GIF) and PDF files are allowed";
      }
      // Check file size (5MB max)
      else if (file.size > 5 * 1024 * 1024) {
        error = "File size must be less than 5MB";
      }
    }

    setErrors((prev) => ({ ...prev, file: error }));
    setFormData((prev) => ({ ...prev, file: error ? null : file }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.date) {
      newErrors.date = "Date is required";
      isValid = false;
    }

    if (!formData.time) {
      newErrors.time = "Time is required";
      isValid = false;
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
      isValid = false;
    }

    if (!formData.remarkCategory) {
      newErrors.remarkCategory = "Remarks category is required";
      isValid = false;
    }

    if (!formData.remarkIssue) {
      newErrors.remarkIssue = "Remarks issue is required";
      isValid = false;
    } else if (formData.remarkIssue.length < 10) {
      newErrors.remarkIssue = "Remarks must be at least 10 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const apiFormData = new FormData();
    apiFormData.append("Date", formData.date);
    apiFormData.append("Time", formData.time);
    apiFormData.append("Status", formData.status);
    apiFormData.append("RemarkCategory", formData.remarkCategory);
    apiFormData.append("RemarkIssue", formData.remarkIssue);
    apiFormData.append("SRN_No", aaNumber);
    if (formData.file) apiFormData.append("Image", formData.file);

    try {
      const response = await raiseConcern(apiFormData);
      alert("Concern raised successfully!");
      handleClose();
    } catch (err) {
      alert("Failed to raise concern. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="hold_reason_modal raise_concern_popup"
      backdrop="static"
    >
      <Modal.Header
        style={{ backgroundColor: "#e6f0ff" }}
        closeButton
        className="hold_popup_header"
      >
        <Modal.Title>Raise Concern</Modal.Title>
      </Modal.Header>
      <Modal.Body className="hold_popup_body">
        <form className="raise_concern_popup_form" onSubmit={handleSubmit}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0 fw-bold">Vendor Name</h5>
            <div className="bg-light border px-3 py-1 rounded-3 text-muted">
              AA no - <strong>{aaNumber}</strong>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="inputDate" className="form-label fw-semibold">
                Date
              </label>
              <input
                type="date"
                id="inputDate"
                name="date"
                className={`form-control py-3 ${
                  errors.date ? "is-invalid" : ""
                }`}
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && (
                <div className="invalid-feedback">{errors.date}</div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="inputTime" className="form-label fw-semibold">
                Time
              </label>
              <input
                type="time"
                id="inputTime"
                name="time"
                className={`form-control py-3 ${
                  errors.time ? "is-invalid" : ""
                }`}
                value={formData.time}
                onChange={handleChange}
              />
              {errors.time && (
                <div className="invalid-feedback">{errors.time}</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="selectStatus" className="form-label fw-semibold">
              Status
            </label>
            <select
              id="selectStatus"
              name="status"
              className={`form-select py-3 ${
                errors.status ? "is-invalid" : ""
              }`}
              value={formData.status}
              onChange={handleChange}
            >
              <option value="" disabled hidden>
                Select Status
              </option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            {errors.status && (
              <div className="invalid-feedback">{errors.status}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="selectCategory" className="form-label fw-semibold">
              Remarks Category
            </label>
            <select
              id="selectCategory"
              name="remarkCategory"
              className={`form-select py-3 ${
                errors.remarkCategory ? "is-invalid" : ""
              }`}
              value={formData.remarkCategory}
              onChange={handleChange}
            >
              <option value="" disabled hidden>
                Select Remarks Category
              </option>
              <option value="technical">Technical</option>
              <option value="service">Service</option>
              <option value="other">Other</option>
            </select>
            {errors.remarkCategory && (
              <div className="invalid-feedback">{errors.remarkCategory}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="textareaIssue" className="form-label fw-semibold">
              Remarks Issue
            </label>
            <textarea
              id="textareaIssue"
              name="remarkIssue"
              className={`form-control rounded-2 ${
                errors.remarkIssue ? "is-invalid" : ""
              }`}
              rows="4"
              placeholder="Enter your issues"
              value={formData.remarkIssue}
              onChange={handleChange}
            ></textarea>
            {errors.remarkIssue && (
              <div className="invalid-feedback">{errors.remarkIssue}</div>
            )}
          </div>

          <div
            onClick={handleClick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="text-center p-4"
            style={{
              border: `1px dashed ${errors.file ? "#dc3545" : "#ccc"}`,
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="d-none"
              onChange={handleFileChange}
              accept="image/*,.pdf"
            />
            <p className="mt-2 mb-0 text-muted raise_drag">
              Drag and drop or <span className="text-primary">browse</span> your
              files
            </p>
            {formData.file && (
              <p className="mt-2 text-success">
                File selected: {formData.file.name}
              </p>
            )}
            {errors.file && <p className="mt-2 text-danger">{errors.file}</p>}
          </div>

          <div className="text-center mt-4">
            <button
              type="submit"
              className="btn btn-primary px-5 py-2"
              style={{
                backgroundColor: "#8000d7",
                border: "none",
                fontWeight: "500",
                fontSize: "16px",
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Raise_concern_popup;
