
import React, { Component } from 'react';

import TimeAgo from 'javascript-time-ago';

import pt from 'javascript-time-ago/locale/pt.json';
TimeAgo.addDefaultLocale(pt);

const timeAgo = new TimeAgo();

const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet(process.env.REACT_APP_GOOGLESHEETID);

class CleanOld extends Component {

    componentDidMount() {
        
        (async function main() {
            // Use service account creds
            await doc.useServiceAccountAuth({
            client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
            });
    
            await doc.loadInfo(); // Loads document properties and worksheets
    
            const sheet = doc.sheetsByIndex[0];
            const rows = await sheet.getRows();
            rows.forEach((x) => { 
                let dateMarked;
                if(x.DateISO) dateMarked = timeAgo.format(Date.now() - (Date.now() - new Date(x.DateISO).getTime()) );
                
                //filtrar datas antigas
                if(
                    dateMarked.includes("semana") 
                    || dateMarked.includes("mes") 
                //&& Number(dateMarked.replace(/[^0-9]/g,'')) > 7
                ) { x.delete(); } });

        })();
    }
    render(){
        return <div></div>;
    }
}

export default CleanOld;