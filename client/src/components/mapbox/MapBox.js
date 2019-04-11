import React from 'react';
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import L from 'leaflet';
import { floodStatusToIcon } from '../../helpers/helpers';
import './MapBox.css';
const mapConfig = {
  mapURL: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  center: [
    29.76, -95.36
  ],
  zoom: 10
}
const FloodIcon = L.Icon.extend({
  options: {
    iconSize: [28, 28]
  }
});
const cautionIcon = new FloodIcon({iconUrl: require('../../assets/cautionmarker.png')}),
  safeIcon = new FloodIcon({iconUrl: require('../../assets/safemarker.png')}),
  dangerIcon = new FloodIcon({iconUrl: require('../../assets/dangermarker.png')}),
  nodataIcon = new FloodIcon({iconUrl: require('../../assets/nodatamarker.png')});


const MapBox = ({siteData, loadSiteGraph}) => {
  return (<Map center={mapConfig.center} zoom={mapConfig.zoom} className="map">
    <TileLayer attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>' url={`${mapConfig.mapURL}`}/> {
      siteData.map(site => <Marker position={[site.location.latitude, site.location.longitude]} icon={floodStatusToIcon(site.floodStatus, [nodataIcon, safeIcon, cautionIcon, dangerIcon])} key={site.siteCode}>
        <Popup>
          {site.siteName}
          <br/>
          Water Level: {site.waterLevel}
          ft
          <br/>
          Status: {site.floodStatus}
          <br/>
          <button type="button" id={site.siteCode} onClick={loadSiteGraph}>View Site Graph</button>
        </Popup>
      </Marker>)
    }
  </Map>);
}

export default MapBox;
