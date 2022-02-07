import React, { Component } from 'react';

import { OpenStreetMapProvider } from 'leaflet-geosearch';

const { GoogleSpreadsheet } = require('google-spreadsheet');

const provider = new OpenStreetMapProvider();

// Google Sheets Document ID -- PROD
const doc = new GoogleSpreadsheet(process.env.REACT_APP_GOOGLESHEETID);

class NameForm extends Component {
    constructor(props) {
      super(props);
      this.state = {value: ''};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      alert('Um nome foi enviado: ' + this.state.value);
      (async function main(self) {
        await doc.useServiceAccountAuth({
            client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
        });

        await doc.loadInfo(); // Loads document properties and worksheets

        //incompatibilidade com limitar regiao
        const sheet = doc.sheetsByIndex[0];
        //row = { Name: "new name", Value: "new value" };
        const row = { Roaster: "new name", URL:"", City: self.state.value };
        const result = await sheet.addRow(row);
        console.log(result);
        const rows = await sheet.getRows();
        // Total row count

        rows.forEach((x) => { if (x.Coordinates) { x.mapCoords = JSON.parse(x.Coordinates); } });

        var needsUpdates = rows.filter((x) => { return !x.Coordinates; });

        if (needsUpdates && needsUpdates.length > 0) {
            for (let index in needsUpdates) {
            let city = needsUpdates[index].City;
                console.log(city);
                try {
                    let providerResult = await provider.search({ query: city.replace('-',",") + ', Brazil' });
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
            Nome:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Enviar" />
        </form>
      );
    }
  }
export default NameForm; 