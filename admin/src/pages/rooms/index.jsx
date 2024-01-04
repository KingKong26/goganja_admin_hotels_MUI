import { useState, useEffect } from "react";

import { collection, getDocs, doc, deleteDoc } from "firebase/firestore/lite";
import TablePagination from "@mui/material/TablePagination";
import TableContainer from "@mui/material/TableContainer";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Stack } from "@mui/material";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
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

  const getRooms = async () => {
    try {
      const roomCollection = collection(db, "rooms");
      const data = await getDocs(roomCollection);
      setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  const deleteRoom = async (id) => {
    const roomCollection = collection(db, "rooms");
    const roomDoc = doc(roomCollection, id);
    try {
      await deleteDoc(roomDoc);
      getRooms();
    } catch (error) {
      console.error("Error deleting place: ", error);
    }
  };

  useEffect(() => {
    getRooms();
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
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "end", marginBottom: "20px" }}>
        <Button variant="contained" onClick={() => navigate("/add-room")}>
          Add Room
        </Button>
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.bed}</TableCell>
                    <TableCell align="left">{row.id}</TableCell>
                    <TableCell align="left">{row.size}</TableCell>
                    <TableCell align="left">
                      <Stack direction="row" spacing={2}>
                        <DeleteIcon className="cursor__pointer" onClick={() => deleteRoom(row.id)} />
                        <EditIcon
                          className="cursor__pointer"
                          onClick={() => {
                            navigate(`/edit-room/${row.id}`);
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
