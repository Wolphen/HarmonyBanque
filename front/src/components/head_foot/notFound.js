import { Card } from "flowbite-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-screen bg-[url('../public/harmony.png')] bg-no-repeat	bg-center">
      <Card>
        <h1>404</h1>
        <p>Page not found</p>
      </Card>
    </div>
  );
};

export default NotFound;
