import React, { useState, useEffect } from "react";

import { Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore/lite";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";

import { db } from "../../firebase-config";

const Item = styled(Box)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
}));

const AddRoom = () => {
  const [formData, setFormData] = useState([]);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [placeId, setPlaceId] = useState("");
  const [hotel, setHotel] = useState("");
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

  const fetchEditDetails = async (id) => {
    try {
      const documentRef = doc(db, "places", id);
      const documentSnapshot = await getDoc(documentRef);

      if (documentSnapshot.exists()) {
        setPlaceId(documentSnapshot.data().id);
        setFormData(documentSnapshot.data().properties);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  const handlePropertyChange = (index, key, value) => {
    const tempFormData = [...formData];
    tempFormData[index][key] = value;
    setFormData(tempFormData);
  };

  const addRoom = () => {
    const tempFormData = [...formData];
    tempFormData.push({
      id: Math.max(...tempFormData.map((item) => item.id)) + 1,
      rooms: [
        {
          id: 1,
          bed: "",
          name: "",
          payment: "",
          refundable: "",
          size: "",
          photos: [
            {
              id: 1,
              image: "",
            },
          ],
        },
      ],
    });
    setFormData(tempFormData);
  };

  const removeRoom = (index) => {
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
    if (id) {
      updateRoom();
    } else {
      await createRoom();
    }
  };

  const createRoom = async () => {
    const myCollection = collection(db, "places");
    const findPlace = rows.find((item) => item.id === placeId);
    let payload = {
      ...findPlace,
    };

    if (findPlace?.properties?.rooms?.length > 0) {
      payload.properties.rooms = [...payload.properties.rooms, ...formData];
    } else {
      payload.properties.rooms = formData;
    }
    try {
      const updatedDocRef = doc(myCollection, placeId);
      await updateDoc(updatedDocRef, payload);
      navigate("/rooms");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const updateRoom = async () => {
    const documentRef = doc(db, "places", id);
    const myCollection = collection(db, "places");
    try {
      const documentSnapshot = await getDoc(documentRef);
      if (documentSnapshot.exists()) {
        const payload = { ...documentSnapshot.data(), properties: formData };
        const updatedDocRef = doc(myCollection, id);
        await updateDoc(updatedDocRef, payload);
        navigate("/rooms");
      }
    } catch (error) {
      console.error("Error editing document: ", error);
    }
  };

  const handleClose = () => {
    navigate("/rooms");
  };

  useEffect(() => {
    getPlaces();
  }, []);

  useEffect(() => {
    fetchEditDetails(id);
  }, [id]);

  useEffect(() => {
    if (placeId !== "" && !id) {
      const findPlace = rows.find((item) => item.id === placeId);
      setFormData([
        {
          id: findPlace?.properties?.rooms?.length > 0 ? Math.max(...findPlace.properties.rooms.map((item) => item.id)) + 1 : 1,
          rooms: [
            {
              id: 1,
              bed: "",
              name: "",
              payment: "",
              refundable: "",
              size: "",
            },
          ],
        },
      ]);
    }
  }, [id, placeId, rows]);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1>Add Room</h1>
      </Box>

      <Paper sx={{ padding: "20px" }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ marginBottom: "10px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" size="small">
                Select Hotel
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="place"
                value={hotel}
                label="Select Hotel"
                size="small"
                disabled={id ? true : false}
                onChange={(e) => setHotel(e.target.value)}
              >
                {rows.map((item) =>
                  item.properties.map((property) => (
                    <MenuItem key={property.id} value={property.id}>
                      {property.name}
                    </MenuItem>
                  ))
                )}
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
                          label="Bed"
                          value={property.room.bed}
                          onChange={(e) => handlePropertyChange(index, "bed", e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </Item>
                    </Grid>
                    <Grid item xs={6}>
                      <Item>
                        <TextField
                          label="Image"
                          value={property.rooms.image}
                          onChange={(e) => handlePropertyChange(index, "image", e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </Item>
                    </Grid>
                    <Grid item xs={6}>
                      <Item>
                        <TextField
                          label="ID"
                          value={property.rooms.id}
                          onChange={(e) => handlePropertyChange(index, "id", e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </Item>
                    </Grid>
                    <Grid item xs={3}>
                      <Item>
                        <TextField
                          label="Price Per Night"
                          value={property.rooms.price}
                          onChange={(e) => handlePropertyChange(index, "price", e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </Item>
                    </Grid>
                    {/* <Grid item xs={3}>
                      <Item>
                        <TextField
                          label="Old Price"
                          value={property.oldPrice}
                          onChange={(e) => handlePropertyChange(index, "oldPrice", e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </Item>
                    </Grid> */}
                  </Grid>

                  <Box sx={{ padding: "10px 0" }}>
                    <Typography component="h1">Photos</Typography>
                  </Box>
                  <Grid container columnSpacing={1}>
                    {property.rooms.photos.map((photo, photoIndex) => {
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
                    <IconButton disabled={formData?.length === 1} onClick={() => removeRoom(index)}>
                      <DeleteIcon className="cursor__pointer" />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
              <Box sx={{ marginTop: 1 }}>
                <Button variant="contained" size="small" color="primary" onClick={addRoom}>
                  Add Room
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

export default AddRoom;
