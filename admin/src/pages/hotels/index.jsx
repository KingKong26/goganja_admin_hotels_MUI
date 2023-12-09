import { useState, useEffect } from "react";

import { collection, getDocs, doc, deleteDoc } from "firebase/firestore/lite";
import TablePagination from "@mui/material/TablePagination";
import TableContainer from "@mui/material/TableContainer";
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Stack } from "@mui/material";
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

  const navigate = useNavigate();

  const getHotel = async () => {
    try {
      const hotelCollection = collection(db, "hotel");
      const data = await getDocs(hotelCollection);
      setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error getHotel:", error);
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
        <Button variant="contained" onClick={() => navigate("/add-hotel")}>
          Add Hotel
        </Button>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{ minWidth: "100px" }}>
                  Picture
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
                      <Link to={row.placeImage} target="_blank">
                        <img src={row.image} width={80} height={35} alt="" />
                      </Link>
                    </TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.address}</TableCell>
                    <TableCell align="left">
                      <Stack direction="row" spacing={2}>
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
