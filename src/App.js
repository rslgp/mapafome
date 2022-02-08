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
      alimento:'Alimento pronto',
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
    this.removerPonto = this.removerPonto.bind(this);
  }

  removerPonto(coords, categoriaPonto){
    console.log("remover "+coords);
    let motivo = prompt("por qual motivo (em resumo) gostaria de deletar esse ponto?");
    if(motivo !== null){
      (async function main(self) {
        try{
          await doc.useServiceAccountAuth({
            client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
            });

            await doc.loadInfo(); // Loads document properties and worksheets

            const sheet = doc.sheetsByIndex[4];
            //row = { Name: "new name", Value: "new value" };
            
            const row = { Motivo: motivo, Ponto: JSON.stringify(coords), DateISO: new Date().toISOString(), CategoriaPonto:categoriaPonto};
            
            await sheet.addRow(row);
          
            alert("pedido de deletar enviado com sucesso");
        }catch(e){
          alert("ERRO, tente novamente");
          //console.log(e);

        }
        
      })(motivo, coords);
    }
  }

  entregarAlimento(coords){
    (async function main(self) {
      try{
        await doc.useServiceAccountAuth({
          client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
          });

          await doc.loadInfo(); // Loads document properties and worksheets

          const sheet = doc.sheetsByIndex[0];
          //row = { Name: "new name", Value: "new value" };
          
          const rows = await sheet.getRows();
          let rowEncontrada = rows.filter((x) => { return x.Coordinates === JSON.stringify(coords); });
          
          console.log(rowEncontrada[0].City);
          rowEncontrada[0].AlimentoEntregue++;
          await rowEncontrada[0].save();
          
          window.location.reload();
      }catch(e){
        //console.log(e);

      }
      
    })(coords);
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
    if(event.target.value.length>15) return;
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

    (async function main(self) {
      // Use service account creds
      await doc.useServiceAccountAuth({
        client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
      });

      await doc.loadInfo(); // Loads document properties and worksheets
      
      /*https://www.keene.edu/campus/maps/tool/
        long, lat
        x, y
        -52.2070313, 2.20
        -52.4267578, -13.9234039
        -34.3212891, -14.0939572
        -34.3212891, 1.6696855
0: -8.0256189
1: -34.9175702
        -55.4589844, -32.6578757
        -55.5468750, -14.1791861
        -38.1445313, -14.1791861
        -38.0566406, -32.8426736
      */
     //limitar regiao
      let regiao;
      if(
        //cima baixo
        self.state.center[0]<2.20 && self.state.center[0] > -14.09
        &&
        //esquerda direita
        self.state.center[1]>-52.42 && self.state.center[1] < -34.32        
        ){
          //nordeste
          regiao=0;
        }
        // else
        // if(
        //   //cima baixo
        //   self.state.center[0]<-14.18 && self.state.center[0] > -32.66
        //   &&
        //   //esquerda direita
        //   self.state.center[1]>-55.55 && self.state.center[1] < -38.06        
        //   ){
        //     //sudeste
        //     regiao=3;
        //   }
          else{
            alert("Região ainda não suportada");
            return;
          }
      const sheet = doc.sheetsByIndex[regiao];
      const rows = await sheet.getRows();
      // Total row count
      self.setState({ rowCount: rows.length });
      
      // rows.filter( (x) => { return !x.Data}).map( (x) => {
      //   x.Dados = JSON.stringify(
      //     { 
      //       "Roaster": x.Roaster, 
      //       "URL": x.URL, 
      //       "City": x.City, 
      //       "Coordinates": x.Coordinates, 
      //       "DateISO": x.DateISO, 
      //       "Telefone": x.Telefone, 
      //       "DiaSemana": x.DiaSemana,
      //       "Horario": x.Horario,
      //       "AlimentoEntregue": x.AlimentoEntregue
      //     }
      //   );
      //   (async function main(x){
          
      //   await x.save();
      //   })(x);

      // })
      rows.forEach((x) => {
        let dados = JSON.parse(x.Dados);
        x.Roaster = dados.Roaster;
        x.URL = dados.URL;
        x.City = dados.City;
        x.Coordinates = dados.Coordinates;
        x.DateISO = dados.DateISO;
        x.Telefone = dados.Telefone;
        x.DiaSemana = dados.DiaSemana;
        x.Horario = dados.Horario;
        x.AlimentoEntregue = dados.AlimentoEntregue;
        
        if (dados.Coordinates) { x.mapCoords = JSON.parse(x.Coordinates); 
          if(dados.Telefone) {
            try{
              x.Telefone = aes.decrypt(x.Telefone);
            }catch(e){
              //problema ao decriptar, string nao esta no formato hex
            }
          } 
        }
       
      });
      self.setState({ dataMaps: rows });

      // var needsUpdates = rows.filter((x) => { x = JSON.parse(x); return !x.Coordinates; });
      // if(needsUpdates.length === 0) console.log("nao precisa atualizar");
      // if (needsUpdates && needsUpdates.length > 0) {
      //     for (let index in needsUpdates) {
      //       // if(needsUpdates[index]._rawData.length===0) needsUpdates[index].delete(); //se deixar rows vazias na planilha
      //         let city = needsUpdates[index].City;
      //         setTimeout(() => 
      //             {
      //                 (async function main() {
      //                     try{
      //                         let providerResult = await provider.search({ query: city.replace('-',",") + ', Brazil' });
                      
      //                         if(providerResult.length !== 0 ){
      //                             // throw new Error("endereco-nao-encontrado");
                      
      //                             console.log(providerResult);
      //                             let latlon = [providerResult[0].y, providerResult[0].x];
      //                             needsUpdates[index].Coordinates = JSON.stringify(latlon); // Convert obj to string
      //                             //needsUpdates[index].mapCoords = latlon;
      //                             await needsUpdates[index].save(); // Save to remote Google Sheet
      //                         }
      //                     }catch(e){
      //                         console.log("ERRO");
      //                         console.log(e);
      //                     }
      //                 })();
                  
      //             },1300                        
      //         );
              
      //     }
      //   self.setState({ dataMaps: rows });
      // }

      // Loading message 
      self.setState({ isLoading: false })

    })(self);
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
                : <CoffeeMap dataMapsProp={this.state.dataMaps} location={this.state.center} tileMapOption={this.state.tileMapOption} removerPonto={this.removerPonto} entregarAlimento={this.entregarAlimento}/>
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
                Mapeados: {this.state.rowCount}<br></br>No mapa clique na bolinha para saber como ajudar.<br></br> Você pode se incluir ou incluir outra pessoa, <br></br>selecione a situação e confirme o local (mais informações no final da página):
        {/* RADIO BUTTON */}
        <div className='relativePosition'>
          <ul>
            
          <li>
              <label className='yellowHub'>
                <input
                  type="radio"
                  value="Alimento pronto"
                  checked={this.state.alimento === "Alimento pronto"}
                  onChange={this.setTipoAlimento}
                />
                Pessoa precisando de Alimento pronto <img width="30px" height="30px" src={coffeeBean}></img>
              </label>
            </li>

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
                <br></br><span className="blueHub">  em azul são pessoas <img width="30px" height="30px" src={hub}></img></span>que recebem alimentos ou recursos para distribuir alimento ou refeições na comunidade (exemplo: sopão solidário, ongs, voluntários) --precisam de doações
                <br></br><span className="redHub">  em vermelho são pessoas <img width="30px" height="30px" src={red}></img></span>que entregam refeição em ponto fixo na rua em certo dia na semana. --ponto de entrega de alimento pronto
                <br></br><span className="greenHub">  em verde são pessoas <img width="30px" height="30px" src={green}></img></span>que trabalham com alimentos e precisam destinar os alimentos não comercializados ou não consumidos e não tem pessoas para buscar esses alimentos --precisam de voluntários para buscar 
              
                
                <br></br><br></br>serve para 

<br></br>-mapear pessoas que estão com fome na rua ou em casa
<br></br>-mapear iniciativas que recebem recursos para fazer doação
<br></br>-mostrar no mapa onde e quando tem alimento sendo distribuído
<br></br>-mostrar no mapa lugares comerciais que precisam de voluntários para buscar alimentos não consumidos ou não comercializados
<br></br> é possível traçar uma rota ao destino ao clicar Ir para o destino, e ser redirecionado para o Google Maps            
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
