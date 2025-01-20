import React from "react";
import { Button, Checkbox, Card } from "flowbite-react";

const ListCourses = ({
  inputCourse,
  setInputCourse,
  ListeCourses,
  setListeCourses,
  messageErreurL,
  setMessageErreurL,
}) => {
  const handleAddCourse = () => {
    if (inputCourse.trim() !== "" && !ListeCourses.includes(inputCourse)) {
      setListeCourses([...ListeCourses, inputCourse]);
      setInputCourse("");
    } else if (ListeCourses.includes(inputCourse)) {
      setMessageErreurL("Cette course est déjà dans la liste");
      setTimeout(() => {
        setMessageErreurL("");
      }, 2000);
    }
  };

  return (
    <Card>
      <div className="gap-2 flex flex-col center items-center justify-center">
        <h1>Liste de courses</h1>
        <input
          type="text"
          className="my-4"
          value={inputCourse}
          onChange={(e) => setInputCourse(e.target.value)}
        />
        <Button color="light" onClick={handleAddCourse}>
          Ajouter
        </Button>
        <p>{messageErreurL}</p>
        <ul>
          {ListeCourses.map((course, index) => (
            <div
              key={index}
              className="flex text-center items-center justify-center"
            >
              <Checkbox className="mx-4" color="light" />
              <li>{course}</li>
              <Button
                color="light"
                className="ml-4"
                onClick={() =>
                  setListeCourses(ListeCourses.filter((_, i) => i !== index))
                }
              >
                Supprimer
              </Button>
            </div>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default ListCourses;
