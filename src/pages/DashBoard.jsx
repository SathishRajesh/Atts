import React from "react";
import welcome from "../assets/welcome.png";

const DashBoard = () => {
  return (
    <div className="w-full min-h-screen">
      <img
        src={welcome}
        alt="Welcome"
        className="w-full h-auto sm:h-screen object-cover object-center"
      />
    </div>
  );
};

export default DashBoard;
