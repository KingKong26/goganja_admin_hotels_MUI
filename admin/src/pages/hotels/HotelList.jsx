import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc } from 'firebase/firestore';
import db  from '../../firebase-config-jsx';

const rows = [
 
];

export default function HotelList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  
  
  
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try{
      const empCollectionRef = collection(db, "places");
      const data = await getDocs(empCollectionRef);
      setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id 
      })))
      console.log('fetched hotels:', data)
    } catch(error) {
      console.error("Error fetching hotels:", error);
    }
  }

  // const fetchHotels = async () => {
  //   try {
  //     const hotelsCollection = collection(db, "places");
  //     const hotelsSnapshot = await getDocs(hotelsCollection);
  //     const hotelsData = hotelsSnapshot.docs.map((doc) => ({
  //       ...doc.data(),
  //       id: doc.id
  //     }));
  //     console.error("fetched hotels:", hotelsData);
  //     setHotels(hotelsData);
  //   } catch (error) {
  //     console.error("Error fetching hotels:", error);
  //   }
  // };

  // useEffect(() => {

  //   fetchHotels();
  // }, []); // Run only once on component mount
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
         <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ padding: "20px" }}
          >
            Products List
          </Typography>
          <Divider />
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
                <TableCell
                  align="left"
                  style={{ minWidth: "100px" }}
                >
                    Name
                  
                </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1}>
                        <TableCell key={row.id} align="left">
                      {row.name}
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
  );
}
