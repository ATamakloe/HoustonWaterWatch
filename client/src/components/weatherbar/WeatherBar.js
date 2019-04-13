import React from 'react';
import Loading from '../loading/Loading';
import './WeatherBar.css';

const WeatherBar = ( {weatherData, floodedSites} ) => {
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
    <div className="weatheritem"> {weatherData.summary}<br /> {weatherData.temperature.toString().slice(0,-3)}°F </div>
      <div className="weatheritem"> {floodedSites}% of Sites flooding  </div>
    <div className="weatheritem">Last updated<br/> {time} </div>

    </div>
    )
  }
}

export default WeatherBar;
