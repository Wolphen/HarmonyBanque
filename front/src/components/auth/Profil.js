import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import { Button, Label, TextInput, Card } from "flowbite-react";
import Header from "../head_foot/Header";
import Footer from "../head_foot/Footer";

const Profile = () => {
  const { token } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    try {
      await axios.post(
        "http://127.0.0.1:8000/auth/change-password",
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Mot de passe modifié avec succès.");
      setPasswordError("");
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe", error);
      setPasswordError(
        "Erreur lors du changement de mot de passe. Veuillez réessayer."
      );
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://127.0.0.1:8000/auth/change-email",
        { currentEmail, newEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Email modifié avec succès.");
      setEmailError("");
    } catch (error) {
      console.error("Erreur lors du changement d'email", error);
      setEmailError("Erreur lors du changement d'email. Veuillez réessayer.");
    }
  };

  return (
    <div>
      <Header />
      <div className="p-6 flex flex-col items-center justify-center bg-gray-100">
        <div className="flex flex-wrap justify-center gap-6">
          <div className="w-full max-w-md">
            <Card>
              <h2 className="text-xl font-bold mb-4">
                Modifier le mot de passe
              </h2>
              {passwordError && (
                <p className="text-red-500 mb-4">{passwordError}</p>
              )}
              {successMessage && (
                <p className="text-green-500 mb-4">{successMessage}</p>
              )}
              <form onSubmit={handlePasswordChange}>
                <div className="mb-4">
                  <Label
                    htmlFor="currentPassword"
                    className="block text-gray-700 mb-2"
                  >
                    Mot de passe actuel :
                  </Label>
                  <TextInput
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label
                    htmlFor="newPassword"
                    className="block text-gray-700 mb-2"
                  >
                    Nouveau mot de passe :
                  </Label>
                  <TextInput
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label
                    htmlFor="confirmNewPassword"
                    className="block text-gray-700 mb-2"
                  >
                    Confirmer le nouveau mot de passe :
                  </Label>
                  <TextInput
                    id="confirmNewPassword"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  color="light"
                  className="w-full hover:bg-gray-200"
                >
                  Modifier le mot de passe
                </Button>
              </form>
            </Card>
          </div>
          <div className="w-full max-w-md">
            <Card>
              <h2 className="text-xl font-bold mb-4">Modifier l'email</h2>
              {emailError && <p className="text-red-500 mb-4">{emailError}</p>}
              {successMessage && (
                <p className="text-green-500 mb-4">{successMessage}</p>
              )}
              <form onSubmit={handleEmailChange}>
                <div className="mb-4">
                  <Label
                    htmlFor="currentEmail"
                    className="block text-gray-700 mb-2"
                  >
                    Email actuel :
                  </Label>
                  <TextInput
                    id="currentEmail"
                    type="text"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <Label
                    htmlFor="newEmail"
                    className="block text-gray-700 mb-2"
                  >
                    Nouvel email :
                  </Label>
                  <TextInput
                    id="newEmail"
                    type="text"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  color="light"
                  className="w-full hover:bg-gray-200"
                >
                  Modifier l'email
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
