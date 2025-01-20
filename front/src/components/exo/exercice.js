import React, { useState, useEffect } from "react";
import Counter from "./Counter";
import ListCourses from "./listCourses";
import { Button } from "flowbite-react";

const Exercice = () => {
  const [compteur, setCompteur] = useState(0);
  const [messageErreurC, setMessageErreurC] = useState("");
  const [inputCourse, setInputCourse] = useState("");
  const [ListeCourses, setListeCourses] = useState([]);
  const [messageErreurL, setMessageErreurL] = useState("");
  const [ListeFilm, setListeFilm] = useState([]);
  const [inputFilm, setInputFilm] = useState("");
  const [inputGenre, setInputGenre] = useState("");
  const [inputLongueur, setInputLongueur] = useState("");
  const [activeTab, setActiveTab] = useState("counter");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setListeFilm([
      { name: "Spiderman", genre: "action", longueur: "90" },
      { name: "Batman", genre: "action", longueur: "120" },
      { name: "Superman", genre: "romance", longueur: "110" },
      { name: "Ironman", genre: "terreur", longueur: "100" },
    ]);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const filteredFilms = ListeFilm.filter((film) => {
    return (
      (inputFilm === "" ||
        film.name.toLowerCase().includes(inputFilm.toLowerCase())) &&
      (inputGenre === "" || film.genre === inputGenre) &&
      (inputLongueur === "" || film.longueur === inputLongueur)
    );
  });

  return (
    <div
      className={`flex flex-col gap-6 items-center ${darkMode ? "dark" : ""}`}
    >
      <Button onClick={toggleDarkMode}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </Button>
      <div className="flex gap-4">
        <Button onClick={() => setActiveTab("counter")}>Counter</Button>
        <Button onClick={() => setActiveTab("listCourses")}>
          List Courses
        </Button>
        <Button onClick={() => setActiveTab("searchFilm")}>Search Film</Button>
      </div>
      {activeTab === "counter" && (
        <Counter
          compteur={compteur}
          setCompteur={setCompteur}
          messageErreurC={messageErreurC}
          setMessageErreurC={setMessageErreurC}
        />
      )}
      {activeTab === "listCourses" && (
        <ListCourses
          inputCourse={inputCourse}
          setInputCourse={setInputCourse}
          ListeCourses={ListeCourses}
          setListeCourses={setListeCourses}
          messageErreurL={messageErreurL}
          setMessageErreurL={setMessageErreurL}
        />
      )}
      {activeTab === "searchFilm" && (
        <div className="flex flex-col items-center gap-4">
          <input
            type="text"
            value={inputFilm}
            onChange={(e) => setInputFilm(e.target.value)}
            placeholder="Entrer le film à rechercher"
          />
          <select
            value={inputGenre}
            onChange={(e) => setInputGenre(e.target.value)}
          >
            <option value="">Select Genre</option>
            <option value="action">Action</option>
            <option value="romance">Romance</option>
            <option value="terreur">Terreur</option>
          </select>
          <input
            type="number"
            value={inputLongueur}
            onChange={(e) => setInputLongueur(e.target.value)}
            placeholder="Entrer la longueur à rechercher (en minutes)"
          />
          <p>{filteredFilms.map((film) => film.name).join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default Exercice;
