import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  FormControl,
  Grid,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";

const EditData = () => {
    const navigate =useNavigate()
  const location = useLocation();
  const { invoice, remarks } = location.state || {};

  const [invoiceData, setInvoiceData] = useState({
    aA_Number: "",
    batchNo: "",
    brand: "",
    closureDate: "",
    creationDate: "",
    customerName: "",
    imeiNumber: "",
    invoiceStatus: "",
    isChecked: false,
    makeModel: "",
    repairCharges: "",
    sellingPartner: "",
    serviceType: "",
    total: "",
    remarks: "",
  });

  useEffect(() => {
    if (invoice) {
      setInvoiceData({
        ...invoice,
        remarks: remarks || invoice.remarks || "",
      });
    }
  }, [invoice, remarks]);

  useEffect(() => {
    console.log("Invoice:", invoice);
    console.log("Remarks:", remarks || invoice?.remarks);
  }, [invoice, remarks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted with data:", invoiceData);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{ p: 4, backgroundColor: "#f9f9f9", borderRadius: 2, boxShadow: 3 }}
      >
        <Typography
          variant="h5"
          gutterBottom
          style={{
            textAlign: "center",
            fontWeight: "bold",
            textDecoration: "underline",
          }}
        >
          Edit Details
        </Typography>
        <Grid container spacing={4} className="mt-4">
          {Object.entries(invoiceData).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <FormControl fullWidth>
                <TextField
                  label={key.replace(/([A-Z])/g, " $1").trim()}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  multiline={key === "remarks"}
                  rows={key === "remarks" ? 4 : 1}
                  sx={{
                    // Ensure text color is black for all fields
                    "& .MuiInputBase-input": {
                      color: "#000000", // Black text
                    },
                    // Ensure placeholder text is not affecting appearance
                    "& .MuiInputBase-input::placeholder": {
                      color: "#000000",
                      opacity: 1,
                    },
                  }}
                />
              </FormControl>
            </Grid>
          ))}
        </Grid>
        <Box mt={4} sx={{ display: "flex", gap: 2,justifyContent:"center",alignItems:"center" }}>
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="btn btn-primary d-flex align-items-center"
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
            <span className="ms-2">Cancel</span>
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            className="btn btn-primary d-flex align-items-center"
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
          </button>
        </Box>
      </Box>
    </Container>
  );
};

export default EditData;
