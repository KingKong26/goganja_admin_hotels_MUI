import React from "react";

import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Box height={65} />
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
