import React, { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";

const Header = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="w-full bg-white shadow-md py-4 flex items-center justify-between px-6 gap-2">
      <div className="flex items-center">
        <img src="/Harmony.png" alt="Harmony Banque" className="h-16" />
        <h1 className="text-4xl font-bold text-blue-600 ml-4">
          Harmony Banque
        </h1>
      </div>
      <div>
        {token ? (
          <Button onClick={handleLogout} color="light" className="px-2">
            Logout
          </Button>
        ) : (
          <Button onClick={() => navigate("/login")} color="light">
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
