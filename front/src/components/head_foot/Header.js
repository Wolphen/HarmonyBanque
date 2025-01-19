import React, { useContext } from "react";
import { AuthContext } from "../../AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "flowbite-react";

const Header = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="w-full bg-white shadow-md py-4 flex items-center justify-between px-6 gap-2">
      <div className="flex items-center">
        <img src="/Harmony.png" alt="Harmony Banque" className="h-16" />
        <h1 className="text-4xl font-bold text-black ml-4">Harmony Banque</h1>
      </div>

      <div className="flex items-center gap-2">
        {location.pathname !== "/" && location.pathname !== "/home" && (
          <Button
            onClick={() => navigate(token ? "/" : "/home")}
            color="light"
            className="px-2 hover:bg-gray-200"
          >
            Accueil
          </Button>
        )}
        {token ? (
          <Button
            onClick={handleLogout}
            color="light"
            className="px-2 hover:bg-gray-200"
          >
            Deconnexion
          </Button>
        ) : (
          <>
            <Button onClick={() => navigate("/login")} color="light">
              Connexion
            </Button>
            <Button onClick={() => navigate("/register")} color="light">
              Inscription
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;