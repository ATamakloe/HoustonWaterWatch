import React from 'react';
import Loading from '../loading/Loading';
import SiteStatusDonut from '../sitestatusdonut/SiteStatusDonut'
import WeatherIcon from '../weathericon/WeatherIcon';
import './WeatherBar.css';

const WeatherBar = ({weatherData, siteData}) => {
  let weatherbarbody = null;
  if (weatherData === null) {
    weatherbarbody = <Loading/>
  } else if (weatherData === "error") {
    weatherbarbody = <div className="weatheritem">
      Weather Unavailable</div>
  } else {
    let time = new Date(weatherData.time * 1000).toString().slice(3, 21);
    weatherbarbody = <>
      <h1>Weather</h1>
      <WeatherIcon icon={weatherData.icon} summary={weatherData.summary} temperature={weatherData.temperature}/>
      <SiteStatusDonut siteData={siteData}/>
      <div className="weatheritem">Last updated<br/> {time}
      </div>
    </>
  }

  return (<div className="weatherbar">
    {weatherbarbody}
  </div>)
}

export default WeatherBar;
