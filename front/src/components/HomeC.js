import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import Header from "./head_foot/Header";
import Footer from "./head_foot/Footer";
import AccountCard from "./account/AccountCard"; // Importer le composant AccountCard
import { Button } from "flowbite-react";

const Home = () => {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

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
          return axios.get("http://127.0.0.1:8000/accounts", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        })
        .then((res) => {
          setAccounts(res.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [token]);

  const handleAccountClick = (accountNumber) => {
    navigate(`/account/${accountNumber}`);
  };

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center w-full max-w-4xl">
          {user ? (
            <div>
              <h1 className="text-2xl font-bold mb-4">
                Bonjour {user.username}
              </h1>
              <div className="mt-4 flex items-center justify-between w-full justify-center">
                <h2 className="text-xl font-bold mb-4">Vos Comptes</h2>
                <Button
                  outline
                  gradientDuoTone="tealToLime"
                  className="ml-auto self-start mb-4"
                  onClick={() => navigate("/account/create")}
                >
                  Crée un nouveau Compte
                </Button>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">
                  Solde total : {totalBalance} €
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {accounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => handleAccountClick(account.account_number)}
                    className="cursor-pointer text-left p-0 border-none bg-transparent hover:shadow-xl"
                  >
                    <AccountCard account={account} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
