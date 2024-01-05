import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

import AddEditHotel from "./pages/hotels/add-edit-hotel";
import AddEditRoom from "./pages/rooms/add-edit-room";
import Registration from "./pages/registration";
import Settings from "./pages/setting";
import Hotel from "./pages/hotels";
import Rooms from "./pages/rooms";
import Login from "./pages/login";
import Layout from "./layout";
import Home from "./pages";
import { ThemeProvider, createTheme } from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const theme = createTheme({
  typography: {
    fontFamily: ["montserrat"].join(","),
  },
  palette: {
    primary: {
      main: "#314435",
    },
    secondary: {
      main: "#D7A90E",
    },
    background: {
      main: "#FFFFFF",
    },
  },
});

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route
            path="/registration"
            element={
              <PublicRoute>
                <Registration />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="/hotels" element={<Hotel />} />
            <Route path="/add-hotel" element={<AddEditHotel />} />
            <Route path="/edit-hotel/:id" element={<AddEditHotel />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/add-room" element={<AddEditRoom />} />
            <Route path="/edit-room/:id" element={<AddEditRoom />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
