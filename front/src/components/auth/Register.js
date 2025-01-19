import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      "j'envoie le username avec :",
      username,
      " l'email avec :",
      email,
      "et le password :",
      password
    );
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/register", {
        username,
        email,
        password,
      });
      console.log("Enregistrement réussi, envoie sur la page de connexion");
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors du register", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Création de compte
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="username" className="block text-gray-700 mb-2">
              Pseudo :
            </Label>
            <TextInput
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="email" className="block text-gray-700 mb-2">
              Email :
            </Label>
            <TextInput
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="password" className="block text-gray-700 mb-2">
              Mots de passe :
            </Label>
            <TextInput
              id="password"
              type="password"
              value={password}
              onKeyUp={(e) => {}}
              onChange={(e) => setPassword(e.target.value)}
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
          <p className="mt-4 text-center">
            Déjà un compte ?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Clique ici !
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
