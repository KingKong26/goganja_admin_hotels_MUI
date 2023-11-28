import Box  from "@mui/material/Box";
import Navbar from "../components/Navbar";
import Sidenav from "../components/sidenav";

export default function Settings()  {
  return (
    <>
    <Navbar />
    <Box height={30} />
      <Box sx={{ display: "flex" }}>
      <Sidenav />
        <h1>Settings</h1>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        
      </Box>
      </Box>
    </>
  );
};


