import { useState, useEffect } from "react";

import { collection, getDocs, doc, deleteDoc } from "firebase/firestore/lite";
import TablePagination from "@mui/material/TablePagination";
import TableContainer from "@mui/material/TableContainer";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import EditIcon from "@mui/icons-material/Edit";
import TableRow from "@mui/material/TableRow";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import { Link } from "react-router-dom";

import { db } from "../../firebase-config";
import AddHotel from "./add-hotel";

export default function Hotel() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [singleRecords, setSingleRecords] = useState(null);

  const handleOpen = () => setOpen(true);

  const getPlaces = async () => {
    try {
      const empCollectionRef = collection(db, "places");
      const data = await getDocs(empCollectionRef);
      setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  const deletePlace = async (placeId) => {
    const placesCollection = collection(db, "places");
    const placeDoc = doc(placesCollection, placeId);
    try {
      await deleteDoc(placeDoc);
      getPlaces();
    } catch (error) {
      console.error("Error deleting place: ", error);
    }
  };

  const handleEdit = (row) => {
    setSingleRecords(row);
    handleOpen();
  };

  useEffect(() => {
    getPlaces();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1>Hotels</h1>
        <Button variant="contained" onClick={handleOpen}>
          Add Hotels
        </Button>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Typography gutterBottom variant="h5" component="div" sx={{ padding: "20px" }}>
          Products List
        </Typography>
        <Divider />
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Picture
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Place
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Name
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Address
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (
                  <TableRow key={row.id} hover role="checkbox" tabIndex={-1}>
                    <TableCell align="left">
                      {/* {row.place} */}
                      <Link to={row.placeImage} target="_blank">
                        <img src={row.placeImage} width={80} height={35} alt="" />
                      </Link>
                    </TableCell>
                    <TableCell align="left">{row.place}</TableCell>
                    <TableCell align="left">{row.address}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">
                      <Stack direction="row" spacing={2}>
                        <DeleteIcon className="cursor__pointer" onClick={() => deletePlace(row.id)} />
                        <EditIcon className="cursor__pointer" onClick={() => handleEdit(row)} />
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <AddHotel open={open} setOpen={setOpen} getPlaces={getPlaces} singleRecords={singleRecords} setSingleRecords={setSingleRecords} />
    </>
  );
}
