import React, { Component } from 'react';

import { OpenStreetMapProvider } from 'leaflet-geosearch';

const { GoogleSpreadsheet } = require('google-spreadsheet');

const provider = new OpenStreetMapProvider();

// Google Sheets Document ID -- PROD
const doc = new GoogleSpreadsheet(process.env.REACT_APP_GOOGLESHEETID);

class NameForm extends Component {
    constructor(props) {
      super(props);
      this.state = {value: '', alimento: props.alimento};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.alimento !== this.state.alimento) {
        this.setState({ alimento: nextProps.alimento });
      }
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      //alert('Um endereço foi enviado: ' + this.state.value);
      (async function main(self) {
        await doc.useServiceAccountAuth({
            client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
        });

        await doc.loadInfo(); // Loads document properties and worksheets

        const sheet = doc.sheetsByIndex[0];
        //row = { Name: "new name", Value: "new value" };
        const rows = await sheet.getRows();
        // Total row count
        const row = { Roaster:  self.state.alimento, URL:"", City: self.state.value, DateISO: new Date().toISOString() };
        const result = await sheet.addRow(row);
        console.log(result);
       

        rows.forEach((x) => { if (x.Coordinates) { x.mapCoords = JSON.parse(x.Coordinates); } });

        var needsUpdates = rows.filter((x) => { return !x.Coordinates; });

        if (needsUpdates && needsUpdates.length > 0) {
            for (let index in needsUpdates) {
            let city = needsUpdates[index].City;
                console.log(city);
                try {
                    let providerResult = await provider.search({ query: city.replace('-',",") + ', Brazil' });
                    console.log(providerResult);
                    let latlon = [providerResult[0].y, providerResult[0].x];
                    needsUpdates[index].Coordinates = JSON.stringify(latlon); // Convert obj to string
                    needsUpdates[index].mapCoords = latlon;
                    await needsUpdates[index].save(); // Save to remote Google Sheet
                    
                    window.location.reload();
                }
                catch (e) {
                    console.log(e);
                }
            }
        }
    })(this);
      event.preventDefault();
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            <input className="TextField" type="text" placeholder='Insira rua,bairro,cidade,estado' value={this.state.value} onChange={this.handleChange} />
          </label>
          <input className="SubmitButton" type="submit" value="Enviar Endereço" />
        </form>
      );
    }
  }
export default NameForm; 