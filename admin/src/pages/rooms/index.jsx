import { useState, useEffect } from "react";

import { collection, getDocs, doc, deleteDoc } from "firebase/firestore/lite";
import TablePagination from "@mui/material/TablePagination";
import TableContainer from "@mui/material/TableContainer";
import { Link, useNavigate } from "react-router-dom";
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

import { db } from "../../firebase-config";

export default function Rooms() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();

  const getPlaces = async () => {
    try {
      const placesCollectionRef = collection(db, "places");
      const data = await getDocs(placesCollectionRef);
      let roomData = [];

      data.docs.forEach((placeDoc) => {
        const placeData = placeDoc.data();

        if (placeData.properties && placeData.properties.rooms) {
          placeData.properties.rooms.forEach((roomItem) => {
            roomData.push({
              ...roomItem,
              place: placeData.placex,
              placeId: placeDoc.id,
            })
          })
        }
      })
      setRows(roomData);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  const deleteRoom = async (placeId) => {
    const placesCollection = collection(db, "places");
    const placeDoc = doc(placesCollection, placeId);
    try {
      await deleteDoc(placeDoc);
      getPlaces();
    } catch (error) {
      console.error("Error deleting place: ", error);
    }
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
        <h1>Rooms</h1>
        <Button variant="contained" onClick={() => navigate("/add-room")}>
          Add Room
        </Button>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Typography gutterBottom variant="h5" component="div" sx={{ padding: "20px" }}>
          Rooms List
        </Typography>
        <Divider />
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Name
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Bed
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  ID
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Size
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
                    {/* <TableCell align="left">
                      <Link to={row.placeImage} target="_blank">
                        <img src={row.image} width={80} height={35} alt="" />
                      </Link>
                    </TableCell> */}
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.bed}</TableCell>
                    <TableCell align="left">{row.id}</TableCell>
                    <TableCell align="left">{row.size}</TableCell>
                    <TableCell align="left">
                      <Stack direction="row" spacing={2}>
                        <DeleteIcon className="cursor__pointer" onClick={() => deleteRoom(row.placeId)} />
                        <EditIcon
                          className="cursor__pointer"
                          onClick={() => {
                            navigate(`/edit-hotel/${row.placeId}`);
                          }}
                        />
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
    </>
  );
}
