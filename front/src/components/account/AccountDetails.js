import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import Header from "../head_foot/Header";
import Footer from "../head_foot/Footer";

const AccountDetails = () => {
  const { token } = useContext(AuthContext);
  const { accountNumber } = useParams();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (token) {
      axios
        .get(`http://127.0.0.1:8000/accounts/${accountNumber}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setAccount(res.data);
        })
        .catch((error) => {
          console.error("Error fetching account details:", error);
        });

      axios
        .get(
          `http://127.0.0.1:8000/accounts/${accountNumber}/all_transactions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setTransactions(res.data);
        })
        .catch((error) => {
          console.error("Error fetching transactions:", error);
        });
    }
  }, [token, accountNumber]);

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true;
    if (filter === "income")
      return (
        transaction.type === "deposit" ||
        transaction.type === "received_transaction"
      );
    if (filter === "expenses") return transaction.type === "sent_transaction";
    return true;
  });

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const translateType = (type) => {
    switch (type) {
      case "deposit":
        return "Dépôt";
      case "received_transaction":
        return "Reçu";
      case "sent_transaction":
        return "Envoi";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center pt-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center w-full max-w-4xl">
          {account ? (
            <div className="mb-6 pb-4 rounded-lg shadow-md bg-gray-50">
              <p className="text-lg font-semibold">{account.name}</p>
              <p className="text-lg">
                Numéro de compte : {account.account_number}
              </p>
              <p className="text-lg">
                Date de création : {formatDate(account.creation_date)}
              </p>
            </div>
          ) : (
            <p>Chargement des détails du compte...</p>
          )}
          <div className="mb-4 flex justify-center space-x-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter("income")}
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                filter === "income" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Revenus
            </button>
            <button
              onClick={() => setFilter("expenses")}
              className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                filter === "expenses" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Dépenses
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto mt-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.date}
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                >
                  <p className="text-gray-700">
                    Type: {translateType(transaction.type)}
                  </p>
                  <p className="text-gray-700">
                    Montant: ${transaction.amount}
                  </p>
                  <p className="text-gray-700">
                    Description: {transaction.description}
                  </p>
                  <p className="text-gray-700">
                    Date: {formatDate(transaction.date)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-700">Aucune transaction trouvée</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountDetails;
