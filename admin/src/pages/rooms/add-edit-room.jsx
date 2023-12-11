import React, { useState, useEffect } from "react";

import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField } from "@mui/material";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore/lite";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";

import { db } from "../../firebase-config";

const Item = styled(Box)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
}));

const defaultValues = {
  hotelId: "",
  bed: "",
  name: "",
  payment: "",
  refundable: "",
  size: "",
};

const AddEditRoom = () => {
  const [formData, setFormData] = useState(defaultValues);
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const getHotel = async () => {
    try {
      const hotelCollection = collection(db, "hotel");
      const data = await getDocs(hotelCollection);
      setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClose = () => {
    navigate("/rooms");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      update();
    } else {
      create();
    }
  };

  const create = async () => {
    const roomCollection = collection(db, "rooms");
    try {
      const docRef = await addDoc(roomCollection, formData);
      await updateDoc(docRef, { id: docRef.id });
      handleClose();
    } catch (error) {
      console.error("Error create:", error);
    }
  };

  const update = async () => {
    const roomRef = doc(db, "rooms", id);
    try {
      await updateDoc(roomRef, formData);
      handleClose();
    } catch (error) {
      console.error("Error update:", error);
    }
  };

  const fetchEditRecord = async (id) => {
    try {
      const documentRef = doc(db, "rooms", id);
      const documentSnapshot = await getDoc(documentRef);

      if (documentSnapshot.exists()) {
        setFormData(documentSnapshot.data());
      }
    } catch (error) {
      console.error("Error fetchEditRecord:", error);
    }
  };

  useEffect(() => {
    getHotel();
  }, []);

  useEffect(() => {
    if (id) {
      fetchEditRecord(id);
    }
  }, [id]);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1>Add Room</h1>
      </Box>

      <Paper sx={{ padding: "20px" }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ marginBottom: "20px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" size="small">
                Select Hotel
              </InputLabel>
              <Select
                name="hotelId"
                value={formData.hotelId}
                label="Select Hotel"
                size="small"
                onChange={handleFormChange}
                disabled={id ? true : false}
              >
                {rows.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {formData?.hotelId ? (
            <Grid container columnSpacing={2} rowSpacing={2}>
              <Grid item xs={6}>
                <Item>
                  <TextField label="Bed" name="bed" value={formData.bed} onChange={handleFormChange} fullWidth size="small" />
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <TextField label="Name" name="name" value={formData.name} onChange={handleFormChange} fullWidth size="small" />
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <TextField label="Payment" name="payment" value={formData.payment} onChange={handleFormChange} fullWidth size="small" />
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <TextField label="Refundable" name="refundable" value={formData.refundable} onChange={handleFormChange} fullWidth size="small" />
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <TextField type="number" label="Size" name="size" value={formData.size} onChange={handleFormChange} fullWidth size="small" />
                </Item>
              </Grid>
            </Grid>
          ) : null}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "end", gap: "10px", marginTop: "20px" }}>
            <Button type="button" variant="outlined" color="primary" onClick={handleClose}>
              Go Back
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {id ? "Update" : "Create"}
            </Button>
          </Box>
        </form>
      </Paper>
    </>
  );
};

export default AddEditRoom;
