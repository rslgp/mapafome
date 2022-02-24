import React, { Component } from 'react';

import { 
  OpenStreetMapProvider,
  // BingProvider 
} from 'leaflet-geosearch';

import CircularProgress from '@mui/material/CircularProgress';
import envVariables from '../variaveisAmbiente';

const { GoogleSpreadsheet } = require('google-spreadsheet');

const provider = new OpenStreetMapProvider();

// = new BingProvider({
//   params: {
//     key: process.env.REACT_APP_BING_MAPS_API_KEY
//   },
// });
//

// Google Sheets Document ID -- PROD
const doc = new GoogleSpreadsheet(process.env.REACT_APP_GOOGLESHEETID);

class NameForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        value: '', 
        alimento: props.alimento, 
        isLoading:false,
        telefone:props.telefone,
        diaSemana:props.diaSemana,
        horario:props.horario,
        mes:props.mes,
        redesocial:props.redesocial
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    //ATUALIZAR PROPS VINDAS DO PAI
    static getDerivedStateFromProps(nextProps, state) {
      if(state){
        if (nextProps.alimento !== state.alimento){ 
          state.alimento=nextProps.alimento;
        }
        if (nextProps.telefone !== state.telefone){ 
          state.telefone=nextProps.telefone;
        }
        if (nextProps.diaSemana !== state.diaSemana){ 
          state.diaSemana=nextProps.diaSemana;
        }
        if (nextProps.horario !== state.horario){ 
          state.horario=nextProps.horario;
        }
        if (nextProps.mes !== state.mes){ 
          state.mes=nextProps.mes;
        }
        if (nextProps.redesocial !== state.redesocial){ 
          state.redesocial=nextProps.redesocial;
        }
      }
      return state;
    }
  
    handleChange(event) {
      if(event.target.value.length > 100) return; 
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      //alert('Um endereço foi enviado: ' + this.state.value);
      if(this.state.value === '') {event.preventDefault();return;}
      
      this.setState({isLoading: true});

      (async function main(self) {
        await doc.useServiceAccountAuth({
            client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
        });

        await doc.loadInfo(); // Loads document properties and worksheets

        const sheet = doc.sheetsByIndex[0];
        //row = { Name: "new name", Value: "new value" };
        
        // Total row count
        let numero = self.state.value.replace(/[^0-9]/g,'');
        if(numero === ''){
          alert("faltou colocar o número");
          
          event.preventDefault();
          self.setState({isLoading: false});
          return;
        }
        // const row = { 
        //   Roaster:  self.state.alimento, 
        //   URL:numero, City: self.state.value,
        //   DateISO: new Date().toISOString(), 
        //   Telefone: self.state.telefone, 
        //   DiaSemana: self.state.diaSemana, 
        //   Horario: self.state.horario,
        //   AlimentoEntregue:0,
        // };

        let dadosRow = {};
        dadosRow.alimento = self.state.alimento;
        dadosRow.numero = numero;
        dadosRow.endereco = self.state.value;
        dadosRow.coords = "";
        dadosRow.telefone = self.state.telefone;
        dadosRow.diaSemana = self.state.diaSemana;
        dadosRow.horario = self.state.horario;
        dadosRow.mes = self.state.mes;
        dadosRow.redesocial = self.state.redesocial;
        const row = envVariables.criarRow(dadosRow);
        // let dadosJSON = { 
        //   "Roaster":  self.state.alimento, 
        //   "URL":numero, 
        //   "City": self.state.value,
        //   "DateISO": new Date().toISOString(), 
        //   "Telefone": self.state.telefone, 
        //   "DiaSemana": self.state.diaSemana, 
        //   "Horario": self.state.horario,
        //   "AlimentoEntregue":0,
        //   "RedeSocial":"",
        //   "Avaliacao": {
        //     "1":0,
        //     "2":0,
        //     "3":0,
        //     "4":0,
        //     "5":0
        //   },
        // };

        
        try{
          let dadosJSON = JSON.parse(row.Dados);
          let providerResult = await provider.search({ query: self.state.value.replace('-',",") + ', Brazil' });
  
          if(providerResult.length !== 0 ){
              // throw new Error("endereco-nao-encontrado");
  
              // console.log(providerResult);
              let latlon = [providerResult[0].y,providerResult[0].x];
              dadosJSON.Coordinates = JSON.stringify(latlon).replace(" ","");
              row.Dados = JSON.stringify(dadosJSON); // Convert obj to string
              //needsUpdates[index].mapCoords = latlon;
          }else{
             throw new Error("endereco-nao-encontrado");
          }
        }catch(e){
            console.log("ERRO");
            console.log(e);
            alert("Houve um problema ao cadastrar endereço, porfavor clique no mapa e depois confirme o no botão marcar Local tocado.\nou use o botão marcar Localização Atual");
        }
        await sheet.addRow(row);
       
        self.setState({isLoading: false});
        window.location.reload();
      })(this);
      event.preventDefault();
    }

    
  
    render() {
      return (
        this.state.isLoading ?
        <div><CircularProgress /></div>
        :
        <form onSubmit={this.handleSubmit}>
          <label>
            <input className="TextField" type="text" placeholder='Insira rua,nº,bairro,cidade,estado' value={this.state.value} onChange={this.handleChange} />
          </label>
          <input className="SubmitButton" type="submit" value="Enviar Endereço" />
        </form>
      );
    }
  }
export default NameForm; 