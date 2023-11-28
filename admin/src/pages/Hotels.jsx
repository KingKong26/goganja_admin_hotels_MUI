import Box  from "@mui/material/Box";
import Navbar from "../components/Navbar";
import Sidenav from "../components/sidenav";
import HotelList from "./hotels/HotelList";



export default function Hotels()  {
  return (
    <>
    <Navbar />
        <Box height={70} />
      <Box sx={{ display: "flex", marginLeft: "500"}}>
      <Sidenav />
        <h1>Hotels</h1>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <HotelList/>
      </Box>
      </Box>
    </>
  );
};


