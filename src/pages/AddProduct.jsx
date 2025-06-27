import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem
} from "@mui/material";
import React, { useState } from "react";
import axiosInstance from "../api/axiosSetup";
import Swal from "sweetalert2";

// MUI Date Picker
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const AddProduct = ({ addProductOpen, setAddProductOpen, handleGet }) => {
  const metalOptions = ["Gold", "Silver", "Platinum"];
  const [errors, setErrors] = useState({});
  const [details, setDetails] = useState({
    metal: "",
    purity: "",
    amount: "",
    date: null
  });
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
    setDetails((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    const { metal, purity, amount, date } = details;

    if (!metal) return setErrors((prev) => ({ ...prev, metal: true }));
    if (!purity) return setErrors((prev) => ({ ...prev, purity: true }));
    if (!amount) return setErrors((prev) => ({ ...prev, amount: true }));
    if (!date) return setErrors((prev) => ({ ...prev, date: true }));

    const status = "Active";
    const data = {
      ...details,
      status,
      date: dayjs(date)
    };

    try {
      const res = await axiosInstance.post(
        `${apiUrl}/api/products/productAdd`,
        data
      );
      if (res?.data?.data) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Product Created Successfully",
          showConfirmButton: true,
          timer: 2000
        });
        setAddProductOpen(false);
        handleGet();
        setDetails({ metal: "", purity: "", amount: "", date: null });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to create product",
        showConfirmButton: true,
        timer: 2000
      });
      setAddProductOpen(false);
      handleGet();
      setDetails({ metal: "", purity: "", amount: "", date: null });
    }
  };

  const handleCloseAddProduct = () => {
    setAddProductOpen(false);
    handleGet();
    setDetails({ metal: "", purity: "", amount: "", date: null });
    setErrors({});
  };
  return (
    <Dialog open={addProductOpen} onClose={handleCloseAddProduct} fullWidth maxWidth="sm">
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent dividers>
        <TextField
          select
          name="metal"
          label="Metal"
          value={details?.metal}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={errors?.metal}
          helperText={errors?.metal ? "Metal is required" : ""}
        >
          {metalOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          onChange={handleChange}
          name="purity"
          fullWidth
          margin="normal"
          type="number"
          label="Purity"
          value={details?.purity}
          error={errors?.purity}
          helperText={errors?.purity ? "Purity is required" : ""}
        />

        <TextField
          onChange={handleChange}
          type="number"
          name="amount"
          fullWidth
          margin="normal"
          label="Amount"
          value={details?.amount}
          error={errors?.amount}
          helperText={errors?.amount ? "Amount is required" : ""}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Product Date"
            value={details.date}
            onChange={(newValue) => {
              setDetails((prev) => ({ ...prev, date: newValue }));
              if (newValue) setErrors((prev) => ({ ...prev, date: false }));
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "normal",
                error: errors?.date,
                helperText: errors?.date ? "Date is required" : ""
              }
            }}
          />
        </LocalizationProvider>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseAddProduct} color="error">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProduct;
