import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { Button, Label, TextInput } from "flowbite-react";
import Footer from "../head_foot/Footer";
import Header from "../head_foot/Header";

const AccountCreate = () => {
  const [accountName, setAccountName] = useState("");
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("j'envoie le name avec :", accountName);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/accounts/",
        { name: accountName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Création de compte réussi, envoie sur la page de connexion");
      navigate("/");
    } catch (error) {
      console.error("Erreur lors du register", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="h-fit p-10 flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Création d'un compte
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="accountName" className="block text-gray-700 mb-2">
                Nom du compte :
              </Label>
              <TextInput
                id="accountName"
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <Button
              type="submit"
              color="light"
              className="w-full hover:bg-gray-200"
            >
              Envoyez
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AccountCreate;
