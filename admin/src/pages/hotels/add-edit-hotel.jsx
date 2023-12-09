import React, { useState, useEffect } from "react";

import { Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore/lite";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";

import { db } from "../../firebase-config";

const Item = styled(Box)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
}));

const defaultValues = {
  placeId: "",
  address: "",
  image: "",
  name: "",
  newPrice: "",
  oldPrice: "",
  photos: [
    {
      id: 1,
      image: "",
    },
  ],
};

const AddEditHotel = () => {
  const [formData, setFormData] = useState(defaultValues);
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const getPlaces = async () => {
    try {
      const empCollectionRef = collection(db, "places");
      const data = await getDocs(empCollectionRef);
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

  const fetchEditRecord = async (id) => {
    try {
      const documentRef = doc(db, "hotel", id);
      const documentSnapshot = await getDoc(documentRef);

      if (documentSnapshot.exists()) {
        setFormData(documentSnapshot.data());
      }
    } catch (error) {
      console.error("Error fetchEditRecord:", error);
    }
  };

  const handlePhotoChange = (photoIndex, value) => {
    const tempFormData = { ...formData };
    tempFormData.photos[photoIndex].image = value;
    setFormData(tempFormData);
  };

  const addPhoto = () => {
    const tempFormData = { ...formData };
    tempFormData.photos.push({
      id: Math.max(...tempFormData.photos.map((item) => item.id)) + 1,
      image: "",
    });
    setFormData(tempFormData);
  };

  const removePhoto = (photoIndex) => {
    const tempFormData = { ...formData };
    tempFormData.photos.splice(photoIndex, 1);
    setFormData(tempFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      update();
    } else {
      await create();
    }
  };

  const create = async () => {
    const hotelCollection = collection(db, "hotel");
    try {
      const docRef = await addDoc(hotelCollection, formData);
      await updateDoc(docRef, { id: docRef.id });
      handleClose();
    } catch (error) {
      console.error("Error create:", error);
    }
  };

  const update = async () => {
    const hotelRef = doc(db, "hotel", id);
    try {
      await updateDoc(hotelRef, formData);
      handleClose();
    } catch (error) {
      console.error("Error update:", error);
    }
  };

  const handleClose = () => {
    setFormData({});
    navigate("/hotels");
  };

  useEffect(() => {
    getPlaces();
  }, []);

  useEffect(() => {
    if (id) {
      fetchEditRecord(id);
    }
  }, [id]);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1>Add Hotel</h1>
      </Box>

      <Paper sx={{ padding: "20px" }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ marginBottom: "20px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" size="small">
                Select Place
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="placeId"
                value={formData.placeId}
                label="Select Place"
                size="small"
                disabled={id ? true : false}
                onChange={handleFormChange}
              >
                {rows.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      {item.place}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          {formData.placeId ? (
            <>
              <Grid container columnSpacing={2} rowSpacing={2}>
                <Grid item xs={6}>
                  <Item>
                    <TextField label="Address" name="address" value={formData.address} onChange={handleFormChange} fullWidth size="small" />
                  </Item>
                </Grid>
                <Grid item xs={6}>
                  <Item>
                    <TextField label="Image" name="image" value={formData.image} onChange={handleFormChange} fullWidth size="small" />
                  </Item>
                </Grid>
                <Grid item xs={6}>
                  <Item>
                    <TextField label="Name" name="name" value={formData.name} onChange={handleFormChange} fullWidth size="small" />
                  </Item>
                </Grid>
                <Grid item xs={3}>
                  <Item>
                    <TextField
                      type="number"
                      label="New Average Price"
                      name="newPrice"
                      value={formData.newPrice}
                      onChange={handleFormChange}
                      fullWidth
                      size="small"
                    />
                  </Item>
                </Grid>
                <Grid item xs={3}>
                  <Item>
                    <TextField
                      type="number"
                      label="Old Average Price"
                      name="oldPrice"
                      value={formData.oldPrice}
                      onChange={handleFormChange}
                      fullWidth
                      size="small"
                    />
                  </Item>
                </Grid>
              </Grid>

              <Box sx={{ padding: "10px 0" }}>
                <Typography component="h1">Photos</Typography>
              </Box>
              <Grid container columnSpacing={2} rowSpacing={2}>
                {formData.photos.map((photo, photoIndex) => {
                  return (
                    <Grid item container alignItems="center" columnSpacing={2} key={photoIndex}>
                      <Grid item xs={11}>
                        <Item>
                          <TextField
                            label="Photo Url"
                            value={photo.image}
                            onChange={(e) => handlePhotoChange(photoIndex, e.target.value)}
                            fullWidth
                            size="small"
                          />
                        </Item>
                      </Grid>
                      <Grid item xs={1}>
                        <Item>
                          <IconButton disabled={formData.photos.length === 1} onClick={() => removePhoto(photoIndex)}>
                            <DeleteIcon />
                          </IconButton>
                        </Item>
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
              <Box sx={{ marginTop: 1 }}>
                <Button variant="contained" size="small" color="primary" onClick={() => addPhoto()}>
                  Add Photo
                </Button>
              </Box>
            </>
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

export default AddEditHotel;
