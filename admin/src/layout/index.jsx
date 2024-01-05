import React from "react";

import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import Sidebar from "../components/sidebar";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Box height={63} />
      <Box sx={{ display: "flex", marginLeft: "500" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }} className="bgcolor">
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default Layout;
