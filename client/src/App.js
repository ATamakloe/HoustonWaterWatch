import React, {Component} from 'react';
import WeatherBar from './components/weatherbar/WeatherBar';
import MainBox from './components/mainbox/MainBox';
import SignUpModal from './components/signup/SignUpModal';
import TitleBar from './components/titlebar/TitleBar';
import {handleErrors, addressToCoords, withinAlertRadius} from './helpers/helpers'
import './App.css';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        siteData:null,
        weatherData:null,
        graphData: null,
        selectedComponent: 'map',
        showModal: false,
  }
  /*
  siteData is an array containing USGS sites to be rendered on the map.
    Each object has a name, location, USGS code, flood levels, and current water level.
  weatherData is an object containing current weather conditions
  graphData is an object containing a 30-day record of water levels for a site
  //selectedComponent determines which component is shown in the main panel (MainBox component)
  //showModal is a boolean which determines the visibilty of the sign up form.
  */
}
dataUpdateFrequency = 1000 * 60 * 10;

async componentDidMount() {
  let initialSiteData = await fetch('chartdata').then(data => data.json());
  this.setState({siteData: initialSiteData });

  let newWeatherData = await fetch('weatherdata')
  .then(handleErrors)
  .then(data => data.json())
  .catch(error => this.setState({ weatherData: "error" }))
  this.setState({weatherData: newWeatherData });

  setTimeout(async () => {
    let newData = await fetch('chartdata').then(data => data.json());
    this.setState({siteData: newData})
  }, this.dataUpdateFrequency);
};



loadSiteGraph = async (event) => {
  this.setState({selectedComponent: 'graph', graphData: 'Loading'});
  let newData = await fetch(`sites/${event.target.id}`).then(data => data.json());
  this.setState({graphData: newData});

  //Currently this works, but setState is asynchronous so I can see this becoming a problem
  //In the future, might refactor to fetch the data in setState's callback but need to
  //do a bit more research on tradeoffs and potential pitfalls.
};

switchTabs = (event) => {
  const newTab = event.target.attributes.getNamedItem('data-tab').value;
  if (this.state.selectedComponent !== newTab) {
      this.setState({selectedComponent: newTab})
  }
};

triggerModal = () => {
  this.state.showModal === false ? this.setState({showModal: true}) : this.setState({showModal: false})
}

onSubmit = async (address, phoneNumber) => {
  //Take the address supplied by the form, convert it to coords (lat/long)
  const refCoords = await addressToCoords(address);
  //Filter all sites according to which ones are within a 5 mile radius (withinAlertRadius's default radius param)
  const validSites = this.state.siteData.filter(site => withinAlertRadius(refCoords, [site.location.latitude, site.location.longitude])).map(site => site.siteCode);
  //Send the phone number supplied + a list of close sites to the server
  const data = {phoneNumber: phoneNumber, validSites: validSites};

  fetch("/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
}

  render() {
    //Checking for null so this doesn't crash when initially loading
    const siteLocations = this.state.siteData === null ? null : this.state.siteData.map(x => ({siteCode: x.siteCode, lat:x.location.latitude, lon:x.location.longitude }));
    const floodedSites = this.state.siteData === null ? null : ((this.state.siteData.filter(site => site.floodStatus === "Caution" || site.floodStatus === "Flooding").length / this.state.siteData.length) * 100).toFixed(0);
    return (
      <div className="App">
        <TitleBar triggerModal={this.triggerModal}/>
        { this.state.showModal && <SignUpModal triggerModal={this.triggerModal} siteLocations={siteLocations} onSubmit={this.onSubmit}/>}
      <WeatherBar weatherData={this.state.weatherData} floodedSites={floodedSites}/>
        <MainBox siteData={this.state.siteData} graphData={this.state.graphData} selectedComponent={this.state.selectedComponent} loadSiteGraph={this.loadSiteGraph} switchTabs={this.switchTabs} />
    </div>);
  }
}

export default App;
