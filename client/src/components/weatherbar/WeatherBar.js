import React from 'react';
import Loading from '../loading/Loading';
import SiteStatusDonut from '../sitestatusdonut/SiteStatusDonut'
import WeatherIcon from '../weathericon/WeatherIcon';
import './WeatherBar.css';

const WeatherBar = ( {weatherData, siteData} ) => {
  if (weatherData === null) {
    return (
      <div className="weatherbar">
      <Loading/>
      </div>
    )
  } else if (weatherData === "error") {
    return (
      <div className="weatherbar">
        <div className="weatheritem">
            Weather Unavailable
          </div>
      </div>
    )
  } else {
    let time = new Date(weatherData.time * 1000).toString().slice(3, 21);
    return (
    <div className="weatherbar">
      <h1>Weather</h1>
    <WeatherIcon icon={weatherData.icon} summary={weatherData.summary} temperature={weatherData.temperature}/>
    <SiteStatusDonut siteData={siteData}/>
    <div className="weatheritem">Last updated<br/> {time} </div>

    </div>
    )
  }
}

export default WeatherBar;
