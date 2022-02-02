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


import qr from './images/qr.svg';

// Material-UI
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import CleanOld from './components/googlesheets/cleanold';

import AesEncryption from "aes-encryption";

const aes = new AesEncryption();

// Google Analytics
function initializeReactGA() {
  ReactGA.initialize('UA-172868315-1');
  ReactGA.pageview(window.location.pathname + window.location.search);
}

initializeReactGA();

aes.setSecretKey(process.env.REACT_APP_CRYPTSEED+"F");

const { GoogleSpreadsheet } = require('google-spreadsheet');

// Google Sheets Document ID -- PROD
const doc = new GoogleSpreadsheet(process.env.REACT_APP_GOOGLESHEETID);

// Google Sheets Document ID -- DEV
// const doc = new GoogleSpreadsheet('1jQI6PstbEArW_3xDnGgPJR6_37r_KjLoa765bOgMBhk');

// Provider for leaflet-geosearch plugin
const provider = new OpenStreetMapProvider();
//limit osm https://operations.osmfoundation.org/policies/nominatim/

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
      alimento:'Alimento de cesta básica',
      telefone:'',
      telefoneEncryptado:''
    }

    this.setTipoAlimento = this.setTipoAlimento.bind(this);
    this.handleChangeTelefone = this.handleChangeTelefone.bind(this);
  }

  setTipoAlimento(event){
    this.setState({
      alimento: event.target.value
    });

  }

  handleChangeTelefone(event) {
    let telefoneValue = event.target.value.replace(/[^0-9]/g,'');
    if(telefoneValue.length >= 8){
      this.setState({telefoneEncryptado: aes.encrypt(telefoneValue)});
    }
    this.setState({telefone: telefoneValue});
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

      rows.forEach((x) => { 
        if (x.Coordinates) { x.mapCoords = JSON.parse(x.Coordinates); 
          if(x.Telefone) {
            try{
              x.Telefone = aes.decrypt(x.Telefone);
            }catch(e){
              //problema ao decriptar, string nao esta no formato hex
            }
          } 
        } 
      });

      self.setState({ dataMaps: rows });

      var needsUpdates = rows.filter((x) => { return !x.Coordinates; });
      if(needsUpdates.length === 0) console.log("nao precisa atualizar");
      if (needsUpdates && needsUpdates.length > 0) {
          for (let index in needsUpdates) {
            // if(needsUpdates[index]._rawData.length===0) needsUpdates[index].delete(); //se deixar rows vazias na planilha
              let city = needsUpdates[index].City;
              setTimeout(() => 
                  {
                      (async function main() {
                          try{
                              let providerResult = await provider.search({ query: city.replace('-',",") + ', Brazil' });
                      
                              if(providerResult.length !== 0 ){
                                  // throw new Error("endereco-nao-encontrado");
                      
                                  console.log(providerResult);
                                  let latlon = [providerResult[0].y, providerResult[0].x];
                                  needsUpdates[index].Coordinates = JSON.stringify(latlon); // Convert obj to string
                                  //needsUpdates[index].mapCoords = latlon;
                                  await needsUpdates[index].save(); // Save to remote Google Sheet
                              }
                          }catch(e){
                              console.log("ERRO");
                              console.log(e);
                          }
                      })();
                  
                  },1300                        
              );
              
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
                ? <div className="flexLoading"><div className="loading">Carregando...</div></div>
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
                Mapeados: {this.state.rowCount}<br></br>Insira o endereço de quem está sem dinheiro e com fome e o selecione tipo de alimento:
        {/* RADIO BUTTON */}
        <ul>
          <li>
            <label>
              <input
                type="radio"
                value="Alimento de cesta básica"
                checked={this.state.alimento === "Alimento de cesta básica"}
                onChange={this.setTipoAlimento}
              />
              Alimento de cesta básica
            </label>
          </li>
          
          <li>
            <label>
              <input
                type="radio"
                value="Alimento pronto"
                checked={this.state.alimento === "Alimento pronto"}
                onChange={this.setTipoAlimento}
              />
              Alimento pronto
            </label>
          </li>

          
          <li>
            <label>
              <input
                type="radio"
                value="Doador"
                checked={this.state.alimento === "Doador"}
                onChange={this.setTipoAlimento}
              />
              Recebo para doar
            </label>
          </li>
        </ul>
        {/* FIM RADIO BUTTON */}
        <input className="TextField" type="text" placeholder='Insira telefone se quiser' value={this.state.telefone} onChange={this.handleChangeTelefone} />
                <MyLocationButton location={this.state.center} alimento={this.state.alimento} telefone={this.state.telefoneEncryptado}/> 
                <NameForm alimento={this.state.alimento} telefone={this.state.telefoneEncryptado}/> 
                <a className="wpbtn" title="share to whatsapp" href="whatsapp://send?text=Para marcar no mapa e alimentar quem tem fome, achei esse site: https://rslgp.github.io/mapafome"> <img className="wp" src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt=""/>
                Compartilhar no Whatsapp</a>
                <a target='_blank' rel="noreferrer" href="https://t.me/share?url=https%3A%2F%2Frslgp.github.io%2Fmapafome&amp;text=Para%20marcar%20no%20mapa%20e%20alimentar%20quem%20tem%20fome%2C%20achei%20esse%20site%3A" className="tgme_widget_share_btn"><img className="telegram" src="https://telegram.org/img/WidgetButton_LogoSmall.png" alt=""></img></a>

                <img src={qr} alt=""/>
                {/* <CleanOld></CleanOld> */}

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
