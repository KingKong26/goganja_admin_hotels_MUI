import React, { useState } from "react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { Box, Button, TextField } from "@mui/material";

import { auth } from "../../firebase-config";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const authToken = await userCredential.user.getIdToken();
      localStorage.setItem("token", authToken);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ width: "450px", border: "1px solid #0000003b", padding: "20px", borderRadius: "4px" }}>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          margin="normal"
          value={email}
          size="small"
          fullWidth
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          margin="normal"
          value={password}
          fullWidth
          size="small"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button sx={{ marginTop: "15px" }} variant="contained" color="primary" fullWidth onClick={handleLogin}>
          Login
        </Button>

        <Box sx={{ marginTop: "15px", textAlign: "center" }}>
          Don't have account? <Link to="/registration">Register</Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
