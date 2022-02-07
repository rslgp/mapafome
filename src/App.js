import React, { Component } from 'react';
import './App.css';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import Header from './components/header';

import InserirEndereco from './components/googlesheets/endereco';
import MyLocationButton from './components/googlesheets/mylocation';
import Sugestao from './components/googlesheets/sugestao';

import CoffeeMap from './components/map.js';
// import CoffeeTable from './components/table';
import ReactGA from 'react-ga';
import CircularProgress from '@material-ui/core/CircularProgress';


import qr from './images/qr.svg';

// Material-UI
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import CleanOld from './components/googlesheets/cleanold';


import coffeeBean from './images/bean.svg';
import hub from './images/hub.svg';
import green from './images/green.svg';
import red from './images/red.svg';

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
      telefoneEncryptado:'',
      diaSemana:'',
      horario:'',

    }

    this.dropDownMenuSemana = React.createRef();
    this.dropDownMenuHorario = React.createRef();
    this.setTipoAlimento = this.setTipoAlimento.bind(this);
    this.handleChangeTelefone = this.handleChangeTelefone.bind(this);
    this.setDiaSemana = this.setDiaSemana.bind(this);
    this.setHorario = this.setHorario.bind(this);
  }

  setTipoAlimento(event){
    this.setState({
      alimento: event.target.value
    });

    if(event.target.value === 'PrecisandoBuscar' || event.target.value === 'EntregaAlimentoPronto'){
      this.setState({
        diaSemana: this.dropDownMenuSemana.current.value,
        horario: this.dropDownMenuHorario.current.value
      });

    }else{
      this.setState({
        diaSemana: '',
        horario: ''
      });

    }

  }

  setDiaSemana(event){
    this.setState({
      diaSemana: event.target.selectedOptions[0].value
    });
    // console.log(this.dropDownMenuSemana.current.value);
    // console.log(event.target.selectedOptions[0].value);
    // console.log(this.state.diaSemana);
  }

  
  setHorario(event){
    this.setState({
      horario: event.target.selectedOptions[0].value
    });
    // console.log(this.dropDownMenuSemana.current.value);
    // console.log(event.target.selectedOptions[0].value);
    // console.log(this.state.diaSemana);
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
        {/* <InserirEndereco/>
        <MyLocationButton location={this.state.center}/> */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Paper id="CoffeeMap" className="fadeIn">
              {this.state.isLoading
                ? <div className="flexLoading"><div className="loading">Carregando...</div></div>
                : <CoffeeMap dataMapsProp={this.state.dataMaps} location={this.state.center} tileMapOption={this.state.tileMapOption}/>
              }
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper id="CoffeeTable"  className="toolPanel">
              {this.state.isLoading
                ? <div className="flexLoading"><div className="loading"><CircularProgress /></div></div>
                // : <CoffeeTable dataMapsProp={this.state.dataMaps} dataHeaderProp={this.state.dataHeader} />
              : 
              
    <div className='relativePosition'>
                Mapeados: {this.state.rowCount}<br></br>No mapa clique na bolinha para saber como ajudar.<br></br> Você pode se marcar ou marcar outra pessoa, <br></br>selecione a situação e confirme o local (mais informações no final da página):
        {/* RADIO BUTTON */}
        <div className='relativePosition'>
          <ul>
            <li>
              <label className='yellowHub'>
                <input
                  type="radio"
                  value="Alimento de cesta básica"
                  checked={this.state.alimento === "Alimento de cesta básica"}
                  onChange={this.setTipoAlimento}
                />
                Preciso de Alimento de cesta básica <img width="30px" height="30px" src={coffeeBean}></img>
              </label>
            </li>
            
            <li>
              <label className='yellowHub'>
                <input
                  type="radio"
                  value="Alimento pronto"
                  checked={this.state.alimento === "Alimento pronto"}
                  onChange={this.setTipoAlimento}
                />
                Preciso de Alimento pronto <img width="30px" height="30px" src={coffeeBean}></img>
              </label>
            </li>

            
            <li>
              <label className='blueHub'>
                <input
                  type="radio"
                  value="Doador"
                  checked={this.state.alimento === "Doador"}
                  onChange={this.setTipoAlimento}
                />
                Recebo para doar <img width="30px" height="30px" src={hub}></img>
              </label>
            </li>

            <li>
            <label className='redHub'>
                <input
                  type="radio"
                  value="EntregaAlimentoPronto"
                  checked={this.state.alimento === "EntregaAlimentoPronto"}
                  onChange={this.setTipoAlimento}
                />
                Entrego refeições em ponto fixo <img width="30px" height="30px" src={red}></img>
              </label>
              <br></br>
              <select ref= {this.dropDownMenuSemana} id="dia" onChange={this.setDiaSemana}>
                <option value="toda Segunda">toda Segunda</option>
                <option value="toda Terça">toda Terça</option>
                <option value="toda Quarta">toda Quarta</option>
                <option value="toda Quinta">toda Quinta</option>
                <option value="toda Sexta">toda Sexta</option>
                <option value="todo Sábado">todo Sábado</option>
                <option value="todo Domingo">todo Domingo</option>
              </select>
              <select ref= {this.dropDownMenuHorario} id="horario" onChange={this.setHorario}>
                <option value="manhã 05:30">manhã 05:30</option>
                <option value="manhã 06:30">manhã 06:30</option>
                <option value="tarde 13:30">tarde 13:30</option>
                <option value="tarde 16:30">tarde 16:30</option>
                <option value="noite 18:30">noite 18:30</option>
                <option value="noite 19:30">noite 19:30</option>
              </select>
            </li>
              <br></br>


            <br></br>
            <li>
              <label className='greenHub'>
                <input
                  type="radio"
                  value="PrecisandoBuscar"
                  checked={this.state.alimento === "PrecisandoBuscar"}
                  onChange={this.setTipoAlimento}
                />
                Tenho alimento perto de se perder  <img width="30px" height="30px" src={green}></img>
              </label>
              <br></br>
              <select ref= {this.dropDownMenuSemana} id="dia" onChange={this.setDiaSemana}>
                <option value="Hoje">Hoje</option>
                <option value="toda Segunda">toda Segunda</option>
                <option value="toda Terça">toda Terça</option>
                <option value="toda Quarta">toda Quarta</option>
                <option value="toda Quinta">toda Quinta</option>
                <option value="toda Sexta">toda Sexta</option>
                <option value="todo Sábado">todo Sábado</option>
                <option value="todo Domingo">todo Domingo</option>
              </select>
              <select ref= {this.dropDownMenuHorario} id="horario" onChange={this.setHorario}>
                <option value="manhã 05:30">manhã 05:30</option>
                <option value="manhã 06:30">manhã 06:30</option>
                <option value="tarde 13:30">tarde 13:30</option>
                <option value="tarde 16:30">tarde 16:30</option>
                <option value="noite 18:30">noite 18:30</option>
                <option value="noite 19:30">noite 19:30</option>
              </select>

              
            </li>

          
          </ul>
    </div>
        {/* FIM RADIO BUTTON */}
        <br></br>
        <br></br>
            <div className='relativePosition'>
                <input className="TextField tfMarginUp" type="text" placeholder='Insira telefone se quiser' value={this.state.telefone} onChange={this.handleChangeTelefone} />
                <MyLocationButton 
                location={this.state.center} 
                alimento={this.state.alimento} 
                telefone={this.state.telefoneEncryptado}
                diaSemana={this.state.diaSemana}
                horario={this.state.horario}
                /> 
                <InserirEndereco 
                alimento={this.state.alimento} 
                telefone={this.state.telefoneEncryptado}
                diaSemana={this.state.diaSemana}
                horario={this.state.horario}
                /> 

                <a className="wpbtn" title="share to whatsapp" href="whatsapp://send?text=Para marcar no mapa e alimentar quem tem fome, achei esse site: https://rslgp.github.io/mapafome"> <img className="wp" src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt=""/>
                Compartilhar no Whatsapp</a>
                <a target='_blank' rel="noreferrer" href="https://t.me/share?url=https%3A%2F%2Frslgp.github.io%2Fmapafome&amp;text=Para%20marcar%20no%20mapa%20e%20alimentar%20quem%20tem%20fome%2C%20achei%20esse%20site%3A" className="tgme_widget_share_btn"><img className="telegram" src="https://telegram.org/img/WidgetButton_LogoSmall.png" alt=""></img></a>

                {/* <img src={qr} alt=""/> */}
                {/* <CleanOld></CleanOld> */}
                No Mapa da Fome você pode encontrar a quem ajudar e fazer novas marcações, caso uma opção represente você ou outra pessoa, selecione, coloque número para contato se quiser, e confirme com localização atual ou endereço e número
                <br></br><span className="yellowHub">  em amarelo são pessoas <img width="30px" height="30px" src={coffeeBean}></img></span>em vulnerabilidade social e insegurança alimentar que estão com fome em casa ou na rua, --precisam de alimento
                <br></br><span className="blueHub">  em azul pessoas <img width="30px" height="30px" src={hub}></img></span>que recebem alimentos ou recursos para distribuir alimento ou refeições na comunidade (exemplo: sopão solidário, ongs, voluntários) --precisam de doações
                <br></br><span className="redHub">  em vermelho são pessoas <img width="30px" height="30px" src={red}></img></span>que entregam refeição em ponto fixo na rua em certo dia na semana. --ponto de entrega de alimento pronto
                <br></br><span className="greenHub">  em verde são pessoas <img width="30px" height="30px" src={green}></img></span>que trabalham com alimentos e precisam destinar os alimentos não comercializados ou não consumidos e não tem pessoas para buscar esses alimentos --precisam de voluntários para buscar 
                <Sugestao/>
              </div>
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
