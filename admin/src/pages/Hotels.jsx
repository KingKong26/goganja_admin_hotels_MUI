import Box from "@mui/material/Box";
import Navbar from "../components/Navbar";
import Sidenav from "../components/sidenav";
import HotelList from "./hotels/HotelList";

export default function Hotels() {
   return (
      <>
         <Navbar />
         <Box height={70} />
         <Box sx={{ display: "flex", marginLeft: "500" }}>
            <Sidenav />
            <Box component="main" sx={{ flexGrow: 1, px:3, py:1 }}>
               <h1>Hotels</h1>
               <HotelList />
            </Box>
         </Box>
      </>
   );
}
