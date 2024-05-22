import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "assets/images/icons/ArrowLeft.svg";

const Breadcrumbs = ({ prevLocation, title }) => {
  const location = useLocation();
  const [locationPath, setLocationPath] = useState("");
  useEffect(() => {
    setLocationPath(location.pathname.split("/")[1]);
  }, [location]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        background: "red",
        zIndex: 0,
      }}
    >
      <ArrowLeft />

      {title}
      <p>
        <span> {prevLocation === "" ? "Home" : prevLocation}</span>
        <span>{"/"}</span>
        <span>{locationPath}</span>
      </p>
    </div>
  );
};

export default Breadcrumbs;
