import React from 'react';
import Loading from '../loading/Loading';
import './WeatherBar.css';

const WeatherBar = ( {weatherData} ) => {
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
    return (
    <div className="weatherbar">
    <div className="weatheritem"> {weatherData.summary} <br/> {weatherData.icon}</div>
    <div className="weatheritem"> {weatherData.temperature} </div>
    <div className="weatheritem"> {weatherData.precipIntensity} </div>
    </div>
    )
  }
}

export default WeatherBar;
