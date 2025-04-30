import React from "react";
import { LuCircleDashed } from "react-icons/lu";

const LoadingSpinner = () => {
  return (
    <div>
      <LuCircleDashed size={30} className="animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
