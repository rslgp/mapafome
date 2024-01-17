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
import CircularProgress from '@mui/material/CircularProgress';
import { Checkbox } from '@mui/material';

//call to action content creators
import CreatorsMapaFome from './components/CreatorsMapaFome.js'

import envVariables from './components/variaveisAmbiente';

import qr from './images/qr.svg';

// Material-UI
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import CleanOld from './components/googlesheets/cleanold';


import coffeeBean from './images/bean.svg';
import hub from './images/hub.svg';
import green from './images/green.svg';
import red from './images/red.svg';
import insta from './images/insta.svg';

import AesEncryption from "aes-encryption";

import Cookies from 'universal-cookie';
 
const cookies = new Cookies();
const EXPIRE_DAY = 7;

const aes = new AesEncryption();

// Google Analytics
/*
function initializeReactGA() {
  ReactGA.initialize('UA-172868315-1');
  ReactGA.pageview(window.location.pathname + window.location.search);
}

initializeReactGA();
*/
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
      mes:'',
      filtro:"Todos",
      lastMarkedCoords:[],
      numero:'',
      telefoneFilterLocal:false,
      site:'',
      redesocial:'',

    }

    this.dropDownMenuSemanaEntregaAlimentoPronto = React.createRef();
    this.dropDownMenuHorarioEntregaAlimentoPronto = React.createRef();
    this.dropDownMenuSemanaPrecisandoBuscar = React.createRef();
    this.dropDownMenuHorarioPrecisandoBuscar = React.createRef();
    this.dropDownMenuFiltro = React.createRef();
    this.redesocialRef = React.createRef();
    this.dropDownMenuRedeSocial = React.createRef();
    this.dropDownMenuMesPrecisandoBuscar = React.createRef();
    this.dropDownMenuMesEntregaAlimentoPronto = React.createRef();
  
    
    this.handleChangeNumero = this.handleChangeNumero.bind(this);

    this.setTipoAlimento = this.setTipoAlimento.bind(this);
    this.handleChangeTelefone = this.handleChangeTelefone.bind(this);
    this.setDiaSemana = this.setDiaSemana.bind(this);
    this.setHorario = this.setHorario.bind(this);
    this.setMes = this.setMes.bind(this);
    this.setFiltro = this.setFiltro.bind(this);
    this.removerPonto = this.removerPonto.bind(this);
    this.handleClickMap = this.handleClickMap.bind(this);
    this.telefoneFilterChange = this.telefoneFilterChange.bind(this);
    this.handleChangeRedeSocial = this.handleChangeRedeSocial.bind(this);
  }

  telefoneFilterChange(event){
    envVariables.telefoneFilter = !envVariables.telefoneFilter;
    this.setState({
      telefoneFilterLocal: envVariables.telefoneFilter
    });
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
            
            let r = await sheet.addRow(row);
            console.log(r);
          
            alert("pedido de deletar enviado com sucesso");
        }catch(e){
          alert("ERRO, tente novamente");
          //console.log(e);

        }
        
      })(motivo, coords);
    }
  }

  verificarPonto(coords, categoriaPonto){
    let motivo = prompt("Insira o CNPJ da entidade, nome da entidade, nome do responsável, email, telefone e se é credenciada para receber recurso do governo");
    if(motivo !== null){
      (async function main(self) {
        try{
          await doc.useServiceAccountAuth({
            client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
            });

            await doc.loadInfo(); // Loads document properties and worksheets

            const sheet = doc.sheetsByIndex[3];
            //row = { Name: "new name", Value: "new value" };
            
            const row = { Motivo: motivo, Ponto: JSON.stringify(coords), DateISO: new Date().toISOString(), CategoriaPonto:categoriaPonto};
            
            let r = await sheet.addRow(row);
            console.log(r);
          
            alert("pedido de cnpj enviado com sucesso");
        }catch(e){
          alert("ERRO, tente novamente");
          console.log(e);

        }
        
      })(motivo, coords);
    }
  }

  contabilizarClicado(coords){
    (async function main(self) {
      try{
        await doc.useServiceAccountAuth({
          client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
          });

          await doc.loadInfo(); // Loads document properties and worksheets

          const sheet = doc.sheetsByIndex[0];
          //row = { Name: "new name", Value: "new value" };
          if(envVariables.rows===undefined) envVariables.rows = await sheet.getRows();
          const rows = envVariables.rows;
          coords = JSON.stringify(coords);
          let rowEncontrada = rows.filter((x) => { 
            //x.Coordinates
            //console.log(JSON.parse(x.Dados).Coordinates);
            return JSON.parse(x.Dados).Coordinates === coords; });
          
          //console.log(rowEncontrada[0].City);
          let dadosNovos = JSON.parse(rowEncontrada[0].Dados);
          if(dadosNovos.clicado) dadosNovos.clicado++;
          else dadosNovos.clicado=1;
          rowEncontrada[0].Dados = JSON.stringify(dadosNovos);
          await rowEncontrada[0].save();
          
          //window.location.reload();
      }catch(e){
        //console.log(e);

      }
      
    })(coords);
  }
  
  clicouTelefone(coords){
    (async function main(self) {
      try{
        await doc.useServiceAccountAuth({
          client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
          });

          await doc.loadInfo(); // Loads document properties and worksheets

          const sheet = doc.sheetsByIndex[0];
          //row = { Name: "new name", Value: "new value" };
          if(envVariables.rows===undefined) envVariables.rows = await sheet.getRows();
          const rows = envVariables.rows;
          coords = JSON.stringify(coords);
          let rowEncontrada = rows.filter((x) => { 
            //x.Coordinates
            //console.log(JSON.parse(x.Dados).Coordinates);
            return JSON.parse(x.Dados).Coordinates === coords; });
          
          //console.log(rowEncontrada[0].City);
          let dadosNovos = JSON.parse(rowEncontrada[0].Dados);
          if(dadosNovos.clickTel) dadosNovos.clickTel++;
          else dadosNovos.clickTel=1;
          rowEncontrada[0].Dados = JSON.stringify(dadosNovos);
          await rowEncontrada[0].save();
          
          //window.location.reload();
      }catch(e){
        //console.log(e);

      }
      
    })(coords);
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
          if(envVariables.rows===undefined) envVariables.rows = await sheet.getRows();
          const rows = envVariables.rows;
          coords = JSON.stringify(coords);
          let rowEncontrada = rows.filter((x) => { 
            //x.Coordinates
            //console.log(JSON.parse(x.Dados).Coordinates);
            return JSON.parse(x.Dados).Coordinates === coords; });
          
          //console.log(rowEncontrada[0].City);
          let dadosNovos = JSON.parse(rowEncontrada[0].Dados);
          dadosNovos.AlimentoEntregue++;
          rowEncontrada[0].Dados = JSON.stringify(dadosNovos);
          await rowEncontrada[0].save();
          
          window.location.reload();
      }catch(e){
        //console.log(e);

      }
      
    })(coords);
  }

  avaliar(coords, avaliacao){
    
    (async function main(coords, avaliacao) {
      try{
        await doc.useServiceAccountAuth({
          client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
          });

          await doc.loadInfo(); // Loads document properties and worksheets

          const sheet = doc.sheetsByIndex[0];
          //row = { Name: "new name", Value: "new value" };
          
          if(envVariables.rows===undefined) envVariables.rows = await sheet.getRows();
          const rows = envVariables.rows;
          coords = JSON.stringify(coords);
          let rowEncontrada = rows.filter((x) => { 
            //x.Coordinates
            console.log(JSON.parse(x.Dados).Coordinates);
            return JSON.parse(x.Dados).Coordinates===(coords); });
          
          //console.log(rowEncontrada[0].City);
          let dadosNovos = JSON.parse(rowEncontrada[0].Dados);
          if(dadosNovos.Avaliacao == undefined){
            dadosNovos.Avaliacao = {
              "1":0,
              "2":0,
              "3":0,
              "4":0,
              "5":0
            }
          }
          if(avaliacao===null)avaliacao=5;
          dadosNovos.Avaliacao[avaliacao]++;
          rowEncontrada[0].Dados = JSON.stringify(dadosNovos);
          
          let cookieName='pontosAvaliados';
          let pontos = cookies.get(cookieName) || "";
          coords = JSON.parse(coords);
          let coordsString = coords[0]+""+coords[1];
          //let pontosEntregues = JSON.parse(pontosEntreguesData);
          if(pontos.includes(coordsString)) return;

          await rowEncontrada[0].save();
          
          pontos+=coordsString;

          const cookieExpireDate = new Date();
          cookieExpireDate.setDate(cookieExpireDate.getDate() + EXPIRE_DAY);

          cookies.set(cookieName, pontos, { path: '/', expires: cookieExpireDate });
          
          window.location.reload();
      }catch(e){
        console.log(e);

      }
      
    })(coords, avaliacao);
  }

  setFiltro(event){
    this.setState({
      filtro: event.target.value
    });
  }
  setTipoAlimento(event){
    this.setState({
      alimento: event.target.value
    });
    
    let isPrecisandoBuscar = event.target.value === 'PrecisandoBuscar',
    isEntregaAlimentoPronto = event.target.value === 'EntregaAlimentoPronto',
    isDoador = event.target.value === 'Doador';

    this.dropDownMenuSemanaPrecisandoBuscar.current.style.display="none";
    this.dropDownMenuHorarioPrecisandoBuscar.current.style.display="none";
    this.dropDownMenuMesPrecisandoBuscar.current.style.display="none";
    this.dropDownMenuSemanaEntregaAlimentoPronto.current.style.display="none";
    this.dropDownMenuHorarioEntregaAlimentoPronto.current.style.display="none";
    this.dropDownMenuMesEntregaAlimentoPronto.current.style.display="none";

    if( isPrecisandoBuscar ){
      this.dropDownMenuSemanaPrecisandoBuscar.current.style.display="";
      this.dropDownMenuHorarioPrecisandoBuscar.current.style.display="";
      this.dropDownMenuMesPrecisandoBuscar.current.style.display="";
      this.setState({
        diaSemana: this.dropDownMenuSemanaPrecisandoBuscar.current.value,
        horario: this.dropDownMenuHorarioPrecisandoBuscar.current.value,
        mes: this.dropDownMenuMesPrecisandoBuscar.current.value
      });

    }else    
    if( isEntregaAlimentoPronto ){
      this.dropDownMenuSemanaEntregaAlimentoPronto.current.style.display="";
      this.dropDownMenuHorarioEntregaAlimentoPronto.current.style.display="";
      this.dropDownMenuMesEntregaAlimentoPronto.current.style.display="";
      
      this.setState({
        diaSemana: this.dropDownMenuSemanaEntregaAlimentoPronto.current.value,
        horario: this.dropDownMenuHorarioEntregaAlimentoPronto.current.value,
        mes: this.dropDownMenuMesEntregaAlimentoPronto.current.value
      });

    }
    else {
      this.setState({
        diaSemana: '',
        horario: '',
        mes: ''
      });

    }

    if(isPrecisandoBuscar || isEntregaAlimentoPronto || isDoador){
      this.redesocialRef.current.style.display="";
      this.dropDownMenuRedeSocial.current.style.display="";
    }else{
      this.redesocialRef.current.style.display="none";
      this.dropDownMenuRedeSocial.current.style.display="none";
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

  setMes(event){
    this.setState({
      mes: event.target.selectedOptions[0].value
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

  handleChangeRedeSocial(event){
    let site = event.target.value;
    if(site.length>30) return;
    this.setState({site: site, redesocial:this.dropDownMenuRedeSocial.current.value+site});

  }
  
    
  handleChangeNumero(event) {
    if(event.target.value.length > 10) return;
    let numero = event.target.value.replace(/[^0-9]/g,'');
    this.setState({numero: numero});
  }

  handleClickMap(){
    // this.setState({lastMarkedCoords: coords});
    if(envVariables.lastMarked === undefined) return;
    this.setState({isLoading: true});
    (async function main(self) {
      await doc.useServiceAccountAuth({
          client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
      });

      await doc.loadInfo(); // Loads document properties and worksheets
      let {lat, lng} = envVariables.lastMarked.getLatLng();
      envVariables.lastMarked.latlng = [lat,lng];
      let regiao;
      if(envVariables.dentroLimites(envVariables.lastMarked.latlng)){
        regiao=0;
      }
      else{
        alert("Região não suportada");
        return;
      }
      const sheet = doc.sheetsByIndex[regiao];
      // const rows = await sheet.getRows();
      // Total row count

      // if(this.state.numero !== ''){
      //   this.state.numero = ", nº"+this.state.numero;
      // }
      
      // const row = { 
      //   Roaster: self.state.alimento, 
      //   URL:self.state.numero, 
      //   City: "", 
      //   Coordinates:JSON.stringify([self.props.location[0], self.props.location[1]]), 
      //   DateISO: new Date().toISOString(), 
      //   Telefone: self.props.telefone, 
      //   DiaSemana:self.props.diaSemana,
      //   Horario:self.props.horario,
      //   AlimentoEntregue:0,
      // };

      let dadosRow = {};
      dadosRow.alimento = self.state.alimento;
      dadosRow.numero = "";
      dadosRow.endereco = "";
      dadosRow.coords = envVariables.lastMarked.latlng;
      dadosRow.telefone = self.state.telefoneEncryptado;
      dadosRow.diaSemana = self.state.diaSemana;
      dadosRow.horario = self.state.horario;
      dadosRow.mes = self.state.mes;
      dadosRow.redesocial = self.state.redesocial;

      let row = envVariables.criarRow(dadosRow);
      // if(self.state.numero !== ''){
      //   self.state.numero = ", nº"+self.state.numero;
      // }
      // let dadosJSON = {
      //   "Roaster": self.state.alimento, 
      //   "Coordinates":JSON.stringify(envVariables.lastMarked.latlng), 
      //   "DateISO": new Date().toISOString(), 
      //   "Telefone": self.state.telefoneEncryptado, 
      //   "AlimentoEntregue":0,
      //   "URL":self.state.numero
      // };

      // if(self.state.alimento==='EntregaAlimentoPronto' || self.state.alimento==='PrecisandoBuscar')
      // {
      //   dadosJSON.DiaSemana=self.state.diaSemana;
      //   dadosJSON.Horario=self.state.horario;
        
      // }
      // row = { Dados: JSON.stringify(dadosJSON) };
      
      const result = await sheet.addRow(row);
      // console.log(result);
      window.location.reload();
  })(this);
  }

  componentDidMount() {

    // Google Sheets API
    // Based on https://github.com/theoephraim/node-google-spreadsheet

    var self = this;

    //current location    
    navigator.geolocation.getCurrentPosition(function(position) {
      envVariables.currentLocation = [position.coords.latitude, position.coords.longitude];
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
      if(envVariables.dentroLimites(self.state.center)){
        regiao=0;
      }     
      else{
        alert("Região ainda não suportada");
        return;
      }
      const sheet = doc.sheetsByIndex[regiao];
      if(envVariables.rows===undefined) envVariables.rows = await sheet.getRows();
      const rows = envVariables.rows;
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
        for(let key in dados){
          x[key] = dados[key];
        }
        // x.Roaster = dados.Roaster;
        // x.URL = dados.URL;
        // x.City = dados.City;
        // x.DateISO = dados.DateISO;
        // x.DiaSemana = dados.DiaSemana;
        // x.Horario = dados.Horario;
        // x.Mes = dados.Mes;
        // x.AlimentoEntregue = dados.AlimentoEntregue;
        // x.RedeSocial = dados.RedeSocial;
        // x.Avaliacao = dados.Avaliacao;
        
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

    window.fixarPonto = function (endereco, coords){
      (async function main(endereco, coords) {
        try{
          await doc.useServiceAccountAuth({
            client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
          });
      
          await doc.loadInfo(); // Loads document properties and worksheets
      
          const sheet = doc.sheetsByIndex[0];
          
          if(envVariables.rows===undefined) envVariables.rows = await sheet.getRows();
          const rows = envVariables.rows;

          let rowEncontrada = rows.filter( (x) => 
          {
            return JSON.parse(x.Dados).City.includes(endereco);
          }
          );

          rowEncontrada.forEach( (x) => 
          {
            let dadosNovos = JSON.parse(x.Dados);
            dadosNovos.Coordinates = JSON.stringify(coords);
            x.Dados = JSON.stringify(dadosNovos);
          });

          for(let x of rowEncontrada) await x.save();

        }catch(e){
          
        }
        
      })(endereco, coords);
    }

    //retornar os pontos proximos a 5km
    window.distance = function(){
      const rows = envVariables.rows;
      let proximos = [];
      rows.forEach( (x) => {
        let dado = JSON.parse(x.Dados);
        if(dado.Coordinates){
          let coords = JSON.parse(dado.Coordinates);
          let distancia = envVariables.distanceInKmBetweenEarthCoordinates(
            envVariables.currentLocation[0], 
            envVariables.currentLocation[1], 
            coords[0], 
            coords[1]);
            dado.distancia = distancia;
          if(distancia < 5) proximos.push(dado);
        }
      });
      
      proximos.sort(function(a,b){
        return a.distancia - b.distancia;
      });
      console.log(proximos);

    }
    window.stats = function (){
      (async function main() {
        try{
          await doc.useServiceAccountAuth({
            client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
          });
      
          await doc.loadInfo(); // Loads document properties and worksheets
      
          const sheet = doc.sheetsByIndex[0];
          
          if(envVariables.rows===undefined) envVariables.rows = await sheet.getRows();
          const rows = envVariables.rows;
  
          let rowEncontrada = rows.filter( (x) => 
          {
            return JSON.parse(x.Dados).clicado;
          }
          );
          var SortedPoints = [];
          var tmp;
          rowEncontrada.forEach( (x) => 
          {
            let dadosNovos = JSON.parse(x.Dados);
            if(dadosNovos.Telefone) dadosNovos.Telefone = "https://wa.me/55"+aes.decrypt(dadosNovos.Telefone);
            SortedPoints.push(dadosNovos);
            for (var i = SortedPoints.length - 1; i > 0 && SortedPoints[i].clicado > SortedPoints[i-1].clicado; i--) {
                tmp = SortedPoints[i];
                SortedPoints[i] = SortedPoints[i-1];
                SortedPoints[i-1] = tmp;
            }
          });
          console.log("mais clicados");
          console.log(SortedPoints);

          
          rowEncontrada = rows.filter( (x) => 
          {
            return JSON.parse(x.Dados).clickTel;
          }
          );
          var SortedPoints = [];
          var tmp;
          rowEncontrada.forEach( (x) => 
          {
            let dadosNovos = JSON.parse(x.Dados);
            dadosNovos.Telefone = "https://wa.me/55"+aes.decrypt(dadosNovos.Telefone);
            SortedPoints.push(dadosNovos);
            for (var i = SortedPoints.length - 1; i > 0 && SortedPoints[i].clickTel > SortedPoints[i-1].clickTel; i--) {
                tmp = SortedPoints[i];
                SortedPoints[i] = SortedPoints[i-1];
                SortedPoints[i-1] = tmp;
            }
          });
          console.log("mais clicados em telefone");
          console.log(SortedPoints);

          rowEncontrada = rows.filter( (x) => 
          {
            return JSON.parse(x.Dados).AlimentoEntregue;
          }
          );
          var SortedPoints = [];
          var tmp;
          rowEncontrada.forEach( (x) => 
          {
            let dadosNovos = JSON.parse(x.Dados);
            SortedPoints.push(dadosNovos);
            for (var i = SortedPoints.length - 1; i > 0 && SortedPoints[i].AlimentoEntregue > SortedPoints[i-1].AlimentoEntregue; i--) {
                tmp = SortedPoints[i];
                SortedPoints[i] = SortedPoints[i-1];
                SortedPoints[i-1] = tmp;
            }
          });
          console.log("mais entregues");
          console.log(SortedPoints);


          rowEncontrada = rows.filter( (x) => 
          {
            return JSON.parse(x.Dados).Avaliacao;
          }
          );
          var SortedPoints = [];
          var tmp;
          rowEncontrada.forEach( (x) => 
          {
            let dadosNovos = JSON.parse(x.Dados);

            let AvaliacaoData = {nota:0, totalClicks:0};
            if(dadosNovos.Avaliacao){
                AvaliacaoData.totalClicks = (dadosNovos.Avaliacao["5"]+dadosNovos.Avaliacao["4"]+dadosNovos.Avaliacao["3"]+dadosNovos.Avaliacao["2"]+dadosNovos.Avaliacao["1"]);
                if( AvaliacaoData.totalClicks === 0 ){
                  //dadosNovos.Avaliacao="Nenhuma";
                }else{
                  dadosNovos.Avaliacao = (dadosNovos.Avaliacao["5"]*5 +
                    dadosNovos.Avaliacao["4"]*4 +
                    dadosNovos.Avaliacao["3"]*3 +
                    dadosNovos.Avaliacao["2"]*2 +
                    dadosNovos.Avaliacao["1"]*1)
                    /            
                    (AvaliacaoData.totalClicks);
    
                    AvaliacaoData.nota = Math.round(dadosNovos.Avaliacao * 100)/100;
                    AvaliacaoData.nota=AvaliacaoData.nota*100000+AvaliacaoData.totalClicks;
                }
            }
    
            //AvaliacaoData.nota = dadosNovos.Avaliacao;

            if(AvaliacaoData.nota>0) SortedPoints.push({...JSON.parse(x.Dados),"nota":AvaliacaoData.nota});
            for (var i = SortedPoints.length - 1; i > 0 && SortedPoints[i].nota > SortedPoints[i-1].nota; i--) {
                tmp = SortedPoints[i];
                SortedPoints[i] = SortedPoints[i-1];
                SortedPoints[i-1] = tmp;
            }
          });
          console.log("maiores notas");
          console.log(SortedPoints);          

  
        }catch(e){
          
        }
        
      })();
    }

//     window.planilhacsv = function (){
//       (async function main() {
//         try{
//           await doc.useServiceAccountAuth({
//             client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
//             private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
//           });
      
//           await doc.loadInfo(); // Loads document properties and worksheets
      
//           const sheet = doc.sheetsByIndex[0];
          
//           if(envVariables.rows===undefined) envVariables.rows = await sheet.getRows();
//           const rows = envVariables.rows;
  
//           let rowEncontrada = rows.filter( (x) => 
//           {
//             return JSON.parse(x.Dados).Telefone;
//           }
//           );
//           var planilhacsv="Situação,Telefone,coords,RedeSocial\n";
//           var tmp;
//           var result = {};
//           rowEncontrada.forEach( (x) => 
//           {
//             let y = JSON.parse(x.Dados);
//             planilhacsv+=[y.Roaster,aes.decrypt(y.Telefone),y.Coordinates,y.RedeSocial].toString()+"\n";
//           });
//           console.log(planilhacsv);

//           /**
//            * 
//            * {
//     "11": "São Paulo",
//     "12": "São Paulo",
//     "13": "São Paulo",
//     "14": "São Paulo",
//     "15": "São Paulo",
//     "16": "São Paulo",
//     "17": "São Paulo",
//     "18": "São Paulo",
//     "19": "São Paulo",
//     "21": "Rio de Janeiro",
//     "22": "Rio de Janeiro",
//     "24": "Rio de Janeiro",
//     "27": "Espírito Santo",
//     "28": "Espírito Santo",
//     "31": "Minas Gerais",
//     "32": "Minas Gerais",
//     "33": "Minas Gerais",
//     "34": "Minas Gerais",
//     "35": "Minas Gerais",
//     "37": "Minas Gerais",
//     "38": "Minas Gerais",
//     "41": "Paraná",
//     "42": "Paraná",
//     "43": "Paraná",
//     "44": "Paraná",
//     "45": "Paraná",
//     "46": "Paraná",
//     "47": "Santa Catarina",
//     "48": "Santa Catarina",
//     "49": "Santa Catarina",
//     "51": "Rio Grande do Sul",
//     "53": "Rio Grande do Sul",
//     "54": "Rio Grande do Sul",
//     "55": "Rio Grande do Sul",
//     "61": "Distrito Federal",
//     "62": "Goiás",
//     "63": "Tocantins",
//     "64": "Goiás",
//     "65": "Mato Grosso",
//     "66": "Mato Grosso",
//     "67": "Mato Grosso do Sul",
//     "68": "Acre",
//     "69": "Rondônia",
//     "71": "Bahia",
//     "73": "Bahia",
//     "74": "Bahia",
//     "75": "Bahia",
//     "77": "Bahia",
//     "79": "Sergipe",
//     "81": "Pernambuco",
//     "82": "Alagoas",
//     "83": "Paraíba",
//     "84": "Rio Grande do Norte",
//     "85": "Ceará",
//     "86": "Piauí",
//     "87": "Pernambuco",
//     "88": "Ceará",
//     "89": "Piauí",
//     "91": "Pará",
//     "92": "Amazonas",
//     "93": "Pará",
//     "94": "Pará",
//     "95": "Roraima",
//     "96": "Amapá",
//     "97": "Amazonas",
//     "98": "Maranhão",
//     "99": "Maranhão"
// }
//            */

  
//         }catch(e){
          
//         }
        
//       })();
//     }
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
                : <CoffeeMap 
                dataMapsProp={this.state.dataMaps} 
                location={this.state.center} 
                tileMapOption={this.state.tileMapOption} 
                removerPonto={this.removerPonto} 
                verificarPonto={this.verificarPonto} 
                entregarAlimento={this.entregarAlimento}
                avaliar={this.avaliar}
                filtro={this.state.filtro}
                contabilizarClicado={this.contabilizarClicado}
                clicouTelefone={this.clicouTelefone}
                />
              }
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={4}>
          {/* https://smartdevpreneur.com/setting-material-ui-grid-item-height/ */}
            <Paper id="CoffeeTable" style={{height:'100%'}} className="toolPanel2">
              {this.state.isLoading
                ? <div className="flexLoading"><div className="loading"><CircularProgress /></div></div>
                // : <CoffeeTable dataMapsProp={this.state.dataMaps} dataHeaderProp={this.state.dataHeader} />
              : 
              
    <div className='relativePosition'>
      {/* <a target='_blank' rel="noreferrer" href="https://api.whatsapp.com/send/?phone=5583996157234&text=quero+me+voluntariar+no+mapa+fome&app_absent=0">quero me voluntariar no Mapa Fome</a>
      <br/> */}
      filtro atual:  
              <select ref= {this.dropDownMenuFiltro} id="filtro" onChange={this.setFiltro}>
                <option value="Todos">Todos</option>
                <option value="Doadores">Doadores</option>
                <option value="CestaBasica">Cesta básica</option>
                <option value="MoradorRua">Situação de rua</option>
                <option value="Refeição Pronta">Refeição Pronta</option>
                <option value="RedeSocial">Rede Social</option>
                <option value="Verificados">possui CNPJ</option>
                <option value="Nenhum">Nenhum</option>
              </select>
              <Checkbox
                checked={this.state.telefoneFilterLocal}
                onChange={this.telefoneFilterChange}
                inputProps={{ 'aria-label': 'controlled' }}
              /> Telefone
                {/* RADIO BUTTON */}
        <div className='relativePosition'>
          <ul>
            
          <li>
              <label className='uxLi'>
                <input
                  type="radio"
                  value="Teste"
                  checked={this.state.alimento === "Teste"}
                  onChange={this.setTipoAlimento}
                />
                <span> Opção para testar a ferramenta </span>
              </label>
            </li>
          <li>
              <label className='uxLi'>
                <input
                  type="radio"
                  value="Alimento pronto"
                  checked={this.state.alimento === "Alimento pronto"}
                  onChange={this.setTipoAlimento}
                />
                <span className='yellowHub'> Pessoa precisando de Alimento pronto <img width="30px" height="30px" src={coffeeBean}></img></span>
              </label>
            </li>

            <li>
              <label className='uxLi'>
                <input
                  type="radio"
                  value="Alimento de cesta básica"
                  checked={this.state.alimento === "Alimento de cesta básica"}
                  onChange={this.setTipoAlimento}
                />
                <span className='yellowHub'> Preciso de Alimento de cesta básica <img width="30px" height="30px" src={coffeeBean}></img></span>
              </label>
            </li>
                        
            <li>
              <label className='uxLi'>
                <input
                  type="radio"
                  value="Doador"
                  checked={this.state.alimento === "Doador"}
                  onChange={this.setTipoAlimento}
                />
                <span className='blueHub'> Recebo para doar <img width="30px" height="30px" src={hub}></img></span>
              </label>
            </li>

            <li>
            <label className='uxLi'>
                <input
                  type="radio"
                  value="EntregaAlimentoPronto"
                  checked={this.state.alimento === "EntregaAlimentoPronto"}
                  onChange={this.setTipoAlimento}
                />
                <span className='redHub'> Entrego refeições em ponto fixo <img width="30px" height="30px" src={red}></img></span>
              
                <br></br>
                <select ref= {this.dropDownMenuSemanaEntregaAlimentoPronto} style={{"display":"none"}} id="dia" onChange={this.setDiaSemana}>
                <option value="nas Segundas">nas Segundas</option>
                <option value="nas Terças">nas Terças</option>
                <option value="nas Quartas">nas Quartas</option>
                <option value="nas Quintas">nas Quintas</option>
                <option value="nas Sextas">nas Sextas</option>
                <option value="nos Sábados">nos Sábados</option>
                <option value="nos Domingos">nos Domingos</option>
                <option value="todo dia">todo dia</option>
              </select>
              <select ref= {this.dropDownMenuHorarioEntregaAlimentoPronto} style={{"display":"none"}} id="horario" onChange={this.setHorario}>
                <option value="manhã 05:30">manhã 05:30</option>
                <option value="manhã 06:30">manhã 06:30</option>
                <option value="manhã 09:30">manhã 09:30</option>
                <option value="tarde 13:30">tarde 13:30</option>
                <option value="tarde 16:30">tarde 16:30</option>
                <option value="noite 18:30">noite 18:30</option>
                <option value="noite 19:30">noite 19:30</option>
              </select>

              
              <select ref= {this.dropDownMenuMesEntregaAlimentoPronto} style={{"display":"none"}} id="mes2" onChange={this.setMes}>
                <option value="x4 por mês">x4 por mês</option>
                <option value="x3 por mês">x3 por mês</option>
                <option value="x2 por mês">x2 por mês</option>
                <option value="x1 por mês">x1 por mês</option>
              </select>
              </label>
            </li>

            <li>
              <label className='uxLi'>
                <input
                  type="radio"
                  value="PrecisandoBuscar"
                  checked={this.state.alimento === "PrecisandoBuscar"}
                  onChange={this.setTipoAlimento}
                />
                <span className='greenHub'> Tenho alimento perto de se perder <a target='_blank' rel="noreferrer" href="https://www.camara.leg.br/noticias/670937-nova-lei-incentiva-empresas-a-doarem-alimentos-e-refeicoes-para-pessoas-vulneraveis/">(lei)</a>  <img width="30px" height="30px" src={green}></img></span>
              
              <br></br>
              <select ref= {this.dropDownMenuSemanaPrecisandoBuscar} style={{"display":"none"}} id="dia2" onChange={this.setDiaSemana}>
                <option value="Hoje">Hoje</option>
                <option value="nas Segundas">nas Segundas</option>
                <option value="nas Terças">nas Terças</option>
                <option value="nas Quartas">nas Quartas</option>
                <option value="nas Quintas">nas Quintas</option>
                <option value="nas Sextas">nas Sextas</option>
                <option value="nos Sábados">nos Sábados</option>
                <option value="nos Domingos">nos Domingos</option>
              </select>
              <select ref= {this.dropDownMenuHorarioPrecisandoBuscar} style={{"display":"none"}} id="horario2" onChange={this.setHorario}>
                <option value="manhã 05:30">manhã 05:30</option>
                <option value="manhã 06:30">manhã 06:30</option>
                <option value="manhã 09:30">manhã 09:30</option>
                <option value="tarde 13:30">tarde 13:30</option>
                <option value="tarde 16:30">tarde 16:30</option>
                <option value="noite 18:30">noite 18:30</option>
                <option value="noite 19:30">noite 19:30</option>
              </select>
              
              <select ref= {this.dropDownMenuMesPrecisandoBuscar} style={{"display":"none"}} id="mes2" onChange={this.setMes}>
                <option value="x4 por mês">x4 por mês</option>
                <option value="x3 por mês">x3 por mês</option>
                <option value="x2 por mês">x2 por mês</option>
                <option value="x1 por mês">x1 por mês</option>
              </select>
              </label>
              
            </li>

          
          </ul>
    </div>
        {/* FIM RADIO BUTTON */}
            <div className='relativePosition'>
                
                <input className="TextField tfMarginUp" type="text" placeholder='Insira DDD telefone se quiser' /*value={this.state.telefone}*/ onBlur={this.handleChangeTelefone} />
                <input className='nLocal' type="text" placeholder='nº' /*value={this.state.numero}*/ onBlur={this.handleChangeNumero} />
                
                <br/>
                <select style={{"display":"none"}} ref= {this.dropDownMenuRedeSocial}>
                  <option value="instagram.com/">Insta</option>
                  <option value="facebook.com/">Face</option>
                </select>
                <input ref= {this.redesocialRef} style={{"display":"none"}} className="TextField" type="text" placeholder='@' /*value={this.state.site}*/ onBlur={this.handleChangeRedeSocial} />
                
                <br></br>
                <div className='buttonsSidebySide'>
                  <MyLocationButton
                  location={this.state.center} 
                  alimento={this.state.alimento} 
                  telefone={this.state.telefoneEncryptado}
                  diaSemana={this.state.diaSemana}
                  horario={this.state.horario}
                  numero={this.state.numero}
                  redesocial={this.state.redesocial}
                  mes={this.state.mes}
                  /> 

                  {this.state.isLoading?
                  <CircularProgress/>
                  :<button className="SubmitButton buttonsSidebySide" onClick={this.handleClickMap}>marcar Local Tocado</button>}
                </div>
                <figure><center>OU</center></figure>
                <InserirEndereco 
                alimento={this.state.alimento} 
                telefone={this.state.telefoneEncryptado}
                diaSemana={this.state.diaSemana}
                horario={this.state.horario}
                redesocial={this.state.redesocial}
                mes={this.state.mes}
                /> 

                {/* <input className="TextField" type="text" placeholder='Insira o site do projeto' value={this.state.site} onChange={this.handleChangeSite} />
                <br></br> */}
                

               
              </div>
              
          </div>
               
              }
            </Paper>
          </Grid>


          <Grid item xs={12} sm={12}>
            <Paper id="MoreInfo" style={{height:'100%'}} >
            {/* Contribua também Sinalizando projetos que arrecadam e entregam alimentos na sua cidade, <a target='_blank' rel="noreferrer" href="https://www.google.com.br/search?q=suaCidade+~voluntarios+OR+%22grupo%22+AND+~doacoes+AND+%22alimentos%22+%2290000..99999%22+OR+%228000..9999%22">entrando em contato com eles</a> para eles sinalizarem
             <br/>  */}
            <a className="wpbtn" title="share to whatsapp" href="whatsapp://send?text=Para marcar no mapa e alimentar quem tem fome, achei esse site: www.mapafome.com.br"> <img className="wp" src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt=""/>
                Compartilhar no Whatsapp</a>
                <a style={{float:'right'}} target='_blank' rel="noreferrer" href="https://t.me/share?url=www.mapafome.com.br&amp;text=Para%20marcar%20no%20mapa%20e%20alimentar%20quem%20tem%20fome%2C%20achei%20esse%20site%3A" className="tgme_widget_share_btn"><img className="telegram" src="https://telegram.org/img/WidgetButton_LogoSmall.png" alt=""></img></a>

                <br></br>
              Mapeados: {this.state.rowCount}<br></br>
              <a href='https://play.google.com/store/apps/details?id=br.com.mapafome'><img style={{height:'55px'}} alt='Disponível no Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/pt_badge_web_generic.png'/></a>
              <a target='_blank' rel="noreferrer" href="https://instagram.com/mapafome"><img style={{height:'55px'}}src="data:image/png;base64,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"/></a>
            
              <br></br>No mapa clique na bolinha para saber como ajudar.<br></br> Você pode se incluir ou incluir outra pessoa, <br></br>selecione a situação e confirme o local (mais informações <a target='_blank' rel="noreferrer" href="https://g1.globo.com/pe/pernambuco/noticia/2022/02/10/site-criado-por-estudante-da-ufpe-aproxima-pessoas-que-estao-passando-fome-e-doadores-de-comida.ghtml">na matéria da Globo</a>)(<a href="https://globoplay.globo.com/v/10350537/">e jornal hoje da Globo em rede nacional</a>):
              <br></br><span className="yellowHub">  em amarelo são pessoas <img width="30px" height="30px" src={coffeeBean}></img></span>em vulnerabilidade social e insegurança alimentar que estão com fome em casa ou na rua, --precisam de alimento
              <br></br><span className="blueHub">  em azul são pessoas <img width="30px" height="30px" src={hub}></img></span>que recebem alimentos ou recursos para distribuir alimento ou refeições na comunidade (exemplo: sopão solidário, ongs, voluntários) --precisam de doações
              <br></br><span className="redHub">  em vermelho são pessoas <img width="30px" height="30px" src={red}></img></span>que entregam refeição em ponto fixo na rua em certo dia na semana. --ponto de entrega de alimento pronto
              <br></br><span className="greenHub">  em verde são pessoas <img width="30px" height="30px" src={green}></img></span>que trabalham com alimentos e precisam destinar os alimentos não comercializados ou não consumidos e não tem pessoas para buscar esses alimentos (exemplo: restaurante, hotel, lanchonete, feira livre, supermercados) --precisam de voluntários para buscar 
            
              <br></br>
              <br></br>
              <CreatorsMapaFome/>
              <br/>
			  em agradecimento a formação humana, moral e ética que recebi dos meus professores de Filosofia e Sociologia do ensino médio
			  <br/><span style={{"font-size":"1.4em","color":"blue"}}>•</span>por terem passado o premiado documentário com base em fatos reais curta de 13 minutos do brasileiro Jorge Furtado <a target='_blank' rel="noreferrer" href="https://www.youtube.com/watch?v=JcP9v5mZT9w">Ilha das Flores</a>
			  <br/><span style={{"font-size":"1.4em","color":"blue"}}>•</span>após 10 anos de ter assistido, aprendido e internalizado e entendido nosso papel como sociedade e comunidade, tive a oportunidade de agir usando conhecimento e tecnologias acumulado ao longo do tempo 
			  <br/><span style={{"font-size":"1.4em","color":"blue"}}>•</span>e a base para criação de projetos (pesquisa de campo e Project Manager) obtida na disciplina de Projetão CIn UFPE 
			  <br/><span style={{"font-size":"1.4em","color":"red"}}>•</span>resultou em obter as ferramentas necessárias para agir em favor das pessoas que passam fome
			  <br/><span style={{"font-size":"1.4em","color":"red"}}>•</span>e dar visibilidade, e contribuir junto com as pessoas de bom coração a elas que rotinamente agem alimentando quem não tem dinheiro para comprar comida
			  <br/><span style={{"font-size":"1.4em","color":"green"}}>•</span>e contribuir com os comerciantes de alimentos a reduzirem o desperdício de alimento
			  <br/><span style={{"font-size":"1.4em","color":"red"}}>•</span>e motivar e ofertar ferramentas necessárias para cada ser humano fazer sua parte e poder colaborar de forma recorrente, saber e encontrar a quem ofertar alimento
			  <br/><span style={{"font-size":"1.4em","color":"orange"}}>•</span>ou se não com o alimento, com o compartilhamento de informação ao informar da existência do MAPA FOME que é gratuito, a quem precisa e a quem pode ajudar, pois irão saber a quem buscar
			  <br/><span style={{"font-size":"1.4em","color":"red"}}>•</span>sem comida, qualquer ser humano morre prematuramente. e qualquer pessoa ao deixar de prestar assistência, quando possível fazê-lo sem risco pessoal, à pessoa (...) ao desamparo ou em grave e iminente perigo = praticar crime de Omissão de socorro Art. 135 Código Penal Brasileiro
			  
			  <table style={{"width":"94%", "text-align":"center"}}>
				  <tr style={{"background-color":"#c8dff5"}}>
					<th style={{"width":"7%"}}>Tempo<br/>de<br/>Fome</th>
					<th style={{"width":"86%"}}>Consequências ruins</th>
					<th style={{"width":"7%"}}>Risco de vida<br/>da pessoa<br/>desamparada</th>
				  </tr>
				  <tr>
					<td>0-3<br/>horas</td>
					<td>Mudança mínima</td>
					<td>0</td>
				  </tr>
				  <tr style={{"background-color":"#c8dff5"}}>
					<td>4-8<br/>horas</td>
					<td style={{"padding":"3%"}}>Você vai sentir mais fome e sua barriga vai doer um pouco, e pode ter dor de cabeça</td>
					<td>0</td>
				  </tr>
				  <tr>
					<td>9-12<br/>horas</td>
					<td style={{"padding":"3%"}}>Você vai começar a se sentir cansado e rabugento, raivoso, irritado, estressado e vai ter dor de cabeça</td>
					<td>baixa</td>
				  </tr>
				  <tr style={{"background-color":"#c8dff5"}}>
					<td>13-16<br/>horas</td>
					<td style={{"padding":"3%"}}>vai ser mais difícil prestar atenção ou se concentrar</td>
					<td>moderada</td>
				  </tr>
				  <tr>
					<td>17-24<br/>horas</td>
					<td style={{"padding":"3%"}}>Seu corpo vai não ter açúcar suficiente, o que vai fazer você se sentir tonto ou TREMENDO</td>
					<td>moderada</td>
				  </tr>
				  <tr style={{"background-color":"#c8dff5"}}>
					<td>25-48<br/>horas</td>
					<td style={{"padding":"3%"}}>Você vai se sentir fraco e entra em situação de alto estresse e em modo de sobrevivência seu coração vai bater mais rápido pois falta energia que vem da comida, então tenta trabalhar dobrado na tentativa de manter o resultado (entrega de oxigênio e nutrientes para orgão vitais)</td>
					<td>alta</td>
				  </tr>
				  <tr>
					<td>49-72<br/>horas</td>
					<td style={{"padding":"3%"}}>Seu corpo vai começar a usar energia armazenada (gordura,...), o que vai fazer você se sentir cansado e seu sistema imunológico vai não funcionar tão bem, fica doente mais facilmente</td>
					<td>alta</td>
				  </tr>
				  <tr style={{"background-color":"#c8dff5"}}>
					<td>3-7<br/>dias</td>
					<td style={{"padding":"3%"}}>Os músculos passam a serem consumidos como energia, você vai se sentir muito fraco e seus músculos vão diminuir. Isso não é bom para o seu corpo, danifica o organismo. Diminuição da motivação ou produtividade</td>
					<td>alta</td>
				  </tr>
				  <tr>
					<td>8-14<br/>dias</td>
					<td style={{"padding":"3%"}}>Seus órgãos, que são partes importantes do seu corpo, vão ficar feridos e você vai ficar doente muito mais facilmente</td>
					<td>muito alta</td>
				  </tr>
				  <tr style={{"background-color":"#c8dff5"}}>
					<td>15-21<br/>dias</td>
					<td style={{"padding":"3%"}}>Você vai ficar muito doente e sua vida vai estar em perigo</td>
					<td>extremamente alto</td>
				  </tr>
				  <tr>
					<td>22+<br/>dias</td>
					<td style={{"padding":"3%"}}>Você está em perigo extremo porque seu corpo não está recebendo comida suficiente, e seus órgãos vão parar de funcionar corretamente ou parar a qualquer momento</td>
					<td>extremamente alto</td>
				  </tr>
				</table>
        <br/>Conclusão: Faço um apelo a você tomar medidas e ações solidárias e qualquer forma de iniciativa recorrentes, em intervalos de 1 dia a 14 dias (intervalos recorrentes de mínimo diário ou menos, máximo 2 semanas ou menos), alivie a dor e sofrimento de outro ser humano
				<br/>
              
                {/* <img src={qr} alt=""/> */}
                {/* <CleanOld></CleanOld> */}
                <img className="ods" alt="" src="https://brasil.un.org/profiles/undg_country/themes/custom/undg/images/SDGs/pt-br/SDG-2.svg"></img> No Mapa Fome você pode encontrar a quem ajudar e fazer novas marcações, caso uma opção represente você ou outra pessoa, selecione, coloque número para contato se quiser, e confirme com localização atual ou endereço e número
              
                
                <br></br><br></br>serve para 

<br></br>-mapear pessoas que estão com fome na rua ou em casa
<br></br>-mapear iniciativas que recebem recursos para fazer doação
<br></br>-mostrar no mapa onde e quando tem alimento sendo distribuído
<br></br>-mostrar no mapa lugares comerciais ou residenciais que precisam de voluntários ou necessitados para buscar alimentos não consumidos ou não comercializados
<br></br> é possível traçar uma rota ao destino ao clicar Ir para o destino, e ser redirecionado para o Google Maps
<br></br>
contato: <a target='_blank' rel="noreferrer" href="https://mail.google.com/mail/u/0/?fs=1&to=rslgp@cin.ufpe.br&tf=cm" >rslgp@cin.ufpe.br</a> <a target='_blank' rel="noreferrer"  href='https://wa.me/5583996157234'>(83) 9.9615-7234</a>           
<Sugestao/>
        <a target='_blank' rel="noreferrer" href="./privacy.html">Privacy Policy</a>
        <span> - </span>
        <a target='_blank' rel="noreferrer" href="./terms.html">Terms</a>
        </Paper>
          </Grid>

        </Grid>

      </div>
    );
  }
}

export default App;
