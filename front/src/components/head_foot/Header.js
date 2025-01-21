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
    <header className="w-full bg-white shadow-md py-2 flex items-center justify-between px-4 gap-2">
      <div className="flex items-center">
        <img src="/Harmony.png" alt="Harmony Banque" className="h-12" />
        <h1 className="text-2xl font-bold text-black ml-2">Harmony Banque</h1>
      </div>

      <div className="flex items-center gap-2">
        {location.pathname !== "/" && location.pathname !== "/home" && (
          <Button
            onClick={() => navigate(token ? "/" : "/home")}
            color="light"
            className="px-2 hover:bg-gray-200 text-xs"
            size="xs"
          >
            Accueil
          </Button>
        )}
        {token ? (
          <>
            <Button
              onClick={() => navigate("/deposit")}
              color="light"
              className="text-xs"
              size="xs"
            >
              Depot
            </Button>
            <Button
              onClick={() => navigate("/profil")}
              color="light"
              className="px-2 hover:bg-gray-200 text-xs"
              size="xs"
            >
              Mon compte
            </Button>
            <Button
              onClick={handleLogout}
              color="light"
              className="px-2 hover:bg-gray-200 text-xs"
              size="xs"
            >
              Deconnexion
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => navigate("/login")}
              color="light"
              className="text-xs"
              size="xs"
            >
              Connexion
            </Button>
            <Button
              onClick={() => navigate("/register")}
              color="light"
              className="text-xs"
              size="xs"
            >
              Inscription
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
