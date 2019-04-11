import React from 'react';
import './TitleBar.css';


const TitleBar = ({triggerModal}) => {
  return(
    <nav className="titlebar">
    <h3 className="title">Houston Flood Watch</h3>
    <button class="getalerts" onClick={triggerModal}>Get Alerts</button>
  </nav>
)
}

export default TitleBar;
