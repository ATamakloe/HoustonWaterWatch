import React from 'react';
import ComponentSwitch from '../componentswitch/ComponentSwitch';
import MapBox from '../mapbox/MapBox';
import SiteTable from '../sitetable/SiteTable';
import GraphBox from '../graphbox/GraphBox';
import Loading from '../loading/Loading';
import './MainBox.css';

const MainBox = ({ siteData, graphData, loadSiteGraph, switchTabs, selectedComponent }) => {
    let displayedComponent;

    //selectedComponent prop recieved from parent determines which component is rendered
    //selectedComponent is controlled by switchTabs function, which is passed down to
    //ComponentSwitch
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

    let mainbody = siteData === null ? <Loading/> :
      <>
      <ComponentSwitch switchTabs={switchTabs} selectedComponent={selectedComponent}/>
      <div className="mainbox">
        {displayedComponent}
      </div>
   </>

    return (
      <div className="maincontainer">
        {mainbody}
     </div>
    )
  }

export default MainBox;
