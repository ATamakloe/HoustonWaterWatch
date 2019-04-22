import React from 'react';
import '../weathericon/WeatherIcon.css';
import clearday from '../../assets/weathericons/clearday.png';
import clearnight from '../../assets/weathericons/clearnight.png';
import cloudy from '../../assets/weathericons/cloudy.png';
import fog from '../../assets/weathericons/fog.png';
import cloudyday from '../../assets/weathericons/partlycloudyday.png';
import cloudynight from '../../assets/weathericons/partlycloudynight.png';
import rain from '../../assets/weathericons/rain.png';
import sleet from '../../assets/weathericons/sleet.png';
import snow from '../../assets/weathericons/snow.png';
import wind from '../../assets/weathericons/wind.png';

const WeatherIcon = ({icon, summary, temperature}) => {
  let url;
  switch (icon) {
    case "clear-day":
      url = clearday;
      break;
    case "clear-night":
      url = clearnight;
      break;
    case "cloudy":
      url = cloudy;
      break;
    case "fog":
      url = fog;
      break;
    case "partly-cloudy-day":
      url = cloudyday;
      break;
    case "partly-cloudy-night":
      url = cloudynight;
      break;
    case "rain":
      url = rain;
      break;
    case "sleet":
      url = sleet;
      break;
    case "snow":
      url = snow;
      break;
    case "wind":
      url = wind;
      break;
    default:
      url = clearday;
  }
  return (
    <div className="weatheritem">
    <img className="weathericon" src={url} alt={icon}/>
      <p class="summary">{summary}</p>
    <p class="temperature">{temperature.toString().slice(0,2)}F</p>
    </div>
 )
}

export default WeatherIcon;
