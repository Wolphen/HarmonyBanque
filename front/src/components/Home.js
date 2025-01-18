import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import Header from "../head_foot/Header";
import Footer from "../head_foot/Footer";

const Home = () => {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      axios
        .get("http://127.0.0.1:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          {user ? (
            <div>
              <p className="text-lg">Email: {user.email}</p>
              <p className="text-lg">Username: {user.username}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </main>
      <Footer /> {/* Mettre à jour l'utilisation */}
    </div>
  );
};

export default Home;
