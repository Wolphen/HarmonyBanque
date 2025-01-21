import Header from "../head_foot/Header";
import Footer from "../head_foot/Footer";
import { Button, Label, TextInput } from "flowbite-react";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Deposit = () => {
  const [amount, setAmount] = useState(0);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (token) {
      axios
        .get("http://127.0.0.1:8000/accounts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setAccounts(res.data);
          setFilteredAccounts(res.data);
        })
        .catch((error) => {
          console.error("Error fetching accounts:", error);
        });
    }
  }, [token]);

  useEffect(() => {
    const results = accounts.filter((account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAccounts(results);
  }, [searchTerm, accounts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (token && selectedAccount) {
      try {
        await axios.post(
          "http://127.0.0.1:8000/deposit",
          { amount: amount, account_number: selectedAccount.account_number },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Dépôt réussi");
        navigate("/");
      } catch (error) {
        console.error("Erreur lors du dépôt :", error);
      }
    }
  };

  const handleAccountClick = (account) => {
    setSelectedAccount(account);
  };

  return (
    <div>
      <Header />
      <div className="h-fit p-10 flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Sélectionnez un compte pour le dépôt
          </h2>
          <div className="mb-4">
            <Label htmlFor="search" className="block text-gray-700 mb-2">
              Rechercher un compte :
            </Label>
            <TextInput
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              placeholder="Chercher un compte"
            />
          </div>
          <div className="mb-4 overflow-x-auto">
            {filteredAccounts.length > 0 ? (
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Nom du compte</th>
                    <th className="py-2 px-4 border-b">Numéro de compte</th>
                    <th className="py-2 px-4 border-b">Solde</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((account) => (
                    <tr
                      key={account.id}
                      className={`cursor-pointer ${
                        selectedAccount && selectedAccount.id === account.id
                          ? "bg-blue-100"
                          : ""
                      }`}
                      onClick={() => handleAccountClick(account)}
                    >
                      <td className="py-2 px-4 border-b">{account.name}</td>
                      <td className="py-2 px-4 border-b">
                        {account.account_number}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {account.balance} €
                      </td>
                      <td className="py-2 px-4 border-b text-center"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Chargement des comptes...</p>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="amount" className="block text-gray-700 mb-2">
                Montant du dépôt :
              </Label>
              <TextInput
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <Button
              type="submit"
              color="light"
              className="w-full hover:bg-gray-200"
              disabled={!selectedAccount}
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

export default Deposit;
