import React, { useState } from "react";

import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore/lite";

import { db } from "../../firebase-config";
import { useEffect } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

const defaultValues = {
  place: "",
  placeImage: "",
  name: "",
  address: "",
};

const AddHotel = ({ open, setOpen, getPlaces, singleRecords, setSingleRecords }) => {
  const [formData, setFormData] = useState(defaultValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (singleRecords === null) {
      await createPlace();
    } else {
      await updatePlace();
    }
  };

  const createPlace = async () => {
    const myCollection = collection(db, "places");
    try {
      const docRef = await addDoc(myCollection, formData);
      const firebaseId = docRef.id;
      const updatedData = { ...formData, id: firebaseId };
      const updatedDocRef = doc(myCollection, firebaseId);
      await setDoc(updatedDocRef, updatedData);
      getPlaces();
      handleClose();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const updatePlace = async () => {
    const myCollection = collection(db, "places");
    try {
      const updatedDocRef = doc(myCollection, singleRecords.id);
      await updateDoc(updatedDocRef, formData);
      getPlaces();
      handleClose();
    } catch (error) {
      console.error("Error updating document with Firebase ID: ", error);
    }
  };

  const handleClose = () => {
    setFormData(defaultValues);
    setSingleRecords(null);
    setOpen(false);
  };

  useEffect(() => {
    if (singleRecords !== null) {
      setFormData({ place: singleRecords.place, placeImage: singleRecords.placeImage, name: singleRecords.name, address: singleRecords.address });
    }
  }, [singleRecords]);

  return (
    <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add Hotel
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Place Url"
            name="placeImage"
            value={formData.placeImage}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="Place"
            name="place"
            value={formData.place}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            size="small"
          />
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "end", gap: "10px", marginTop: "20px" }}>
            <Button type="button" variant="outlined" color="primary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddHotel;
