import React from 'react';
import {Doughnut} from 'react-chartjs-2';
import Loading from '../loading/Loading';
import './SiteStatusDonut.css'


const SiteStatusDonut = ({siteData}) => {
  if (siteData === null) {
    return <Loading />
  }

    const noDataSites = {
    value: siteData.filter(site => site.floodStatus === "N/A").length,
    color: "rgb(77, 111, 236)",
    highlight:"rgb(129, 154, 244)",
    label: "No Data"
    }


    const normalSites = {
    value: siteData.filter(site => site.floodStatus === "Normal").length,
    color: "rgb(8, 172, 4)",
    highlight:"rgb(141, 244, 179)",
    label: "Normal"
    }
    const cautionSites = {
    value: siteData.filter(site => site.floodStatus === "Caution").length,
    color: "rgb(244, 182, 66)",
    highlight:"rgb(246, 202, 119)",
    label: "Caution"
    }

    const floodingSites = {
    value: siteData.filter(site => site.floodStatus === "Flooding").length,
    color: "rgb(244, 93, 66)",
    highlight:"rgb(237, 144, 127)",
    label: "Flooding"
    }

    const floodedPercentage = ((floodingSites.value / (normalSites.value + cautionSites.value + floodingSites.value + noDataSites.value)) * 100).toString().slice(0,3);

    let data = {
    datasets: [{
        data: [normalSites.value, cautionSites.value, floodingSites.value],
        backgroundColor: [normalSites.color, cautionSites.color, floodingSites.color],
        labels: [normalSites.label, cautionSites.label, floodingSites.label]
    }]
  }

    let options = {
      responsive: true,
      maintainAspectRatio:true,
      legend: {
        display: false
      }
    }
    return (
    <div className="weatheritem">
      <p className="sectionhead">Flood Status<span className="colon">:</span></p>
      <div className="legend">
        Normal: <div className="normalcircle"></div>
        Caution:<div className="cautioncircle"></div>
        High: <div className="floodingcircle"></div>
    </div>
    <div className="doughnutwrapper">
      <Doughnut data={data} options={options} />
        </div>
      <p className="floodpercentage">{floodedPercentage}% Flooded</p>

    </div>
)
}
export default SiteStatusDonut;
