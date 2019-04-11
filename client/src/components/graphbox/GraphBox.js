import React from 'react';
import {Line} from 'react-chartjs-2';
import Loading from '../loading/Loading';
import './GraphBox.css'

const GraphBox = ({graphData}) => {
  if (graphData === null) {

    return <div className="graph">Select a site from the Map or Site Table to load a graph</div>
  } else if (graphData === "Loading") {
    return <div className="graph"><Loading/></div>
  } else {
    const {siteName, floodStage} = graphData,
      thirtyDayData = graphData.lastMonthData.map(data => ({x: data.dateTime, y: data.value})),
      labels = thirtyDayData.map(data => data.x.slice(5, 10)),
      waterValues = thirtyDayData.map(data => data.y),
      cautionline = floodStage.caution
        ? waterValues.map(values => floodStage.caution)
        : [],
      floodline = floodStage.caution
        ? waterValues.map(values => floodStage.flood)
        : [],
      options = {
        title: {
          display: true,
          text: `${siteName}`
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Date"
              },
              ticks: {
                maxTicksLimit: 31
              }
            }
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Water Height"
              },
              ticks: {
                callback: function(value, index, values) {
                  return `${value} ft`
                }
              }
            }
          ]
        },
        maintainAspectRatio: false,
        legend: true
      },
      legend = {
        legend: {
          display: true,
          position: 'top'
        }
      },
      data = {
        labels: labels,
        datasets: [
          {
            label: 'Water Height',
            data: waterValues,
            borderColor: ['rgb(102, 199, 230)'],
            fill: 'rgb(102, 199, 230)',
            borderWidth: 7,
            pointRadius: 0,
            pointStyle: 'line',
            pointBackgroundColor: 'rgb(102, 199, 230)'
          }, {
            label: 'Caution Line',
            data: cautionline,
            borderColor: ['rgb(249, 197, 15)'],
            fill: ['rgb(249, 197, 15)'],
            borderWidth: 4,
            pointRadius: 0,
            pointStyle: 'line',
            pointBackgroundColor: 'rgb(249, 197, 15)'
          }, {
            label: 'Flood Line',
            data: floodline,
            borderColor: ['rgb(249, 15, 15)'],
            fill: ['rgb(249, 15, 15)'],
            borderWidth: 4,
            pointRadius: 0,
            pointStyle: 'line',
            pointBackgroundColor: 'rgb(249, 15, 15)'
          }
        ]
      }
    return (
      <div className="graph">
      <Line data={data} options={options} legend={legend}/>
    </div>
  )
  }
}

export default GraphBox;
