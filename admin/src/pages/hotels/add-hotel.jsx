import React, { useState, useEffect } from "react";

import { Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore/lite";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

import { db } from "../../firebase-config";

const Item = styled(Box)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
}));

const AddHotel = () => {
  const [formData, setFormData] = useState([]);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [placeId, setPlaceId] = useState("");

  const getPlaces = async () => {
    try {
      const empCollectionRef = collection(db, "places");
      const data = await getDocs(empCollectionRef);
      setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  const handlePropertyChange = (index, key, value) => {
    const tempFormData = [...formData];
    tempFormData[index][key] = value;
    setFormData(tempFormData);
  };

  const addProperty = () => {
    const tempFormData = [...formData];
    tempFormData.push({
      id: Math.max(...tempFormData.map((item) => item.id)) + 1,
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
    });
    setFormData(tempFormData);
  };

  const removeProperty = (index) => {
    const tempFormData = [...formData];
    tempFormData.splice(index, 1);
    setFormData(tempFormData);
  };

  const handlePhotoChange = (index, photoIndex, value) => {
    const tempFormData = [...formData];
    tempFormData[index].photos[photoIndex].image = value;
    setFormData(tempFormData);
  };

  const addPhoto = (index) => {
    const tempFormData = [...formData];
    tempFormData[index].photos.push({
      id: Math.max(...tempFormData[index].photos.map((item) => item.id)) + 1,
      image: "",
    });
    setFormData(tempFormData);
  };

  const removePhoto = (index, photoIndex) => {
    const tempFormData = [...formData];
    tempFormData[index].photos.splice(photoIndex, 1);
    setFormData(tempFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPlace();
  };

  const createPlace = async () => {
    const myCollection = collection(db, "places");
    const findPlace = rows.find((item) => item.id === placeId);
    let payload = {
      ...findPlace,
    };

    if (findPlace?.properties?.length > 0) {
      payload.properties = [...payload.properties, ...formData];
    } else {
      payload.properties = formData;
    }
    try {
      const updatedDocRef = doc(myCollection, placeId);
      await updateDoc(updatedDocRef, payload);
      navigate("/hotels");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleClose = () => {
    navigate("/hotels");
  };

  useEffect(() => {
    getPlaces();
  }, []);

  useEffect(() => {
    if (placeId !== "") {
      const findPlace = rows.find((item) => item.id === placeId);
      setFormData([
        {
          id: findPlace?.properties?.length > 0 ? Math.max(...findPlace.properties.map((item) => item.id)) + 1 : 1,
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
        },
      ]);
    }
  }, [placeId, rows]);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1>Add Hotel</h1>
      </Box>

      <Paper sx={{ padding: "20px" }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ marginBottom: "10px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" size="small">
                Select Place
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="place"
                value={placeId}
                label="Select Place"
                size="small"
                onChange={(e) => setPlaceId(e.target.value)}
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
          {formData.length > 0 ? (
            <>
              <Box sx={{ padding: "10px 0" }}>
                <Typography component="h1">Properties</Typography>
              </Box>
              {formData.map((property, index) => (
                <Paper sx={{ padding: "15px", marginBottom: "20px" }} key={index}>
                  <Grid container columnSpacing={1}>
                    <Grid item xs={6}>
                      <Item>
                        <TextField
                          label="Address"
                          value={property.address}
                          onChange={(e) => handlePropertyChange(index, "address", e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </Item>
                    </Grid>
                    <Grid item xs={6}>
                      <Item>
                        <TextField
                          label="Image"
                          value={property.image}
                          onChange={(e) => handlePropertyChange(index, "image", e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </Item>
                    </Grid>
                    <Grid item xs={6}>
                      <Item>
                        <TextField
                          label="Name"
                          value={property.name}
                          onChange={(e) => handlePropertyChange(index, "name", e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </Item>
                    </Grid>
                    <Grid item xs={3}>
                      <Item>
                        <TextField
                          label="New Price"
                          value={property.newPrice}
                          onChange={(e) => handlePropertyChange(index, "newPrice", e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </Item>
                    </Grid>
                    <Grid item xs={3}>
                      <Item>
                        <TextField
                          label="Old Price"
                          value={property.oldPrice}
                          onChange={(e) => handlePropertyChange(index, "oldPrice", e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </Item>
                    </Grid>
                  </Grid>

                  <Box sx={{ padding: "10px 0" }}>
                    <Typography component="h1">Photos</Typography>
                  </Box>
                  <Grid container columnSpacing={1}>
                    {property.photos.map((photo, photoIndex) => {
                      return (
                        <Grid item container alignItems="center" columnSpacing={2} key={photoIndex}>
                          <Grid item xs={11}>
                            <Item>
                              <TextField
                                label="Photo Url"
                                value={photo.image}
                                onChange={(e) => handlePhotoChange(index, photoIndex, e.target.value)}
                                fullWidth
                                size="small"
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={1}>
                            <Item>
                              <IconButton disabled={property.photos.length === 1} onClick={() => removePhoto(index, photoIndex)}>
                                <DeleteIcon />
                              </IconButton>
                            </Item>
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                  <Box sx={{ marginTop: 1 }}>
                    <Button variant="contained" size="small" color="primary" onClick={() => addPhoto(index)}>
                      Add Photo
                    </Button>
                  </Box>

                  <Box sx={{ marginTop: "20px" }}>
                    <IconButton disabled={formData?.length === 1} onClick={() => removeProperty(index)}>
                      <DeleteIcon className="cursor__pointer" />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
              <Box sx={{ marginTop: 1 }}>
                <Button variant="contained" size="small" color="primary" onClick={addProperty}>
                  Add Property
                </Button>
              </Box>
            </>
          ) : null}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "end", gap: "10px", marginTop: "20px" }}>
            <Button type="button" variant="outlined" color="primary" onClick={handleClose}>
              Go Back
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </>
  );
};

export default AddHotel;
