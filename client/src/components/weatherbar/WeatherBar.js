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
    return (
    <div className="weatherbar">
    <div className="weatheritem"> Weather <br/> {weatherData.summary}</div>
    <div className="weatheritem"> Temp. <br />{weatherData.temperature.toString().slice(0,-3)}°F </div>
    <div className="weatheritem"> {floodedSites}% of Sites Flooded  </div>
    </div>
    )
  }
}

export default WeatherBar;
