
import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button,
  Tooltip, IconButton, TablePagination
} from "@mui/material";
import axiosInstance from "../api/axiosSetup";
import AddProduct from "./AddProduct";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditProduct from "./EditProduct";
import Swal from "sweetalert2";

const Product = () => {
  const [productData, setProductData] = useState([]);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editProductOpen, setEditProductOpen] = useState(false);
  const [editProductData, setEditProductData] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const apiUrl = import.meta.env.VITE_API_URL;


  useEffect(() => {
    handleGet(page, limit);
  }, [page, limit]);
console.log(page,limit)
  const handleGet = async (page, limit) => {
    try {
       const payload = {
      page: page + 1, 
      limit,
    };
      const res = await axiosInstance.post(
        `${apiUrl}/api/products/productData`,payload
      );
      console.log(res)
      setProductData(res?.data?.data || []);
      setTotalCount(res?.data?.totalCount || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddProductClick = () => {
    setAddProductOpen(true);
  };

  const handleEdit = (data) => {
    setEditProductData(data);
    setEditProductOpen(true);
  };

  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this product.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.delete(`${apiUrl}/api/products/deleteProduct/${row._id}`);
        if (res?.data?.data) {
          Swal.fire("Deleted!", res?.data?.message, "success");
          handleGet(page, limit);
        }
      } catch (error) {
        Swal.fire("Error", "Unable to delete product", "error");
      }
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "10px 0" }}>
        <Button variant="contained" onClick={handleAddProductClick}>
          Create Product
        </Button>
      </div>
<div style={{padding:"10px"}}>
      <TableContainer component={Paper}>
        <Table aria-label="product table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Metal</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Purity</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Product Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productData?.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row?.metal}</TableCell>
                <TableCell>{row?.purity}</TableCell>
                <TableCell>{row?.amount}</TableCell>
              <TableCell>{new Date(row?.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => handleEdit(row)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(row)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>
      </div>

      {addProductOpen && (
        <AddProduct
          addProductOpen={addProductOpen}
          setAddProductOpen={setAddProductOpen}
          handleGet={() => handleGet(page, limit)}
        />
      )}

      {editProductOpen && (
        <EditProduct
          editProductOpen={editProductOpen}
          setEditProductOpen={setEditProductOpen}
          handleGet={() => handleGet(page, limit)}
          editProductData={editProductData}
        />
      )}
    </div>
  );
};

export default Product;
