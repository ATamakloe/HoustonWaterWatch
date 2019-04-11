import React from 'react';
import './ComponentSwitch.css'


function switchActiveTabStyle(tabName, ref) {
      return tabName === ref ? "selected" : null
};


const ComponentSwitch = ({switchTabs, selectedComponent}) => {
      return (
        <div className="maincontainernav">
          <p data-tab="map" onClick={switchTabs} className={switchActiveTabStyle("map", selectedComponent)}>
            Flood Map
          </p>
          <p data-tab="table" onClick={switchTabs} className={switchActiveTabStyle("table", selectedComponent)}>
             Flood Table
          </p>
          <p data-tab="graph" onClick={switchTabs} className={switchActiveTabStyle("graph", selectedComponent)}>
            Site Graph
          </p>
        </div>

      )
}

export default ComponentSwitch
