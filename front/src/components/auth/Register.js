import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Button, Label, TextInput, Progress } from "flowbite-react";
import Header from "../head_foot/Header";
import Footer from "../head_foot/Footer";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+}{":;'?/>.<,])(?=.*[A-Z])(?=.*[a-z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[!@#$%^&*()_+}{":;'?/>.<,]/.test(password)) strength += 20;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 41) return "red"; // Red
    if (passwordStrength === 40) return "orange"; // Orange
    if (passwordStrength === 60) return "yellow"; // Yellow
    if (passwordStrength === 80) return "yellow"; // Yellow
    if (passwordStrength === 100) return "green"; // Green
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("L'email n'est pas valide.");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères, dont une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial."
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setError("");
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
      setError("Erreur lors de l'enregistrement. Veuillez réessayer.");
    }
  };

  return (
    <div>
      <Header />
      <div className="p-6 flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Création de compte
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
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
            <div className="mb-4">
              <Label htmlFor="password" className="block text-gray-700 mb-2">
                Mot de passe :
              </Label>
              <TextInput
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full"
                required
              />
              <Progress
                progress={passwordStrength}
                color={getPasswordStrengthColor()}
                className="mt-2"
              />
            </div>
            <div className="mb-6">
              <Label
                htmlFor="confirmPassword"
                className="block text-gray-700 mb-2"
              >
                Confirmer le mot de passe :
              </Label>
              <TextInput
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
      <Footer />
    </div>
  );
};

export default Register;
