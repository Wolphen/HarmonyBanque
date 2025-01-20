import React, { useEffect } from "react";
import { Button, Card } from "flowbite-react";

const Counter = ({
  compteur,
  setCompteur,
  messageErreurC,
  setMessageErreurC,
}) => {
  useEffect(() => {
    if (compteur < 0) {
      setCompteur(0);
      setMessageErreurC("Le compteur ne peut pas être négatif");
      setTimeout(() => {
        setMessageErreurC("");
      }, 2000);
    }
  }, [compteur, setCompteur, setMessageErreurC]);

  return (
    <Card>
      <div className="flex flex-col items-center gap-2">
        <h1>Compteur</h1>
        <p>Compteur: {compteur}</p>
        <p>{messageErreurC}</p>
        <div className="flex justify-center items-center text-center gap-4">
          <Button color="light" onClick={() => setCompteur(compteur - 1)}>
            Décrémenter
          </Button>
          <Button color="light" onClick={() => setCompteur(compteur + 1)}>
            Incrémenter
          </Button>
          <Button color="light" onClick={() => setCompteur(0)}>
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Counter;
