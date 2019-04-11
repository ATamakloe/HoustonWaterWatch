import React from 'react';
import '../SiteTable.css';
const TableRow = ({siteCode, siteName, waterLevel, floodStatus, url, loadSiteGraph}) => {
  return (
    <tr key={siteCode}>
      <td>{siteName}</td>
      <td title="USGS Site Code">
        <a target="_blank" rel="noopener noreferrer" href={`${url}${siteCode}`}>{siteCode}</a>
      </td>
      <td>{waterLevel}
        ft</td>
      <td title={floodStatus === "N/A"
          ? "No flood data available for this site"
          : `This site is reporting ${floodStatus} levels of water`}>
        {floodStatus}
      </td>
      <td id={siteCode} title="Click to see the water heights for the last 30 days">
        <button type="button" id={siteCode} onClick={loadSiteGraph}>View Graph</button>
      </td>
    </tr>
  )
}

export default TableRow;
