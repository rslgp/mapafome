import React, { Component } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

const { GoogleSpreadsheet } = require('google-spreadsheet');

// Google Sheets Document ID -- PROD
const doc = new GoogleSpreadsheet(process.env.REACT_APP_GOOGLESHEETID);

class Sugestoes extends Component {
    constructor(props) {
      super(props);
      this.state = {
        value: '',
        isLoading:false
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

  
    handleChange(event) {
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

        const sheet = doc.sheetsByIndex[2];
        //row = { Name: "new name", Value: "new value" };
        
        const row = { Sugestao: self.state.value, DateISO: new Date().toISOString()};
        
        await sheet.addRow(row);
       
        self.setState({isLoading: false});
        alert("sugestão enviada com sucesso");
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
            <textarea className="TextField" type="text" placeholder='Insira sua sugestão' value={this.state.value} onChange={this.handleChange} />
          </label>
          <input className="SubmitButton" type="submit" value="Enviar sugestão" />
        </form>
      );
    }
  }
export default Sugestoes; 