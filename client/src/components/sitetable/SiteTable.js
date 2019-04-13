import React from 'react';
import TableRow from './tablerow/TableRow';
import {Table} from 'react-bootstrap';
import './SiteTable.css';

const SiteTable = ({siteData, loadSiteGraph}) => {
  const USGSURL = "https://waterdata.usgs.gov/nwis/uv?site_no=";
  //Maps a table row to each element in sitedata array
  //loadSiteGraph() fetches graphData for a selected site and switches the view in MainComponent component
  const tablerows = siteData.map((site) => <TableRow key ={site.siteCode} siteCode={site.siteCode} url={USGSURL} siteName={site.siteName} waterLevel ={site.waterLevel} floodStatus={site.floodStatus} loadSiteGraph={loadSiteGraph}/>)
  return (
    <div className="tablewrapper">
    <Table bordered="bordered">
      <thead>
        <tr>
          <th>Site Name</th>
          <th>Site Code</th>
          <th>Water Level</th>
          <th>Flood Status</th>
          <th>30 Day Data</th>
        </tr>
      </thead>
      <tbody>
        {tablerows}
      </tbody>
    </Table>
  </div>)
}

export default SiteTable
