import React from "react";

const AccountCard = ({ account }) => {
  return (
    <div
      className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
        account.isMain ? "bg-blue-100" : "bg-gray-100"
      }`}
    >
      <h3 className="text-lg font-bold mb-2">{account.name}</h3>
      <p className="text-gray-700">{account.type}</p>
      <p className="text-gray-700">{account.account_number}</p>
      <p className="text-gray-700">{account.balance} €</p>
    </div>
  );
};

export default AccountCard;
