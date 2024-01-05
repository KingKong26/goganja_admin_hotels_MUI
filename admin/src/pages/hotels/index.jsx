import { useState, useEffect } from "react";

import { collection, getDocs, doc, deleteDoc } from "firebase/firestore/lite";
import TablePagination from "@mui/material/TablePagination";
import TableContainer from "@mui/material/TableContainer";
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import EditIcon from "@mui/icons-material/Edit";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";

import { db } from "../../firebase-config";

export default function Hotel() {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const getHotel = async () => {
    try {
      const hotelCollection = collection(db, "hotel");
      const data = await getDocs(hotelCollection);
      setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setIsLoading(false);
    } catch (error) {
      console.error("Error getHotel:", error);
      setIsLoading(false);
    }
  };

  const deleteHotel = async (id) => {
    const roomCollection = collection(db, "hotel");
    const roomDoc = doc(roomCollection, id);
    try {
      await deleteDoc(roomDoc);
      getHotel();
    } catch (error) {
      console.error("Error deleteHotel: ", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getHotel();
  }, []);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "end", marginBottom: "20px" }}>
        <Button variant="contained" onClick={() => navigate("/add-hotel")} color="secondary">
          Add Hotel
        </Button>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ minWidth: "100px" }}>
                  Picture
                </TableCell>
                <TableCell align="center" style={{ minWidth: "100px" }}>
                  Name
                </TableCell>
                <TableCell align="center" style={{ minWidth: "100px" }}>
                  Address
                </TableCell>
                <TableCell align="center" style={{ minWidth: "100px" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell component="th" scope="row" align="center" colSpan={8}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell component="th" scope="row" align="center" colSpan={8}>
                    Hotals Not Found!
                  </TableCell>
                </TableRow>
              ) : (
                rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  return (
                    <TableRow key={row.id} hover role="checkbox" tabIndex={-1}>
                      <TableCell align="center" style={{ width: "385px", height: "250px" }}>
                        {/* <Link to={row.placeImage} target="_blank"> */}
                        <img src={row.image} width={"100%"} height={"100%"} alt="" style={{ objectFit: "cover" }} />
                        {/* </Link> */}
                      </TableCell>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.address}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" justifyContent={"center"} spacing={2}>
                          <DeleteIcon className="cursor__pointer" onClick={() => deleteHotel(row.id)} />
                          <EditIcon
                            className="cursor__pointer"
                            onClick={() => {
                              navigate(`/edit-hotel/${row.id}`);
                            }}
                          />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
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
