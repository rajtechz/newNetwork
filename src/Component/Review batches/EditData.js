import React, { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom";
import {
    TextField,
    FormControl,
    Grid,
    Typography,
    Button, Container,Box
} from '@mui/material';

const EditData = () => {

    const location = useLocation();
    const INvoice = location.state?.invoice;
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
    });

    useEffect(() => {
        if (INvoice) {
            setInvoiceData({ ...INvoice });
        }
    }, [INvoice]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInvoiceData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit=()=>{

    }
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ p: 4, backgroundColor: "#f9f9f9", borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h5" gutterBottom style={{textAlign:"center" ,fontWeight:"bold",textDecoration:"underline"}}>
                    Edit Details
                </Typography>
                <Grid container spacing={4} className="mt-4">
                    {Object.entries(invoiceData).map(([key, value]) => (
                        <Grid item xs={12} sm={6} md={4} key={key}>
                            <FormControl fullWidth>
                                <TextField
                                    label={key}
                                    name={key}
                                    value={value}
                                    onChange={handleChange}
                                    variant="outlined"
                                    fullWidth
                                />
                            </FormControl>
                        </Grid>
                    ))}
                </Grid>
                <Box mt={4} textAlign="right">
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}

export default EditData
