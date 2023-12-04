// import Paper from "@mui/material/Paper";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TablePagination from "@mui/material/TablePagination";
// import TableRow from "@mui/material/TableRow";
// import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";
// import { useState, useEffect } from "react";
// import {
//    getFirestore,
//    collection,
//    getDocs,
//    doc,
//    deleteDoc
// } from "firebase/firestore/lite";
// import { db, auth } from "../../firebase-config";
// import { Link } from "react-router-dom";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import Swal from "sweetalert2";
// import TextField from "@mui/material/TextField";
// import Autocomplete from "@mui/material/Autocomplete";
// import Stack from "@mui/material/Stack";
// import { Box } from "@mui/system";
// import { Button } from "@mui/material";
// import AddCircleIcon from "@mui/icons-material/AddCircle";

// export default function PropertyList() {
//    const [page, setPage] = useState(0);
//    const [rowsPerPage, setRowsPerPage] = useState(10);
//    const [rows, setRows] = useState([]);

//    useEffect(() => {
//       getUsers();
//    }, []);

//    const getUsers = async () => {
//       try {
//          const empCollectionRef = collection(db, "places");
//          const data = await getDocs(empCollectionRef);
//          setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
//          console.log("fetched hotels:", data.docs);
//       } catch (error) {
//          console.error("Error fetching hotels:", error);
//       }
//    };

//    // const fetchHotels = async () => {
//    //   try {
//    //     const hotelsCollection = collection(db, "places");
//    //     const hotelsSnapshot = await getDocs(hotelsCollection);
//    //     const hotelsData = hotelsSnapshot.docs.map((doc) => ({
//    //       ...doc.data(),
//    //       id: doc.id
//    //     }));
//    //     console.error("fetched hotels:", hotelsData);
//    //     setHotels(hotelsData);
//    //   } catch (error) {
//    //     console.error("Error fetching hotels:", error);
//    //   }
//    // };

//    // useEffect(() => {

//    //   fetchHotels();
//    // }, []); // Run only once on component mount

//    const handleChangePage = (event, newPage) => {
//       setPage(newPage);
//    };

//    const handleChangeRowsPerPage = (event) => {
//       setRowsPerPage(+event.target.value);
//       setPage(0);
//    };

//    const filterData = (v) => {
//     if (v) {
//       setRows([v]);
//     } else {
//       setRows([])
//       getUsers();
//     }
//   };

//    const deleteUser = (id) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then((result) => {
//       if (result.value) {
//         deleteApi(id);
//       }
//     });
//   };

//   const deleteApi = async (id) => {
//     const userDoc = doc(db, "places", id);
//     await deleteDoc(userDoc);
//     Swal.fire("Deleted!", "Your file has been deleted.", "success");
//     getUsers();
//   };
  
//    return (
//       <Paper sx={{ width: "100%", overflow: "hidden" }}>
//          <Typography
//             gutterBottom
//             variant="h5"
//             component="div"
//             sx={{ padding: "20px" }}
//          >
//             Hotel List
//          </Typography>
//          <Divider />
//          <Box height={10} />
//           <Stack direction="row" spacing={2} className="my-2 mb-2">
//             <Autocomplete
//               disablePortal
//               id="combo-box-demo"
//               options={rows}
//               sx={{ width: 300 }}
//               onChange={(e, v) => filterData(v)}
//               getOptionLabel={(rows) => rows.name || ""}
//               renderInput={(params) => (
//                 <TextField {...params} size="small" label="Search Hotels (5+)" />
//               )}
//             />
//             <Typography
//               variant="h6"
//               component="div"
//               sx={{ flexGrow: 1 }}
//             ></Typography>
//             <Button variant="contained" endIcon={<AddCircleIcon />}>
//               Add
//             </Button>
//           </Stack>
//           <Box height={10} />
         

         
//          <TableContainer sx={{ maxHeight: 440 }}>
//             <Table stickyHeader aria-label="sticky table">
//                <TableHead>
//                   <TableRow>
//                      <TableCell align="left" style={{ minWidth: "100px" }}>
//                         Name
//                      </TableCell>
//                      <TableCell align="left" style={{ minWidth: "100px" }}>
//                         Picture
//                      </TableCell>
                     
//                      <TableCell align="left" style={{ minWidth: "100px" }}>
//                         Address
//                      </TableCell>
//                      <TableCell align="left" style={{ minWidth: "100px" }}>
//                         Action
//                      </TableCell>
                     
//                   </TableRow>
//                </TableHead>
//                <TableBody>
//                   {(rows ?? [])
//                      .slice(
//                         page * rowsPerPage,
//                         page * rowsPerPage + rowsPerPage
//                      )
//                      .map((row) => {
//                       console.log("Rows State:", rows);
//                       console.log("Current Row:", row);
//                         return (
//                            <TableRow key={row.id} hover role="checkbox" tabIndex={-1}>
//                               <TableCell  align="left">
//                                  {row.properties[0].name}
//                               </TableCell>
//                               <TableCell  align="left">
//                                  {/* {row.place} */}
//                                  <Link to={row.properties[0].image} target="_blank">
//                                     <img src={row.properties.image} width={80} height={35}/>
//                                  </Link>
//                               </TableCell>
//                               <TableCell  align="left">
//                                  {row['properties'][0]['address']}
//                               </TableCell>
                              
//                               <TableCell align="left">
//                           <Stack spacing={2} direction="row">
//                             <EditIcon
//                               style={{
//                                 fontSize: "20px",
//                                 color: "blue",
//                                 cursor: "pointer",
//                               }}
//                               className="cursor-pointer"
//                               // onClick={() => editUser(row.id)}
//                             />
//                             <DeleteIcon
//                               style={{
//                                 fontSize: "20px",
//                                 color: "darkred",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => {
//                                 deleteUser(row.id);
//                               }}
//                             />
//                             </Stack>
//                             </TableCell>
//                            </TableRow>
//                         );
//                      })}
//                </TableBody>
//             </Table>
           
//          </TableContainer>
         
//          <TablePagination
//             rowsPerPageOptions={[10, 25, 100]}
//             component="div"
//             count={rows.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//          />

//       </Paper>
//    );
// }
