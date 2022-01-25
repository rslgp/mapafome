import React, { Component } from 'react';
import './App.css';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import Header from './components/header';
import NameForm from './components/googlesheets/form';
import MyLocationButton from './components/googlesheets/mylocation';
import CoffeeMap from './components/map.js';
// import CoffeeTable from './components/table';
import ReactGA from 'react-ga';
import CircularProgress from '@material-ui/core/CircularProgress';

// Material-UI
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

// Google Analytics
function initializeReactGA() {
  ReactGA.initialize('UA-159568942-2');
  ReactGA.pageview(window.location.pathname + window.location.search);
}

initializeReactGA()

const { GoogleSpreadsheet } = require('google-spreadsheet');

// Google Sheets Document ID -- PROD
const doc = new GoogleSpreadsheet(process.env.REACT_APP_GOOGLESHEETID);

// Google Sheets Document ID -- DEV
// const doc = new GoogleSpreadsheet('1jQI6PstbEArW_3xDnGgPJR6_37r_KjLoa765bOgMBhk');

// Provider for leaflet-geosearch plugin
const provider = new OpenStreetMapProvider();

class App extends Component {

  // Initial state
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      dataMaps: [],
      dataHeader: [{ label: "Índice" }, { label: "Lugar" }],
      rowCount: '',
      center:[-8.0671132,-34.8766719],
      alimento:'Alimento não perecível'
    }

    this.setTipoAlimento = this.setTipoAlimento.bind(this);
  }

  setTipoAlimento(event){
    this.setState({
      alimento: event.target.value
    });

  }

  componentDidMount() {

    // Google Sheets API
    // Based on https://github.com/theoephraim/node-google-spreadsheet

    var self = this;

    //current location    
    navigator.geolocation.getCurrentPosition(function(position) {
      self.setState({center: [position.coords.latitude, position.coords.longitude]}) 
    });

    (async function main() {
      // Use service account creds
      await doc.useServiceAccountAuth({
        client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
      });

      await doc.loadInfo(); // Loads document properties and worksheets

      const sheet = doc.sheetsByIndex[0];
      const rows = await sheet.getRows();
      // Total row count
      self.setState({ rowCount: rows.length });

      rows.forEach((x) => { if (x.Coordinates) { x.mapCoords = JSON.parse(x.Coordinates); } });

      self.setState({ dataMaps: rows });

      var needsUpdates = rows.filter((x) => { return !x.Coordinates; });

      if (needsUpdates && needsUpdates.length > 0) {
        for (let index in needsUpdates) {
          let city = needsUpdates[index].City;

          try {
            console.log(city);
            let providerResult = await provider.search({ query: city.replace('-',",") + ', Brazil' });
            let latlon = [providerResult[0].y, providerResult[0].x];
            needsUpdates[index].Coordinates = JSON.stringify(latlon); // Convert obj to string
            needsUpdates[index].mapCoords = latlon;
            await needsUpdates[index].save(); // Save to remote Google Sheet
          }
          catch (e) {
            console.log(e);
          }
        }

        self.setState({ dataMaps: rows });
      }

      // Loading message 
      self.setState({ isLoading: false })

    })();
  }

  render() {
    return (
      <div className="App">
        <Header rowCountProp={this.state.rowCount} />
        {/* <NameForm/>
        <MyLocationButton location={this.state.center}/> */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Paper id="CoffeeMap" className="fadeIn">
              {this.state.isLoading
                ? <div className="flexLoading"><div className="loading">Brewing...</div></div>
                : <CoffeeMap dataMapsProp={this.state.dataMaps} location={this.state.center}/>
              }
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper id="CoffeeTable">
              {this.state.isLoading
                ? <div className="flexLoading"><div className="loading"><CircularProgress /></div></div>
                // : <CoffeeTable dataMapsProp={this.state.dataMaps} dataHeaderProp={this.state.dataHeader} />
              : <div>
        <ul>
          <li>
            <label>
              <input
                type="radio"
                value="Alimento não perecível"
                checked={this.state.alimento === "Alimento não perecível"}
                onChange={this.setTipoAlimento}
              />
              Alimento não perecível
            </label>
          </li>
          
          <li>
            <label>
              <input
                type="radio"
                value="Alimento preparado"
                checked={this.state.alimento === "Alimento preparado"}
                onChange={this.setTipoAlimento}
              />
              Alimento preparado
            </label>
          </li>
        </ul>

                  <NameForm alimento={this.state.alimento}/> 
                  <MyLocationButton location={this.state.center}  alimento={this.state.alimento}/>  
                  <br></br>
                  <a class="wpbtn" title="share to whatsapp" href="whatsapp://send?text=Para marcar no mapa quem tem fome, achei esse site: https://rslgp.github.io/mapafome"> <img class="wp" src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt=""/>
                  Compartilhar no Whatsapp</a>

              </div>
               
              
              }
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;
