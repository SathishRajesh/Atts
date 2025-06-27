import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosSetup";
import Swal from "sweetalert2";

// MUI Date Picker
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const EditProduct = ({
  editProductOpen,
  setEditProductOpen,
  handleGet,
  editProductData
}) => {
  const metalOptions = ["Gold", "Silver", "Platinum"];
  const [errors, setErrors] = useState({});
  const [details, setDetails] = useState({
    metal: "",
    purity: "",
    amount: "",
    date: null
  });
  const apiUrl = import.meta.env.VITE_API_URL;


  useEffect(() => {
    if (editProductData) {
      setDetails({
        ...editProductData,
        date: editProductData.date ? dayjs(editProductData.date) : null
      });
    }
  }, [editProductData]);

  const handleChange = (e) => {
    const { name, value } = e?.target;
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
      date: dayjs(date).toISOString(),
      status
    };

    try {
      const res = await axiosInstance.post(
        `${apiUrl}/api/products/updateProduct`,
        data
      );
      if (res?.data?.data) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text:res?.data?.message,
          showConfirmButton: true,
          timer: 2000
        });
        setEditProductOpen(false);
        handleGet();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to update product",
        showConfirmButton: true,
        timer: 2000
      });
      setEditProductOpen(false);
      handleGet();
    }
  };

  const handleCloseAddProduct = () => {
    setEditProductOpen(false);
    handleGet();
    setErrors({});
  };

  return (
    <Dialog
      open={editProductOpen}
      onClose={handleCloseAddProduct}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Edit Product</DialogTitle>
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
          type="number"
          fullWidth
          margin="normal"
          label="Purity"
          value={details?.purity}
          error={errors?.purity}
          helperText={errors?.purity ? "Purity is required" : ""}
        />

        <TextField
          onChange={handleChange}
          name="amount"
          fullWidth
          margin="normal"
          label="Amount"
          type="number"
          value={details?.amount}
          error={errors?.amount}
          helperText={errors?.amount ? "Amount is required" : ""}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Product Date"
            value={details?.date}
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
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProduct;
