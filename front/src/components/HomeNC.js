import React from "react";
import Header from "./head_foot/Header";
import Footer from "./head_foot/Footer";
import { Button, Card } from "flowbite-react";
import "flowbite";

const HomeNC = () => {
  return (
    <div>
      <Header />
      <div className="bg-gray-100 min-h-screen">
        <section
          className="bg-cover bg-center"
          style={{
            backgroundImage: "url('https://via.placeholder.com/1920x1080')",
            height: "60vh",
          }}
        >
          <div className="container mx-auto py-20 text-center text-white">
            <h1 className="text-5xl font-bold">Harmony Banque</h1>
            <p className="mt-4 text-xl">La banque, mais dans la poche</p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold">Nos Services</h2>
            <p className="mt-4 text-lg">
              Découvrez nos services bancaires innovants et adaptés à vos
              besoins.
            </p>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <h3 className="text-2xl font-bold mb-2">Comptes Courants</h3>
                <p>
                  Ouvrez un compte courant avec Harmony Banque et profitez de
                  services bancaires en ligne, de cartes de débit et de chèques
                  gratuits.
                </p>
              </Card>
              <Card>
                <h3 className="text-2xl font-bold mb-2">Prêts Personnels</h3>
                <p>
                  Obtenez des prêts personnels à des taux d'intérêt compétitifs
                  pour financer vos projets personnels, qu'il s'agisse de
                  l'achat d'une voiture, de la rénovation de votre maison ou de
                  vos études.
                </p>
              </Card>
              <Card>
                <h3 className="text-2xl font-bold mb-2">
                  Épargne et Investissements
                </h3>
                <p>
                  Épargnez et investissez avec nos comptes d'épargne à haut
                  rendement et nos options d'investissement diversifiées pour
                  faire fructifier votre argent.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-100">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold">Contactez-nous</h2>
            <p className="mt-4 text-lg">
              Besoin d'aide ? Contactez notre service client disponible 24/7.
            </p>
            <div className="mt-10 justify-center text-center object-center self-center">
              <Button
                color="light"
                className="justify-center hover:bg-gray-200"
              >
                Nous Contacter
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold">Nos Offres</h2>
            <p className="mt-4 text-lg">
              Explorez nos offres spéciales et promotions exclusives.
            </p>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <h3 className="text-2xl font-bold mb-2">Offre de Bienvenue</h3>
                <p>
                  Ouvrez un compte aujourd'hui et recevez une prime de bienvenue
                  de 100€ après votre premier dépôt.
                </p>
              </Card>
              <Card>
                <h3 className="text-2xl font-bold mb-2">Prêt à Taux Réduit</h3>
                <p>
                  Profitez de notre offre spéciale sur les prêts personnels avec
                  un taux d'intérêt réduit de 2% pour les trois premiers mois.
                </p>
              </Card>
              <Card>
                <h3 className="text-2xl font-bold mb-2">
                  Compte Épargne Jeune
                </h3>
                <p>
                  Ouvrez un compte épargne pour vos enfants et bénéficiez d'un
                  taux d'intérêt préférentiel de 3% pour les deux premières
                  années.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-100">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold">Témoignages</h2>
            <p className="mt-4 text-lg">
              Découvrez ce que nos clients disent de nous.
            </p>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <p className="italic">
                  "Harmony Banque est la meilleure banque que j'ai jamais
                  utilisée. Le service client est exceptionnel."
                </p>
                <p className="mt-4 font-bold">- Client 1</p>
              </Card>
              <Card>
                <p className="italic">
                  "Les services bancaires en ligne sont très pratiques et
                  faciles à utiliser."
                </p>
                <p className="mt-4 font-bold">- Client 2</p>
              </Card>
              <Card>
                <p className="italic">
                  "Je recommande vivement Harmony Banque à tous ceux qui
                  cherchent une banque fiable."
                </p>
                <p className="mt-4 font-bold">- Client 3</p>
              </Card>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default HomeNC;
