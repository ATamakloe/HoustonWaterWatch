import React from 'react';
import ComponentSwitch from '../componentswitch/ComponentSwitch';
import MapBox from '../mapbox/MapBox';
import SiteTable from '../sitetable/SiteTable';
import GraphBox from '../graphbox/GraphBox';
import Loading from '../loading/Loading';
import './MainBox.css';

const MainBox = ({ siteData, graphData, loadSiteGraph, switchTabs, selectedComponent }) => {
    let displayedComponent;

    switch (selectedComponent) {
      case null:
      case 'map':
        displayedComponent = <MapBox siteData={siteData} loadSiteGraph={loadSiteGraph}/>;
        break
      case 'table':
        displayedComponent = <SiteTable className="table" siteData={siteData} loadSiteGraph={loadSiteGraph}/>
        break
      case 'graph':
        displayedComponent = <GraphBox className="graph" graphData={graphData}/>
        break
      default:
        displayedComponent = <MapBox siteData={siteData}/>
        break
    }

    return siteData === null ?
       <div className="maincontainer">
        <Loading/>
      </div> :
      <div className="maincontainer">
        <ComponentSwitch switchTabs={switchTabs} selectedComponent={selectedComponent}/>
          <div className="mainbox">
            {displayedComponent}
          </div>
        </div>
  }

export default MainBox;
