import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

import Registration from "./pages/registration";
import AddHotel from "./pages/hotels/add-hotel";
import Settings from "./pages/setting";
import Hotel from "./pages/hotels";
import Rooms from "./pages/rooms";
import Login from "./pages/login";
import Layout from "./layout";
import Home from "./pages";
import AddRoom from "./pages/rooms/add-room";

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

export default function App() {
  return (
    <BrowserRouter>
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
          <Route path="/add-hotel" element={<AddHotel />} />
          <Route path="/edit-hotel/:id" element={<AddHotel />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/add-room" element={<AddRoom />} />
          <Route path="/edit-room/:id" element={<AddRoom />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
