import React from 'react';
import './TitleBar.css';
import GetAlerts from '../getalertsbutton/GetAlerts';

const TitleBar = ({triggerModal}) => {
  return(
    <nav className="titlebar">
    <h3 className="title">HoustonWaterWatch</h3>
    <GetAlerts triggerModal={triggerModal} />
  </nav>
)
}

export default TitleBar;
