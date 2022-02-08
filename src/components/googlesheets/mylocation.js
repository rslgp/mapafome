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
        numero:'',
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      this.handleChangeNumero = this.handleChangeNumero.bind(this);

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
        if (nextProps.horario !== state.horario){ 
          state.horario=nextProps.horario;
        }
      }
      return state;
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
    
    handleChangeNumero(event) {
      if(event.target.value.length > 6) return;
      let numero = event.target.value.replace(/[^0-9]/g,'');
      this.setState({numero: numero});
    }
  
    handleSubmit(event) { 
        //navigator.geolocation.getCurrentPosition(function(position) {
        if(this.state.location[0]===-8.0671132 && this.state.location[1]===-34.8766719){
          alert("Localização do celular está desativada, ative, recarregue a página e tente novamente com a localização ativa");
          event.preventDefault();
          return;
        }
        this.setState({isLoading: true});
            (async function main(self) {
                await doc.useServiceAccountAuth({
                    client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
                });
        
                await doc.loadInfo(); // Loads document properties and worksheets
                
                let regiao;
                if(
                  //cima baixo
                  self.state.location[0]<2.20 && self.state.location[0] > -14.09
                  &&
                  //esquerda direita
                  self.state.location[1]>-52.42 && self.state.location[1] < -34.32        
                  ){
                    //nordeste
                    regiao=0;
                  }
                  // else
                  // if(
                  //   //cima baixo
                  //   self.state.location[0]<-14.18 && self.state.location[0] > -32.66
                  //   &&
                  //   //esquerda direita
                  //   self.state.location[1]>-55.55 && self.state.location[1] < -38.06        
                  //   ){
                  //     //sudeste
                  //     regiao=4;
                  //   }
                    else{
                      alert("Região não suportada");
                      return;
                    }
                const sheet = doc.sheetsByIndex[regiao];
                // const rows = await sheet.getRows();
                // Total row count

                if(self.state.numero !== ''){
                  self.state.numero = ", nº"+self.state.numero;
                }
                
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

                
            const row = {
              Dados: JSON.stringify(
                { 
                  "Roaster": self.state.alimento, 
                  "URL":self.state.numero, 
                  "City": "", 
                  "Coordinates":JSON.stringify([self.props.location[0], self.props.location[1]]), 
                  "DateISO": new Date().toISOString(), 
                  "Telefone": self.props.telefone, 
                  "DiaSemana":self.props.diaSemana,
                  "Horario":self.props.horario,
                  "AlimentoEntregue":0
                }

              )
            };
                
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
          <div>
            <input className='nLocal' type="text" placeholder='nº' value={this.state.numero} onChange={this.handleChangeNumero} />
            <button className="SubmitButton" onClick={this.handleSubmit}>
              marcar Localização Atual
            </button>
          </div>
        
      );
    }
  }
export default NameForm; 