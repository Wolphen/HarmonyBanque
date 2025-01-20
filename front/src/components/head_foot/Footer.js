import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-white shadow-md  mt-4 self-end">
      <p className="text-center text-gray-600">
        &copy; {new Date().getFullYear()} Harmony Banque. Tous droits réservés.
      </p>
    </footer>
  );
};

export default Footer;
