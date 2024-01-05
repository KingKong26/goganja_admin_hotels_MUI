import React, { useState, useEffect } from "react";

import {
  Badge,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore/lite";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { db } from "../../firebase-config";
import { SingleFileUpload } from "../../components/SingleFileUpload";
import { MultiImageUpload } from "../../components/multiFileUpload";
import { useFormik } from "formik";
import * as Yup from "yup";

const Item = styled(Box)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 0,
    top: 0,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "14px 3px",
    borderRadius: "50%",
  },
}));

const defaultValues = {
  placeId: "",
  address: "",
  image: "",
  name: "",
  newPrice: "",
  oldPrice: "",
};

const AddEditHotel = () => {
  const [formData, setFormData] = useState(defaultValues);

  const [rows, setRows] = useState([]);
  const [imageAsFile, setImageAsFile] = useState([]);
  const [idCardImages, setIdCardImages] = useState([]);
  const [profileImage, setProfileImage] = useState("");
  const [profileFile, setProfileFile] = useState();
  const [loading, setLoading] = useState(false);

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

  const fetchEditRecord = async (id) => {
    try {
      const documentRef = doc(db, "hotel", id);
      const documentSnapshot = await getDoc(documentRef);

      if (documentSnapshot.exists()) {
        const data = documentSnapshot.data();
        setFormData(data);
        formik.setValues({
          address: data.address,
          placeId: data.placeId,
          image: data.image,
          name: data.name,
          newPrice: data.newPrice,
          oldPrice: data.oldPrice,
        });
        setProfileImage(data.image);
        setIdCardImages(data.photos);
      }
    } catch (error) {
      console.error("Error fetchEditRecord:", error);
    }
  };

  const validationSchema = Yup.object({
    placeId: Yup.string().required("Select a place"),
    address: Yup.string().required("Address is required"),
    name: Yup.string().required("Name is required"),
    newPrice: Yup.number().required("New Average Price is required"),
    oldPrice: Yup.number().required("Old Average Price is required"),
    image: Yup.string().required("Hotel image is required"),
  });

  const formik = useFormik({
    initialValues: {
      placeId: "",
      address: "",
      image: "",
      name: "",
      newPrice: "",
      oldPrice: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (id) {
        update();
      } else {
        await create(values);
      }
    },
  });

  const create = async (datas) => {
    setLoading(true);
    const hotelCollection = collection(db, "hotel");

    try {
      const profileUrl = profileFile ? await SingleFileUpload(profileFile) : "";
      const Idurls = await MultiImageUpload(imageAsFile);
      const newData = { ...datas, image: profileUrl, photos: Idurls };
      const docRef = await addDoc(hotelCollection, newData);
      await updateDoc(docRef, { id: docRef.id });
      setLoading(false);
      handleClose();
    } catch (error) {
      setLoading(false);
      console.error("Error create:", error);
    }
  };

  const update = async (datas) => {
    setLoading(true);
    const hotelRef = doc(db, "hotel", id);
    try {
      const profileUrl = profileFile !== undefined ? await SingleFileUpload(profileFile) : profileImage;
      const Idurls = imageAsFile.length !== 0 ? await MultiImageUpload(imageAsFile) : idCardImages;

      const filteredIdurls = idCardImages.filter((url) => typeof url === "string" && !url.startsWith("blob:http://"));

      const newUrl = imageAsFile.length !== 0 ? [...Idurls, ...filteredIdurls] : Idurls;
      const newData = { ...datas, image: profileUrl, photos: newUrl };
      await updateDoc(hotelRef, newData);
      setLoading(false);
      handleClose();
    } catch (error) {
      setLoading(false);
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

  const handleIdCardImage = (e) => {
    setImageAsFile((old) => [...old, e.target.files[0]]);

    e.target.files.length > 0 && setIdCardImages((old) => [...old, URL?.createObjectURL(e.target.files[0])]);
  };
  const handleDeleteImage = (index) => {
    const newIdCardImages = idCardImages.filter((_, id) => id !== index);
    setIdCardImages(newIdCardImages);
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h4" fontWeight={500} sx={{ marginBottom: "16px" }}>
          {id ? "Update" : "Add"} Hotel
        </Typography>
      </Box>

      <Paper sx={{ padding: "20px" }}>
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ marginBottom: "20px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" size="small">
                Select Place
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="placeId"
                value={formik.values.placeId}
                label="Select Place"
                size="small"
                disabled={id ? true : false}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldError("placeId", "");
                }}
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
            {formik.errors.placeId && <Typography sx={{ color: "red" }}>{formik.errors.placeId}</Typography>}
          </Box>
          {formik.values.placeId ? (
            <>
              <Grid container columnSpacing={2} rowSpacing={2}>
                <Grid item xs={6}>
                  <Item>
                    <TextField
                      label="Address"
                      name="address"
                      value={formik.values.address}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldError("address", "");
                      }}
                      onBlur={formik.handleBlur}
                      fullWidth
                      size="small"
                    />
                    {formik.errors.address && formik.touched.address && <Typography sx={{ color: "red" }}>{formik.errors.address}</Typography>}
                  </Item>
                </Grid>
                <Grid item xs={6}>
                  <Item>
                    <TextField
                      label="Name"
                      name="name"
                      value={formik.values.name}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldError("name", "");
                      }}
                      onBlur={formik.handleBlur}
                      fullWidth
                      size="small"
                    />
                  </Item>
                  {formik.errors.name && formik.touched.name && <Typography sx={{ color: "red" }}>{formik.errors.name}</Typography>}
                </Grid>
                <Grid item xs={3}>
                  <Item>
                    <TextField
                      type="number"
                      label="New Average Price"
                      name="newPrice"
                      value={formik.values.newPrice}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldError("newPrice", "");
                      }}
                      onBlur={formik.handleBlur}
                      fullWidth
                      size="small"
                    />
                    {formik.errors.newPrice && formik.touched.newPrice && <Typography sx={{ color: "red" }}>{formik.errors.newPrice}</Typography>}
                  </Item>
                </Grid>
                <Grid item xs={3}>
                  <Item>
                    <TextField
                      type="number"
                      label="Old Average Price"
                      name="oldPrice"
                      value={formik.values.oldPrice}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldError("oldPrice", "");
                      }}
                      onBlur={formik.handleBlur}
                      fullWidth
                      size="small"
                    />
                    {formik.errors.oldPrice && formik.touched.oldPrice && <Typography sx={{ color: "red" }}>{formik.errors.oldPrice}</Typography>}
                  </Item>
                </Grid>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ padding: "10px 0" }}>
                  <Typography component="h1">Select Main Image</Typography>
                </Box>
                <Item sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Button
                    variant="contained"
                    component="label"
                    name="image"
                    sx={{ width: "max-content", height: "max-content", textAlign: "center", fontSize: "0.8rem" }}
                  >
                    Select File
                    <input
                      type="file"
                      hidden
                      id="main_image"
                      name="image"
                      onChange={(e) => {
                        setProfileFile((profileFile) => e.target.files[0]);
                        e.target.files.length > 0 && setProfileImage(URL?.createObjectURL(e.target.files[0]));
                        formik.setFieldValue("image", e.target.files[0]);
                      }}
                      onBlur={formik.handleBlur}
                      accept="image/*"
                    />
                  </Button>
                  {profileImage && (
                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                    <img
                      src={profileImage}
                      alt="preview of seleted image"
                      height="150px"
                      width="150px"
                      style={{ borderRadius: "10px", objectFit: "cover" }}
                    />
                  )}
                </Item>
                {formik.errors.image && formik.touched.image && <Typography sx={{ color: "red" }}>{formik.errors.image}</Typography>}
              </Grid>

              <Box sx={{ padding: "10px 0" }}>
                <Typography component="h1">Photos</Typography>
              </Box>
              <Stack mb={5} display="flex" flexDirection={"row"} alignItems={"center"} gap={4}>
                <Stack>
                  <Button
                    variant="contained"
                    component="label"
                    name="ImgFile"
                    sx={{ width: "max-content", height: "max-content", textAlign: "center", fontSize: "0.8rem" }}
                  >
                    Select File
                    <input
                      type="file"
                      hidden
                      id="IdImages"
                      name="IdImages"
                      onChange={(e) => {
                        handleIdCardImage(e);
                      }}
                      accept="image/*"
                    />
                  </Button>
                </Stack>
                {idCardImages?.length !== 0 ? (
                  <Stack display="flex" flexDirection={"row"} gap="1rem">
                    {idCardImages &&
                      idCardImages.map((res, index) => {
                        return (
                          <StyledBadge
                            key={index}
                            color="secondary"
                            badgeContent={<CloseIcon sx={{ fontSize: "20px" }} />}
                            sx={{ cursor: "pointer", padding: "0px !important" }}
                            className="hello"
                            onClick={() => handleDeleteImage(index)}
                          >
                            <img
                              src={res}
                              alt="preview of seleted image"
                              height="150px"
                              width="150px"
                              style={{ borderRadius: "10px", objectFit: "cover" }}
                            />
                          </StyledBadge>
                        );
                      })}
                  </Stack>
                ) : (
                  ""
                )}
              </Stack>
            </>
          ) : null}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "end", gap: "10px", marginTop: "20px" }}>
            <Button type="button" variant="outlined" color="primary" onClick={handleClose}>
              Go Back
            </Button>
            <Button type="submit" variant="contained" color="secondary" disabled={loading ? true : false}>
              {loading ? <CircularProgress sx={{ color: "#fff", fontSize: "12px" }} size={24} /> : id ? "Update" : "Create"}
            </Button>
          </Box>
        </form>
      </Paper>
    </>
  );
};

export default AddEditHotel;
