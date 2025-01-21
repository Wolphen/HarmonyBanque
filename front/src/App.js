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
import Exercice from "./components/exo/exercice";
import NotFound from "./components/head_foot/notFound";
import AccountCreate from "./components/account/AccountCreate";
import Deposit from "./components/account/Deposit";
import Profile from "./components/auth/Profil";

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { token } = useContext(AuthContext);
  return token ? <Component {...rest} /> : <Navigate to="/home" />;
};

const App = () => {
  const { token } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/home" />} />
        <Route path="/home" element={<HomeNC />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/account/:accountNumber"
          element={<PrivateRoute element={AccountDetails} />}
        />
        <Route path="/exercice" element={<PrivateRoute element={Exercice} />} />
        <Route
          path="/account/create"
          element={<PrivateRoute element={AccountCreate} />}
        />
        <Route path="/profil" element={<PrivateRoute element={Profile} />} />

        <Route path="/deposit" element={<PrivateRoute element={Deposit} />} />
        <Route path="*" element={<NotFound />} />
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
