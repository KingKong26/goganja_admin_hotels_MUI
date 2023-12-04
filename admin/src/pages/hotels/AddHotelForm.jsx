import {
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Icon from "@mdi/react";
import { mdiCurrencyThb } from "@mdi/js";
import { db, auth } from "../../firebase-config";
import { addDoc, collection, getDocs, setRows } from "firebase/firestore";
import Swal from "sweetalert2";

function AddHotelForm({ closeEvent }) {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [picture, setPicture] = useState("");
  const [rows, setRows] = useState([]);
  const empCollectionRef = collection(db, "places")

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleAreaChange = (event) => {
    setArea(event.target.value);
  };
  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };
  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };
  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    // You can add additional logic to handle the selected file, such as uploading it to a server or displaying a preview.
    // For now, let's just set the file name in the state.
    setPicture(file ? file.name : "");
  };

  const getHotels = async () => {
    try {
       const empCollectionRef = collection(db, "places");
       const data = await getDocs(empCollectionRef);
       setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id, properties: doc.data().properties })));
       console.log("fetched hotels:", data.docs);
    } catch (error) {
       console.error("Error fetching hotels:", error);
    }
 };

  const createHotel = async () => {
    await addDoc(empCollectionRef, {
      name: name,
      price: Number(price),
      place: area,
      
    });
    getHotels();
    closeEvent();
    Swal.fire("Submitted!", "Yourfiles has been submitted.", "success");
    
  };

  const areas = [
    {
      value: "PTY",
      label: "Pattaya",
    },
    {
      value: "BKK",
      label: "Bangkok",
    },
    {
      value: "CHM",
      label: "Chiang Mai",
    },
    {
      value: "KS",
      label: "Koh Samoi",
    },
  ];

  return (
    <>
      <Box sx={{ backgroundColor: "white" }}/>
      <Typography variant="h5" align="container" >
        Add Hotel
      </Typography>
      <IconButton
        style={{ position: "absolute", top: "0", right: "0" }}
        onClick={closeEvent}
      >
        <CloseIcon />
      </IconButton>
      <Box height={20}/>
      <Grid container spacing={2} sx={{ backgroundColor: "white", p: 2 }}>
        <Grid item xs={6}>
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            size="small"
            onChange={handleNameChange}
            sx={{ minWidth: "100%" }}
            value={name}
          />
        </Grid>
        <Grid item xs={6} >
          <TextField
            id="outlined-basic"
            label="Average Price"
            variant="outlined"
            size="small"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon path={mdiCurrencyThb} size={1} />
                </InputAdornment>
              ),
            }}
            onChange={handlePriceChange}
            sx={{ minWidth: "100%" }}
            value={price}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-basic"
            label="Area"
            select
            variant="outlined"
            size="small"
            onChange={handleAreaChange}
            sx={{ minWidth: "100%" }}
            value={area}
          >
            {areas.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-basic"
            label="Address"
            variant="outlined"
            size="small"
            onChange={handleAddressChange}
            sx={{ minWidth: "100%" }}
            value={address}
          />
        </Grid>
        <Grid item xs={12}>
          <input
            type="file"
            accept="image/*"
            onChange={handlePictureChange}
            style={{ display: "none" }}
            id="upload-picture"
          />
          <label htmlFor="upload-picture">
            <Button
              variant="contained"
              component="span"
              sx={{ minWidth: "100%" }}
            >
              Upload Picture
            </Button>
          </label>
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            {picture || "No file selected"}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            <Button variant="contained" onClick={createHotel}>
              Submit
            </Button>
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ m: 4 }} />
    </>
  );
}

export default AddHotelForm;
