import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";
import Header from "../head_foot/Header";
import Footer from "../head_foot/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("j'envoie le mail avec :", email, "et le password :", password);
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/login", {
        email,
        password,
      });
      console.log("Login successful, token:", response.data.token);
      login(response.data.token);
      navigate("/");
    } catch (error) {
      console.error("Error logging in", error);
      setError("Email ou mot de passe incorrect. Veuillez réessayer.");
    }
  };

  return (
    <div>
      <Header />
      <div className="h-fit p-10 flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="email" className="block text-gray-700 mb-2">
                Email:
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
                Mot de passe:
              </Label>
              <TextInput
                id="password"
                type="password"
                value={password}
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
              Pas de compte ?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Clique ici !
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
