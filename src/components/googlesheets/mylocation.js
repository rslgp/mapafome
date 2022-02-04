import React, { Component } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

const { GoogleSpreadsheet } = require('google-spreadsheet');


// Google Sheets Document ID -- PROD
const doc = new GoogleSpreadsheet(process.env.REACT_APP_GOOGLESHEETID);

class NameForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        value: '', 
        location: props.location, 
        alimento: props.alimento, 
        isLoading:props.isLoading,
        telefone:props.telefone,
        diaSemana:props.diaSemana,
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

    }

    
  componentDidMount() {
      
    //salvar acesso  
      
    (async function main(self) {
      try{
        await doc.useServiceAccountAuth({
          client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
        });
    
        await doc.loadInfo(); // Loads document properties and worksheets
    
        const sheet = doc.sheetsByIndex[1];
        
        await sheet.loadCells('A2');
        const a1 = sheet.getCell(1, 0);
        a1.value+=1;
        await sheet.saveUpdatedCells();
      }catch(e){
        
      }
      
    })(this);

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
      }
      return state;
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) { 
        //navigator.geolocation.getCurrentPosition(function(position) {
        this.setState({isLoading: true});
            (async function main(self) {
                await doc.useServiceAccountAuth({
                    client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
                });
        
                await doc.loadInfo(); // Loads document properties and worksheets
        
                const sheet = doc.sheetsByIndex[0];
                const rows = await sheet.getRows();
                // Total row count
                const row = { 
                  Roaster: self.state.alimento, 
                  URL:"", 
                  City: "", 
                  Coordinates:JSON.stringify([self.props.location[0], self.props.location[1]]), 
                  DateISO: new Date().toISOString(), 
                  Telefone: self.props.telefone, 
                  DiaSemana:self.props.diaSemana };
                
                const result = await sheet.addRow(row);
                console.log(result);
                window.location.reload();
            })(this);
        //});
      event.preventDefault();
    }
  
    render() {
      return (
          this.state.isLoading ?
          <div><CircularProgress /></div>
          :
          <button className="SubmitButton" onClick={this.handleSubmit}>
            Marcar Minha Localização Atual
          </button>
        
      );
    }
  }
export default NameForm; 