import React from "react";
import "./GetAlerts.css";

const GetAlerts = ({ triggerModal }) => {
  return (
    <>
      <button className="getalerts" onClick={triggerModal}>
        {" "}
        Get Alerts
      </button>
    </>
  );
};

export default GetAlerts;
