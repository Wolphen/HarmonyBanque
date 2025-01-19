import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./AuthContext";
import Login from "./components/auth/Login";
import Home from "./components/HomeC";
import Register from "./components/auth/Register";
import AccountDetails from "./components/account/AccountDetails";
import HomeNC from "./components/HomeNC";

const App = () => {
  const { token } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/home" />} />
        <Route path="/home" element={<HomeNC />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account/:accountNumber" element={<AccountDetails />} />
      </Routes>
    </Router>
  );
};

const Root = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default Root;
