import React from 'react';
import './ComponentSwitch.css'


function switchActiveTabStyle(tabName, ref) {
      return tabName === ref ? "selected" : null
      //ComponentSwitch takes in "selectedComponent" as a prop, what I'm doing here
      //is checking which tab is selected and applying styling
};

//switchTabs changes selectedComponent to whichever tab was clicked, which changes component displayed in
//MainBox
const ComponentSwitch = ({switchTabs, selectedComponent}) => {
      return (
        <div className="maincontainernav">
          <button data-tab="map" onClick={switchTabs} className={switchActiveTabStyle("map", selectedComponent)} tabIndex="2">
            Flood Map
      </button>
          <button data-tab="table" onClick={switchTabs} className={switchActiveTabStyle("table", selectedComponent)} tabIndex="2">
             Flood Table
      </button>
          <button data-tab="graph" onClick={switchTabs} className={switchActiveTabStyle("graph", selectedComponent)} tabIndex="2">
            Site Graph
      </button>
        </div>

      )
}

export default ComponentSwitch
