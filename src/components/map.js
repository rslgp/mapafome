import React, { Component, useEffect } from 'react';
import { MapContainer, Marker, TileLayer, Tooltip, AttributionControl, Popup, LayersControl } from "react-leaflet";
import L, {LatLng} from 'leaflet';
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import "react-leaflet-markercluster/dist/styles.min.css";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { useMap } from 'react-leaflet';
import coffeeBean from '../images/bean.svg';
import hub from '../images/hub.svg';
import green from '../images/green.svg';
import red from '../images/red.svg';
import CurrentLocationSVG from '../images/currentLocation.svg';
import CurrentLocationSmallSVG from '../images/currentLocationSmall.svg';
import TimeAgo from 'javascript-time-ago';
import Rating from '@mui/material/Rating';

import envVariables from './variaveisAmbiente';

import pt from 'javascript-time-ago/locale/pt.json';
TimeAgo.addDefaultLocale(pt);

const timeAgo = new TimeAgo();

global.lastMarked = undefined;
global.lastMarkedCoords = undefined;

const SearchField = ({ apiKey }) => {
    
    const provider = new OpenStreetMapProvider(
    {
        params: {
            'accept-language': 'br', // render results in br
            countrycodes: 'br', // limit search results to the br
            addressdetails: 1, // include additional address detail parts
            country:'br',
          },
        providerOptions:{
            searchBounds: [
            new LatLng(0.275901, -59.178876),
            new LatLng(-35.558031, -28.944502)
            ],
            region: "br"
        }
    });
  
    // @ts-ignore
    const searchControl = new GeoSearchControl({
      provider: provider,
      marker: {
        // optional: L.Marker    - default L.Icon.Default
        icon: CurrentLocation,
        draggable: false,
      },
      autoClose:true,
    }
      
    );
  
    const map = useMap();
    useEffect(() => {
      map.addControl(searchControl);
      return () => map.removeControl(searchControl);
    }, []);
  
    return null;
  };

// Leaflet custom marker
const myIcon = new L.Icon({
    // Coffee bean attribution -- Thanks! https://commons.wikimedia.org/wiki/File:Coffee_bean_symbol.svg
    iconUrl: coffeeBean,
    iconSize: new L.Point(20, 20),
    className: 'leaflet-bean-icon',
});


// Leaflet custom marker
const hubIcon = new L.Icon({
    iconUrl: hub,
    iconSize: new L.Point(30, 30),
    className: 'leaflet-bean-icon',
});

// Leaflet custom marker
const greenIcon = new L.Icon({
    iconUrl: green,
    iconSize: new L.Point(35, 35),
    className: 'leaflet-bean-icon',
});
const redIcon = new L.Icon({
    iconUrl: red,
    iconSize: new L.Point(35, 35),
    className: 'leaflet-bean-icon',
});

const CurrentLocation = new L.Icon({
    iconUrl: CurrentLocationSVG,
    iconSize: new L.Point(150, 150),
    className: 'leaflet-bean-icon',
    interactive: false
});
const CurrentLocationSmall = new L.Icon({
    iconUrl: CurrentLocationSmallSVG,
    iconSize: new L.Point(20, 20),
    className: 'leaflet-bean-icon',
    interactive: false
});

const TestIcon = new L.Icon({
    iconUrl: 'https://maps.gstatic.com/tactile/reveal/close_1x_16dp.png',
    iconSize: new L.Point(10, 10),
    className: 'leaflet-bean-icon',
    interactive: false
});


const markerclusterOptionsPrecisando = function (cluster) {
        var childCount = cluster.getChildCount();
        var c = ' marker-cluster-';
        if (childCount < 10) {
          c += 'small';
        } 
        else if (childCount < 100) {
          c += 'medium';
        } 
        else {
          c += 'large';
        }
       
        return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', 
         className: 'marker-cluster' + c + '-precisandoCluster', iconSize: new L.Point(40, 40) });
        };

  const markerclusterOptionsAnjos = (cluster) => {
    var childCount = cluster.getChildCount();
    var c = ' marker-cluster-';
    if (childCount < 10) {
      c += 'small';
    } 
    else if (childCount < 100) {
      c += 'medium';
    } 
    else {
      c += 'large';
    }
   
    return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', 
     className: 'marker-cluster' + c +'-anjosCluster', iconSize: new L.Point(40, 40) });
    };

    const markerclusterOptionsEntrega = (cluster) => {       
        return new L.DivIcon({ html: '<div><span>' + cluster.getChildCount() + '</span></div>', 
         className: 'redHub marker-cluster', iconSize: new L.Point(40, 40) });
    };


class CoffeeMap extends Component {

    // Initial state
    constructor(props) {
        super(props);
        
        this.state = {
            dataMaps: [],
            center: props.location,
            filtro: props.filtro,
        }
    }

     //ATUALIZAR PROPS VINDAS DO PAI
     static getDerivedStateFromProps(nextProps, state) {
        if(state){
          if (nextProps.filtro !== state.filtro){ 
            state.filtro=nextProps.filtro;
          }
        }
        return state;
      }

    render() {

        // Render map default zoom based on mobile breakpoint
        const isMobile = window.innerWidth < 480;
        const screensizeZoom = isMobile ? 7.25 : 8.5*1.2;

        return (
            <div>
                <MapContainer
                    style={{ height: "89vh", width: "100%" }}
                    zoom={screensizeZoom}
                    maxZoom={18}
                    center={this.state.center}
                    attributionControl={false}
                    whenReady={(map) => {
                        //console.log(map);
                        map.target.on("click", function (e) {
                          //if(e.originalEvent.detail>=2)alert(e.originalEvent.detail);
                          const { lat, lng } = e.latlng;
                          //envVariables.lastMarked.latlng = [lat,lng];
                        //   console.log(this);
                        //   this.props.onClickMap([lat,lng]);
                          if(envVariables.lastMarked) envVariables.lastMarked.remove();
                          envVariables.lastMarked = L.marker([lat, lng], {icon:CurrentLocationSmall, draggable: false}).addTo(map.target);
                        });
                      }}
                    >

{/* https://leaflet-extras.github.io/leaflet-providers/preview/ */}
{/* https://github.com/dhis2-club-tanzania/function-maintenance/blob/0dadaa96955156b6ddefc0fcf9dd54e45ffb9458/src/app/shared/modules/ngx-dhis2-visualization/modules/map/constants/tile-layer.constant.ts */}
{/* https://www.arcgis.com/apps/mapviewer/index.html */}
                    {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution=" &copy; <a href='http://openstreetmap.org' target='_blank' rel='noreferrer'>OpenStreetMap</a>"
                    /> */}
                     {/* <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution=" &copy; <a href='http://openstreetmap.org' target='_blank' rel='noreferrer'>OpenStreetMap</a>"
                    /> */}
                    {/* <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                        attribution=" &copy; <a href='http://openstreetmap.org' target='_blank' rel='noreferrer'>OpenStreetMap</a>"
                    /> */}

                    
                     {/* {this.state.tileMapOption ? 
                     <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                     attribution=" &copy; <a href='http://openstreetmap.org' target='_blank' rel='noreferrer'>OpenStreetMap</a>"
                 />
                    :
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution=" &copy; <a href='http://openstreetmap.org' target='_blank' rel='noreferrer'>OpenStreetMap</a>"
                    />
                } */}

                     {/* <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                        attribution=" &copy; <a href='http://openstreetmap.org' target='_blank' rel='noreferrer'>OpenStreetMap</a>"
                    /> */}
                    {/* <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                        attribution=" &copy; <a href='http://openstreetmap.org' target='_blank' rel='noreferrer'>OpenStreetMap</a>"
                    />  */}
                    {/* <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                        attribution=" &copy; <a href='http://openstreetmap.org' target='_blank' rel='noreferrer'>OpenStreetMap</a>"
                    />  */}
                    <LayersControl style={{opacity:'0.5'}} position="bottomleft">
                    
                    {/* <LayersControl.BaseLayer checked name="Esri">
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                        attribution='Tiles &copy; Esri'
                    />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer checked name="Stamen-lite">
                    <TileLayer url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png"
                        attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer checked name="Stamen-terrain">
                    <TileLayer url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png"
                        attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer checked name="4">
                    <TileLayer url="https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
                        attribution=" &copy; <a href='https://www.waze.com/pt-BR/live-map' target='_blank' rel='noreferrer'>Waze</a>"
                    />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer checked name="3">
                    <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                        attribution=" &copy; <a href='https://www.waze.com/pt-BR/live-map' target='_blank' rel='noreferrer'>Waze</a>"
                    />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer checked name="2">
                    <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                        attribution=" &copy; <a href='https://www.waze.com/pt-BR/live-map' target='_blank' rel='noreferrer'>Waze</a>"
                    />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer checked name="1">
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                        attribution=" &copy; <a href='https://www.waze.com/pt-BR/live-map' target='_blank' rel='noreferrer'>Waze</a>"
                    />
                    </LayersControl.BaseLayer> */}
                    <LayersControl.BaseLayer checked name="Waze">
                    <TileLayer url="https://worldtiles1.waze.com/tiles/{z}/{x}/{y}.png"
                        attribution=" &copy; <a href='https://www.waze.com/pt-BR/live-map' target='_blank' rel='noreferrer'>Waze</a>"
                    />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer  name="Mapa">
                    <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                     attribution=" &copy; <a href='http://openstreetmap.org' target='_blank' rel='noreferrer'>OSM</a>"
                    />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Satelite">
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution=" &copy; <a href='https://www.arcgis.com/apps/mapviewer/index.html' target='_blank' rel='noreferrer'>Esri</a>"
                    />
                    </LayersControl.BaseLayer>

                    
                    </LayersControl>

                    <SearchField 
                        closeResultsOnClick={true}
                        providerOptions={{
                            searchBounds: [
                            new LatLng(0.275901, -59.178876),
                            new LatLng(-35.558031, -28.944502)
                            ],
                            region: "br"
                        }}
                    />

                    <AttributionControl
                        position="bottomleft"
                        prefix={false}
                    />
                    
                    <Marker
                            icon= {CurrentLocation} 
                            key={"currentPosition"}
                            center={this.state.center}
                            position={this.state.center}

                            eventHandlers={{
                                click: (e) => { 
                                    e.preventDefault();
                                }
                            }}

                            interactive={false}
                        >
                            
                    {/* <Popup
                        direction="auto"
                        offset={[2, 0]}
                        opacity={1}>
                        <span>você está aqui</span>
                    </Popup> */}
                        </Marker>

                        {/* {(() => {
                            switch(this.state.filtro) {
                                case "Todos":
                                    return ([
                                        this.renderDoadoresAzul(),
                                        this.renderDoadoresVerde(),
                                        this.renderNecessitados(),
                                        this.renderDoadoresVermelho()]
                                    )
                                    break;
                                case "Necessitados":
                                    return ([
                                        this.renderNecessitados()]
                                    )
                                    break;
                                case "Doadores":
                                    return ([
                                        this.renderDoadoresAzul(),
                                        this.renderDoadoresVerde(),
                                        this.renderDoadoresVermelho()]
                                    )
                                    break;
                                case "Refeição Pronta":
                                    return ([
                                        this.renderDoadoresVerde(),
                                        this.renderDoadoresVermelho()]
                                    )
                                    break;
                            }
                        })()} */}
                        {this.renderSwitch(this.state.filtro)}
                        {this.renderTestes()}

                    
                </MapContainer>
            </div>
        );
    }

    
    setupVariables(mapCoords,DateISO,Telefone,Avaliacao){
        let googleDirection = `https://www.google.com/maps/search/${[mapCoords[0]+','+mapCoords[1]]}`;
                            
        let dateMarked = timeAgo.format(Date.now() - (Date.now() - new Date(DateISO).getTime()) );
         //if(DateISO) dateMarked
        if(Telefone){
            let urlTelefone = `whatsapp://send?phone=55${Telefone}`;
            let legivelTelefone = Telefone.replace(/(\d{2})(\d{5})(\d{4})/g, "($1) $2-$3");
            let contato="contato:";
            switch(Telefone.length){
                case 0:
                    Telefone="";
                    break;
                case 8:
                    Telefone="contato:"+Telefone.replace(/(\d{4})(\d{4})/g, "$1-$2");
                    break;
                case 9:
                    Telefone="contato:"+Telefone.replace(/(\d{5})(\d{4})/g, "$1-$2");
                    break;
                default:
                    Telefone=<span>{contato}<a href={urlTelefone} target='_blank' rel='noreferrer'>{legivelTelefone}</a></span>;
                    break;
            }
        }

        let AvaliacaoData = {nota:0, totalClicks:0};
        if(Avaliacao){
            AvaliacaoData.totalClicks = (Avaliacao["5"]+Avaliacao["4"]+Avaliacao["3"]+Avaliacao["2"]+Avaliacao["1"]);
            if( AvaliacaoData.totalClicks === 0 ){
                Avaliacao="Nenhuma";
            }else{
                Avaliacao = (Avaliacao["5"]*5 +
                Avaliacao["4"]*4 +
                Avaliacao["3"]*3 +
                Avaliacao["2"]*2 +
                Avaliacao["1"]*1)
                /            
                (AvaliacaoData.totalClicks);

                Avaliacao = Math.round(Avaliacao * 100)/100;

            }
        }

        AvaliacaoData.nota = Avaliacao;

    
        return {googleDirection, dateMarked, Telefone, AvaliacaoData};
    }

    configPopup(dadosPopup){	
        let {googleDirection, precisandoMsg, dateMarked, contato, 	
            AlimentoEntregue, mapCoords, Roaster, Avaliacao, RedeSocial} = dadosPopup;	
        
        if(Avaliacao===undefined) Avaliacao = {nota:"Nenhuma",totalClicks:0};
        return <Popup>
            <a href={googleDirection} target='_blank' rel="noreferrer">Ir para o destino 
            <img className="directionIcon" src="https://maps.gstatic.com/tactile/omnibox/directions-2x-20150909.png"></img></a>
            <br/>
            <div style={{width:'80%'}}> {precisandoMsg} </div>
            <br/>
            {dateMarked} {contato} 
            {RedeSocial ? 
                <span><br></br><a href={"https://"+RedeSocial} target='_blank' rel='noreferrer'> RedeSocial</a></span>
            : <span></span>
            }
            <br/> 
            (<svg width="12" height="12" viewBox="0 0 24 24" focusable="false"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"></path></svg>
            {Avaliacao.nota})
            <Rating
                name="simple-controlled"
                value={Avaliacao.nota}
                onChange={(event, newValue) => {
                    this.props.avaliar([mapCoords[0], mapCoords[1]], newValue);
                }}
            />
            ({Avaliacao.totalClicks})
            
            <br/>{"(Qtde entregue:"+AlimentoEntregue+")"}
            { (Roaster === "Doador" || Roaster === "EntregaAlimentoPronto") ? (dadosPopup.verificado===1 ? <img src="https://static.xx.fbcdn.net/assets/?revision=1174640696642832&amp;name=ig-verifiedbadge-shared&amp;density=1"></img> : <button onClick={()=>this.props.verificarPonto([mapCoords[0], mapCoords[1]], Roaster)}>cnpj</button>) : <span></span>}
            <br/>
            <button onClick={() => this.props.removerPonto([mapCoords[0], mapCoords[1]], Roaster)}>apagar</button>
            <span>    </span>
            <button className='buttonsSidebySide floatRight' onClick={() => this.props.entregarAlimento([mapCoords[0], mapCoords[1]])}>entreguei</button>
                                    
        </Popup>
    }

    renderRedeSocial(){
        return <MarkerClusterGroup
                    // grupo de onde pode ajudar
                        spiderfyDistanceMultiplier={1}
                        showCoverageOnHover={false}
                        maxClusterRadius={35}
                        iconCreateFunction={markerclusterOptionsAnjos}
                    >                  
                    {/* .filter(x => { return x.Coordinates; })       */}
                        {this.props.dataMapsProp.filter(x => {
                            return x.RedeSocial 
                        }).map((dataItem, k) => {
                            let { City, mapCoords, Roaster, URL, DateISO, Telefone, DiaSemana, Mes, Horario, AlimentoEntregue, Avaliacao, RedeSocial} = dataItem;
                            
                            if(mapCoords === undefined) return; if(URL===undefined) URL = ""; 
                            if(RedeSocial===undefined) return (<div></div>);
                            
                            let {googleDirection, dateMarked, Telefone: contato, AvaliacaoData: nota} = this.setupVariables(mapCoords,DateISO,Telefone, Avaliacao);
                            
                            //if(envVariables.distanceInKmBetweenEarthCoordinates(envVariables.currentLocation[0], envVariables.currentLocation[1], mapCoords[0], mapCoords[1]) > 30) return(<div></div>)
                            
                            if(envVariables.telefoneFilter && (contato===undefined || contato==="")) return (<div></div>);
                            //filtrar datas antigas
                            // if(
                            //     dateMarked.includes("semana") 
                            // //&& Number(dateMarked.replace(/[^0-9]/g,'')) > 7
                            // ) return (<div></div>);
                            
                            let precisandoMsg, CurrentIcon;
                            switch(Roaster){
                                case "Doador":
                                    precisandoMsg = "Recebendo alimento para distribuir"+URL;
                                    CurrentIcon = hubIcon;
                                    break;                               
                                
                                case "EntregaAlimentoPronto":
                                    precisandoMsg = `Entregando refeições prontas `+DiaSemana+" pela "+Horario+" "+Mes;
                                    CurrentIcon = redIcon;
                                    break;
                                default:
                                    return (<div></div>);
                                    break;
                            }
                            
                            let dadosPopup = {...dataItem};
                            dadosPopup.precisandoMsg = precisandoMsg;
                            dadosPopup.googleDirection = googleDirection;
                            dadosPopup.dateMarked = dateMarked;
                            dadosPopup.contato = contato;
                            dadosPopup.Avaliacao = nota;

                            return (
                                <Marker
                                    eventHandlers={{
                                        click: (e) => { 
                                            // alert(`Precisando de ${Roaster}`);
                                            this.props.contabilizarClicado([mapCoords[0], mapCoords[1]]);
                                            console.log(`indo para [${[mapCoords[0]+','+mapCoords[1]]}]`); 
                                            // window.open(`https://www.google.com/maps/search/${[mapCoords[0]+','+mapCoords[1]]}`) 
                                        }
                                    }}
                                    icon= {CurrentIcon} 
                                    key={k}
                                    center={[mapCoords[0], mapCoords[1]]}
                                    position={[mapCoords[0], mapCoords[1]]}
                                >
                                   {this.configPopup(dadosPopup)}
                                    
                                    {/* <Popup>
                                        <a href={googleDirection} target='_blank' rel="noreferrer">Ir para o destino 
                                        <img className="directionIcon" src="https://maps.gstatic.com/tactile/omnibox/directions-2x-20150909.png"></img></a>
                                        <br/>
                                        {precisandoMsg}
                                        <br/>
                                        {dateMarked} {contato} 
                                        <br/>{"(Qtde entregue:"+AlimentoEntregue+")"}
                                        <br/>
                                        <button onClick={() => this.props.removerPonto([mapCoords[0], mapCoords[1]], Roaster)}>apagar</button>
                                        <span>    </span>
                                        <button className='buttonsSidebySide floatRight' onClick={() => this.props.entregarAlimento([mapCoords[0], mapCoords[1]])}>entreguei</button>
                                
                                    </Popup> */}
                                    {/* <Tooltip
                                        // direction="auto"
                                        // offset={[15, 0]}
                                        // opacity={1}>
                                        // <span><a href={URL}>Precisando de<br></br>{Roaster}</a></span>
                                        // <span>{City}, BR</span>
                                    </Tooltip> */}
                                </Marker>);
                        })}
                    </MarkerClusterGroup>
    }

    renderVerificados(){
        return <MarkerClusterGroup
                    // grupo de onde pode ajudar
                        spiderfyDistanceMultiplier={1}
                        showCoverageOnHover={false}
                        maxClusterRadius={35}
                        iconCreateFunction={markerclusterOptionsAnjos}
                    >                  
                    {/* .filter(x => { return x.Coordinates; })       */}
                        {this.props.dataMapsProp.filter(x => {return x.RedeSocial }).map((dataItem, k) => {
                            let { City, mapCoords, Roaster, URL, DateISO, Telefone, DiaSemana, Mes, Horario, AlimentoEntregue, Avaliacao, RedeSocial} = dataItem;
                            
                            if(mapCoords === undefined) return; if(URL===undefined) URL = ""; if(RedeSocial===undefined) RedeSocial="";
                            
                            let {googleDirection, dateMarked, Telefone: contato, AvaliacaoData: nota} = this.setupVariables(mapCoords,DateISO,Telefone, Avaliacao);
                            
                            //if(envVariables.distanceInKmBetweenEarthCoordinates(envVariables.currentLocation[0], envVariables.currentLocation[1], mapCoords[0], mapCoords[1]) > 30) return(<div></div>)
                            if(dataItem.verificado !== 1) return (<div></div>);
                            if(envVariables.telefoneFilter && (contato===undefined || contato==="")) return (<div></div>);
                            //filtrar datas antigas
                            // if(
                            //     dateMarked.includes("semana") 
                            // //&& Number(dateMarked.replace(/[^0-9]/g,'')) > 7
                            // ) return (<div></div>);
                            
                            let precisandoMsg, CurrentIcon;
                            switch(Roaster){
                                case "Doador":
                                    precisandoMsg = "Recebendo alimento para distribuir"+URL;
                                    CurrentIcon = hubIcon;
                                    break;                               
                                
                                case "EntregaAlimentoPronto":
                                    precisandoMsg = `Entregando refeições prontas `+DiaSemana+" pela "+Horario+" "+Mes;
                                    CurrentIcon = redIcon;
                                    break;
                                default:
                                    return (<div></div>);
                                    break;
                            }
                            
                            let dadosPopup = {...dataItem};
                            dadosPopup.precisandoMsg = precisandoMsg;
                            dadosPopup.googleDirection = googleDirection;
                            dadosPopup.dateMarked = dateMarked;
                            dadosPopup.contato = contato;
                            dadosPopup.Avaliacao = nota;

                            return (
                                <Marker
                                    eventHandlers={{
                                        click: (e) => { 
                                            // alert(`Precisando de ${Roaster}`); 
                                            this.props.contabilizarClicado([mapCoords[0], mapCoords[1]]);
                                            console.log(`indo para [${[mapCoords[0]+','+mapCoords[1]]}]`); 
                                            // window.open(`https://www.google.com/maps/search/${[mapCoords[0]+','+mapCoords[1]]}`) 
                                        }
                                    }}
                                    icon= {CurrentIcon} 
                                    key={k}
                                    center={[mapCoords[0], mapCoords[1]]}
                                    position={[mapCoords[0], mapCoords[1]]}
                                >
                                   {this.configPopup(dadosPopup)}
                                    
                                    {/* <Popup>
                                        <a href={googleDirection} target='_blank' rel="noreferrer">Ir para o destino 
                                        <img className="directionIcon" src="https://maps.gstatic.com/tactile/omnibox/directions-2x-20150909.png"></img></a>
                                        <br/>
                                        {precisandoMsg}
                                        <br/>
                                        {dateMarked} {contato} 
                                        <br/>{"(Qtde entregue:"+AlimentoEntregue+")"}
                                        <br/>
                                        <button onClick={() => this.props.removerPonto([mapCoords[0], mapCoords[1]], Roaster)}>apagar</button>
                                        <span>    </span>
                                        <button className='buttonsSidebySide floatRight' onClick={() => this.props.entregarAlimento([mapCoords[0], mapCoords[1]])}>entreguei</button>
                                
                                    </Popup> */}
                                    {/* <Tooltip
                                        // direction="auto"
                                        // offset={[15, 0]}
                                        // opacity={1}>
                                        // <span><a href={URL}>Precisando de<br></br>{Roaster}</a></span>
                                        // <span>{City}, BR</span>
                                    </Tooltip> */}
                                </Marker>);
                        })}
                    </MarkerClusterGroup>
    }

    renderDoadoresAzul(){
        return <MarkerClusterGroup
                    // grupo de onde pode ajudar
                        spiderfyDistanceMultiplier={1}
                        showCoverageOnHover={false}
                        maxClusterRadius={35}
                        iconCreateFunction={markerclusterOptionsAnjos}
                        
                        removeOutsideVisibleBounds={false}
                    >                  
                    {/* .filter(x => { return x.Coordinates; })       */}
                        {this.props.dataMapsProp.filter(x => {return x.Roaster==="Doador" }).map((dataItem, k) => {
                            let { City, mapCoords, Roaster, URL, DateISO, Telefone, DiaSemana, Horario, AlimentoEntregue, Avaliacao, RedeSocial} = dataItem;
                            
                            if(mapCoords === undefined) return; if(URL===undefined) URL = ""; if(RedeSocial===undefined) RedeSocial="";
                            
                            let {googleDirection, dateMarked, Telefone: contato, AvaliacaoData: nota} = this.setupVariables(mapCoords,DateISO,Telefone, Avaliacao);
                            
                            //if(envVariables.distanceInKmBetweenEarthCoordinates(envVariables.currentLocation[0], envVariables.currentLocation[1], mapCoords[0], mapCoords[1]) > 30) return(<div></div>)
                            
                            if(envVariables.telefoneFilter && (contato===undefined || contato==="")) return (<div></div>);
                            //filtrar datas antigas
                            // if(
                            //     dateMarked.includes("semana") 
                            // //&& Number(dateMarked.replace(/[^0-9]/g,'')) > 7
                            // ) return (<div></div>);
                            
                            let precisandoMsg, CurrentIcon;
                            // switch(Roaster){
                            //     case "Doador":
                                    precisandoMsg = "Recebendo alimento para distribuir"+URL;
                                    CurrentIcon = hubIcon;
                            //         break;                               
                                
                            //     default:
                            //         return (<div></div>);
                            //         break;
                            // }

                            let dadosPopup = {...dataItem};
                            dadosPopup.precisandoMsg = precisandoMsg;
                            dadosPopup.googleDirection = googleDirection;
                            dadosPopup.dateMarked = dateMarked;
                            dadosPopup.contato = contato;
                            dadosPopup.Avaliacao = nota;

                            return (
                                <Marker
                                    eventHandlers={{
                                        click: (e) => { 
                                            // alert(`Precisando de ${Roaster}`); 
                                            this.props.contabilizarClicado([mapCoords[0], mapCoords[1]]);
                                            console.log(`indo para [${[mapCoords[0]+','+mapCoords[1]]}]`); 
                                            // window.open(`https://www.google.com/maps/search/${[mapCoords[0]+','+mapCoords[1]]}`) 
                                        }
                                    }}
                                    icon= {CurrentIcon} 
                                    key={k}
                                    center={[mapCoords[0], mapCoords[1]]}
                                    position={[mapCoords[0], mapCoords[1]]}
                                >
                                   {this.configPopup(dadosPopup)}
                                    
                                    {/* <Popup>
                                        <a href={googleDirection} target='_blank' rel="noreferrer">Ir para o destino 
                                        <img className="directionIcon" src="https://maps.gstatic.com/tactile/omnibox/directions-2x-20150909.png"></img></a>
                                        <br/>
                                        {precisandoMsg}
                                        <br/>
                                        {dateMarked} {contato} 
                                        <br/>{"(Qtde entregue:"+AlimentoEntregue+")"}
                                        <br/>
                                        <button onClick={() => this.props.removerPonto([mapCoords[0], mapCoords[1]], Roaster)}>apagar</button>
                                        <span>    </span>
                                        <button className='buttonsSidebySide floatRight' onClick={() => this.props.entregarAlimento([mapCoords[0], mapCoords[1]])}>entreguei</button>
                                
                                    </Popup> */}
                                    {/* <Tooltip
                                        // direction="auto"
                                        // offset={[15, 0]}
                                        // opacity={1}>
                                        // <span><a href={URL}>Precisando de<br></br>{Roaster}</a></span>
                                        // <span>{City}, BR</span>
                                    </Tooltip> */}
                                </Marker>);
                        })}
                    </MarkerClusterGroup>
    }

    renderDoadoresVerde(){
        return <MarkerClusterGroup
                    // grupo de onde pode ajudar
                        spiderfyDistanceMultiplier={1}
                        showCoverageOnHover={false}
                        maxClusterRadius={35}
                        iconCreateFunction={markerclusterOptionsAnjos}
                    >                        
                        {this.props.dataMapsProp.filter(x => {return x.Roaster==="PrecisandoBuscar" }).map((dataItem, k) => {
                            let { City, mapCoords, Roaster, URL, DateISO, Telefone, DiaSemana, Horario, Mes, AlimentoEntregue, Avaliacao} = dataItem;
                            
                            if(mapCoords === undefined) return; if(URL===undefined) URL = ""; if(Mes===undefined) Mes="";

                            let {googleDirection, dateMarked, Telefone: contato, AvaliacaoData: nota} = this.setupVariables(mapCoords,DateISO,Telefone,Avaliacao);
                            
                            //if(envVariables.distanceInKmBetweenEarthCoordinates(envVariables.currentLocation[0], envVariables.currentLocation[1], mapCoords[0], mapCoords[1]) > 30) return(<div></div>)
                            
                            if(envVariables.telefoneFilter && (contato===undefined || contato==="")) return (<div></div>);
                            //filtrar datas antigas
                            // if(
                            //     dateMarked.includes("semana") 
                            // //&& Number(dateMarked.replace(/[^0-9]/g,'')) > 7
                            // ) return (<div></div>);
                            
                            let precisandoMsg, CurrentIcon;
                            // switch(Roaster){
                            //     case "PrecisandoBuscar":
                                    precisandoMsg = `Precisando de pessoas para buscar `+DiaSemana + " pela "+Horario+" "+Mes;
                                    CurrentIcon = greenIcon;
                            //         break;                                
                                
                            //     default:
                            //         return (<div></div>);
                            //         break;
                            // }
                            
                            let dadosPopup = {...dataItem};
                            dadosPopup.precisandoMsg = precisandoMsg;
                            dadosPopup.googleDirection = googleDirection;
                            dadosPopup.dateMarked = dateMarked;
                            dadosPopup.contato = contato;
                            dadosPopup.Avaliacao = nota;

                            return (
                                <Marker
                                    eventHandlers={{
                                        click: (e) => { 
                                            // alert(`Precisando de ${Roaster}`); 
                                            this.props.contabilizarClicado([mapCoords[0], mapCoords[1]]);
                                            console.log(`indo para [${[mapCoords[0]+','+mapCoords[1]]}]`); 
                                            // window.open(`https://www.google.com/maps/search/${[mapCoords[0]+','+mapCoords[1]]}`) 
                                        }
                                    }}
                                    icon= {CurrentIcon} 
                                    key={k}
                                    center={[mapCoords[0], mapCoords[1]]}
                                    position={[mapCoords[0], mapCoords[1]]}
                                >
                                   {this.configPopup(dadosPopup)}
                                    
                                    {/* <Popup>
                                        <a href={googleDirection} target='_blank' rel="noreferrer">Ir para o destino 
                                        <img className="directionIcon" src="https://maps.gstatic.com/tactile/omnibox/directions-2x-20150909.png"></img></a>
                                        <br/>
                                        {precisandoMsg}
                                        <br/>
                                        {dateMarked} {contato} 
                                        <br/>{"(Qtde entregue:"+AlimentoEntregue+")"}
                                        <br/>
                                        <button onClick={() => this.props.removerPonto([mapCoords[0], mapCoords[1]], Roaster)}>apagar</button>
                                        <span>    </span>
                                        <button className='buttonsSidebySide floatRight' onClick={() => this.props.entregarAlimento([mapCoords[0], mapCoords[1]])}>entreguei</button>
                                
                                    </Popup> */}
                                    {/* <Tooltip
                                        // direction="auto"
                                        // offset={[15, 0]}
                                        // opacity={1}>
                                        // <span><a href={URL}>Precisando de<br></br>{Roaster}</a></span>
                                        // <span>{City}, BR</span>
                                    </Tooltip> */}
                                </Marker>);
                        })}
                    </MarkerClusterGroup>
    }

    renderDoadoresVermelho(){
        return <MarkerClusterGroup
        // grupo de entrega de alimentos prontos
            spiderfyDistanceMultiplier={1}
            showCoverageOnHover={false}
            maxClusterRadius={35}
            iconCreateFunction={markerclusterOptionsEntrega}
            
            removeOutsideVisibleBounds={false}
        >                        
            {this.props.dataMapsProp.filter(x => {return x.Roaster==="EntregaAlimentoPronto" }).map((dataItem, k) => {
                let { City, mapCoords, Roaster, URL, DateISO, Telefone, DiaSemana, Horario, Mes, AlimentoEntregue, Avaliacao, RedeSocial } = dataItem;
                
                if(mapCoords === undefined) return; if(URL===undefined) URL = ""; if(Mes===undefined) Mes="";

                let {googleDirection, dateMarked, Telefone: contato, redesocial, AvaliacaoData: nota} = this.setupVariables(mapCoords,DateISO,Telefone, Avaliacao);
                
                //if(envVariables.distanceInKmBetweenEarthCoordinates(envVariables.currentLocation[0], envVariables.currentLocation[1], mapCoords[0], mapCoords[1]) > 30) return(<div></div>)
                if(envVariables.telefoneFilter) console.log(contato);       
                if(envVariables.telefoneFilter && (contato===undefined || contato==="")) return (<div></div>);
                //filtrar datas antigas
                // if(
                //     dateMarked.includes("semana") 
                // //&& Number(dateMarked.replace(/[^0-9]/g,'')) > 7
                // ) return (<div></div>);
                
                let precisandoMsg, CurrentIcon;
                // switch(Roaster){
                //     case "EntregaAlimentoPronto":
                        precisandoMsg = `Entregando refeições prontas `+DiaSemana+" pela "+Horario+" "+Mes;
                        CurrentIcon = redIcon;
                //         break;
                    
                //     default:
                //         return (<div></div>);
                //         break;
                // }

                let dadosPopup = {...dataItem};
                dadosPopup.precisandoMsg = precisandoMsg;
                dadosPopup.googleDirection = googleDirection;
                dadosPopup.dateMarked = dateMarked;
                dadosPopup.contato = contato;
                dadosPopup.Avaliacao = nota;
                
                return (
                    <Marker
                        eventHandlers={{
                            click: (e) => { 
                                // alert(`Precisando de ${Roaster}`);
                                this.props.contabilizarClicado([mapCoords[0], mapCoords[1]]); 
                                console.log(`indo para [${[mapCoords[0]+','+mapCoords[1]]}]`); 
                                // window.open(`https://www.google.com/maps/search/${[mapCoords[0]+','+mapCoords[1]]}`) 
                            }
                        }}
                        icon= {CurrentIcon} 
                        key={k}
                        center={[mapCoords[0], mapCoords[1]]}
                        position={[mapCoords[0], mapCoords[1]]}
                    >
                        {this.configPopup(dadosPopup)}
                                    
                        {/* <Popup>
                            <a href={googleDirection} target='_blank' rel="noreferrer">Ir para o destino</a>
                            <br/>
                            {precisandoMsg}
                            <br/>
                            {dateMarked} {contato} 
                            <br/>{" (Qtde entregue:"+AlimentoEntregue+")"}
                            <br/>
                            <button onClick={() => this.props.removerPonto([mapCoords[0], mapCoords[1]], Roaster)}>apagar</button>
                            <span>    </span>
                            <button className='buttonsSidebySide floatRight' onClick={() => this.props.entregarAlimento([mapCoords[0], mapCoords[1]])}>entreguei</button>
                        </Popup> */}
                        {/* <Tooltip
                            // direction="auto"
                            // offset={[15, 0]}
                            // opacity={1}>
                            // <span><a href={URL}>Precisando de<br></br>{Roaster}</a></span>
                            // <span>{City}, BR</span>
                        </Tooltip> */}
                    </Marker>);
            })}
        </MarkerClusterGroup>
    }

    renderNecessitados(){
        return <MarkerClusterGroup
        // grupo dos que precisam
            spiderfyDistanceMultiplier={1}
            showCoverageOnHover={false}
            maxClusterRadius={35}
            iconCreateFunction={markerclusterOptionsPrecisando}
        >                        
            {this.props.dataMapsProp.filter(x => {return x.Roaster==="Alimento pronto" }).map((dataItem, k) => {
                let { City, mapCoords, Roaster, URL, DateISO, Telefone, DiaSemana, AlimentoEntregue, Avaliacao} = dataItem;
                
                if(mapCoords === undefined) return; if(URL===undefined) URL = "";
                
                let {googleDirection, dateMarked, Telefone: contato, AvaliacaoData: nota} = this.setupVariables(mapCoords,DateISO,Telefone);
        
                //if(envVariables.distanceInKmBetweenEarthCoordinates(envVariables.currentLocation[0], envVariables.currentLocation[1], mapCoords[0], mapCoords[1]) > 30) return(<div></div>)
                            
                if(envVariables.telefoneFilter && (contato===undefined || contato==="")) return (<div></div>);
                //filtrar datas antigas
                // if(
                //     dateMarked.includes("semana") 
                // //&& Number(dateMarked.replace(/[^0-9]/g,'')) > 7
                // ) return (<div></div>);
                
                let precisandoMsg, CurrentIcon;
                // switch(Roaster){                    
                //     case "Alimento pronto":
                        precisandoMsg = `Precisando de ${Roaster}`+URL;
                        CurrentIcon = myIcon;
                //         break;
                    
                //     default:
                //         return (<div></div>);
                //         break;
                // }

                let dadosPopup = {...dataItem};
                dadosPopup.precisandoMsg = precisandoMsg;
                dadosPopup.googleDirection = googleDirection;
                dadosPopup.dateMarked = dateMarked;
                dadosPopup.contato = contato;
                dadosPopup.Avaliacao = nota;
                
                return (
                    <Marker
                        eventHandlers={{
                            click: (e) => { 
                                // alert(`Precisando de ${Roaster}`); 
                                this.props.contabilizarClicado([mapCoords[0], mapCoords[1]]);
                                console.log(`indo para [${[mapCoords[0]+','+mapCoords[1]]}]`); 
                                // window.open(`https://www.google.com/maps/search/${[mapCoords[0]+','+mapCoords[1]]}`) 
                            }
                        }}
                        icon= {CurrentIcon} 
                        key={k}
                        center={[mapCoords[0], mapCoords[1]]}
                        position={[mapCoords[0], mapCoords[1]]}
                    >
                        {this.configPopup(dadosPopup)}
                                    
                        {/* <Popup>
                            <a href={googleDirection} target='_blank' rel="noreferrer">Ir para o destino</a>
                            <br/>
                            {precisandoMsg}
                            <br/>
                            {dateMarked} {contato} 
                            <br/>{" (Qtde entregue:"+AlimentoEntregue+")"}
                            <br/>
                            <div className='buttonsSidebySide'>
                                <button className='buttonsSidebySide' onClick={() => this.props.removerPonto([mapCoords[0], mapCoords[1]], Roaster)}>apagar</button>
                                <span>    </span>
                                <button className='buttonsSidebySide floatRight' onClick={() => this.props.entregarAlimento([mapCoords[0], mapCoords[1]])}>entreguei</button>
                            </div>
                        </Popup> */}
                        {/* <Tooltip
                            // direction="auto"
                            // offset={[15, 0]}
                            // opacity={1}>
                            // <span><a href={URL}>Precisando de<br></br>{Roaster}</a></span>
                            // <span>{City}, BR</span>
                        </Tooltip> */}
                    </Marker>);
            })}
        </MarkerClusterGroup>
    }

    renderCestaBasica(){
        return <MarkerClusterGroup
        // grupo dos que precisam
            spiderfyDistanceMultiplier={1}
            showCoverageOnHover={false}
            maxClusterRadius={35}
            iconCreateFunction={markerclusterOptionsPrecisando}
        >                        
            {this.props.dataMapsProp.filter(x => {return x.Roaster==="Alimento de cesta básica" }).map((dataItem, k) => {
                let { City, mapCoords, Roaster, URL, DateISO, Telefone, DiaSemana, AlimentoEntregue, Avaliacao} = dataItem;
                
                if(mapCoords === undefined) return; if(URL===undefined) URL = "";
                
                let {googleDirection, dateMarked, Telefone: contato, AvaliacaoData: nota} = this.setupVariables(mapCoords,DateISO,Telefone);
        
                //if(envVariables.distanceInKmBetweenEarthCoordinates(envVariables.currentLocation[0], envVariables.currentLocation[1], mapCoords[0], mapCoords[1]) > 30) return(<div></div>)
                            
                if(envVariables.telefoneFilter && (contato===undefined || contato==="")) return (<div></div>);
                //filtrar datas antigas
                // if(
                //     dateMarked.includes("semana") 
                // //&& Number(dateMarked.replace(/[^0-9]/g,'')) > 7
                // ) return (<div></div>);
                
                let precisandoMsg, CurrentIcon;
                // switch(Roaster){                                
                //     case "Alimento de cesta básica":
                        precisandoMsg = `Precisando de ${Roaster}`+URL;
                        CurrentIcon = myIcon;
                //         break;
                    
                //     default:
                //         return (<div></div>);
                //         break;
                // }

                let dadosPopup = {...dataItem};
                dadosPopup.precisandoMsg = precisandoMsg;
                dadosPopup.googleDirection = googleDirection;
                dadosPopup.dateMarked = dateMarked;
                dadosPopup.contato = contato;
                dadosPopup.Avaliacao = nota;
                
                return (
                    <Marker
                        eventHandlers={{
                            click: (e) => { 
                                // alert(`Precisando de ${Roaster}`); 
                                this.props.contabilizarClicado([mapCoords[0], mapCoords[1]]);
                                console.log(`indo para [${[mapCoords[0]+','+mapCoords[1]]}]`); 
                                // window.open(`https://www.google.com/maps/search/${[mapCoords[0]+','+mapCoords[1]]}`) 
                            }
                        }}
                        icon= {CurrentIcon} 
                        key={k}
                        center={[mapCoords[0], mapCoords[1]]}
                        position={[mapCoords[0], mapCoords[1]]}
                    >
                        {this.configPopup(dadosPopup)}
                                    
                        {/* <Popup>
                            <a href={googleDirection} target='_blank' rel="noreferrer">Ir para o destino</a>
                            <br/>
                            {precisandoMsg}
                            <br/>
                            {dateMarked} {contato} 
                            <br/>{" (Qtde entregue:"+AlimentoEntregue+")"}
                            <br/>
                            <div className='buttonsSidebySide'>
                                <button className='buttonsSidebySide' onClick={() => this.props.removerPonto([mapCoords[0], mapCoords[1]], Roaster)}>apagar</button>
                                <span>    </span>
                                <button className='buttonsSidebySide floatRight' onClick={() => this.props.entregarAlimento([mapCoords[0], mapCoords[1]])}>entreguei</button>
                            </div>
                        </Popup> */}
                        {/* <Tooltip
                            // direction="auto"
                            // offset={[15, 0]}
                            // opacity={1}>
                            // <span><a href={URL}>Precisando de<br></br>{Roaster}</a></span>
                            // <span>{City}, BR</span>
                        </Tooltip> */}
                    </Marker>);
            })}
        </MarkerClusterGroup>
    }

    renderTestes(){
        return <MarkerClusterGroup
        // grupo dos que precisam
            spiderfyDistanceMultiplier={1}
            showCoverageOnHover={false}
            maxClusterRadius={35}
            iconCreateFunction={markerclusterOptionsPrecisando}
        >                        
            {this.props.dataMapsProp.filter(x => {return x.Roaster==="Teste" }).map((dataItem, k) => {
                let { City, mapCoords, Roaster, URL, DateISO, Telefone, DiaSemana, AlimentoEntregue, Avaliacao} = dataItem;
                
                if(mapCoords === undefined) return; if(URL===undefined) URL = "";
                
                let {googleDirection, dateMarked, Telefone: contato, AvaliacaoData: nota} = this.setupVariables(mapCoords,DateISO,Telefone);
        //filtrar datas antigas

                var msec = Date.now() - (new Date(DateISO)).getTime();
                var mins = Math.floor(msec / 60000);
                var hrs = Math.floor(mins / 60);
                if(
                    hrs > 3
                ) return (<div></div>);
                
                
                let precisandoMsg, CurrentIcon;
                // switch(Roaster){                                
                //     case "Teste":
                        CurrentIcon = TestIcon;
                //         break;
                    
                //     default:
                //         return (<div></div>);
                //         break;
                // }
                
                return (
                    <Marker
                        eventHandlers={{
                            click: (e) => { 
                                // alert(`Precisando de ${Roaster}`); 
                                this.props.contabilizarClicado([mapCoords[0], mapCoords[1]]);
                                console.log(`indo para [${[mapCoords[0]+','+mapCoords[1]]}]`); 
                                // window.open(`https://www.google.com/maps/search/${[mapCoords[0]+','+mapCoords[1]]}`) 
                            }
                        }}
                        icon= {CurrentIcon} 
                        key={k}
                        center={[mapCoords[0], mapCoords[1]]}
                        position={[mapCoords[0], mapCoords[1]]}
                    >
                        {/* {this.configPopup(googleDirection,precisandoMsg,dateMarked,contato,AlimentoEntregue,mapCoords,Roaster)} */}
                                    
                        {/* <Popup>
                            <a href={googleDirection} target='_blank' rel="noreferrer">Ir para o destino</a>
                            <br/>
                            {precisandoMsg}
                            <br/>
                            {dateMarked} {contato} 
                            <br/>{" (Qtde entregue:"+AlimentoEntregue+")"}
                            <br/>
                            <div className='buttonsSidebySide'>
                                <button className='buttonsSidebySide' onClick={() => this.props.removerPonto([mapCoords[0], mapCoords[1]], Roaster)}>apagar</button>
                                <span>    </span>
                                <button className='buttonsSidebySide floatRight' onClick={() => this.props.entregarAlimento([mapCoords[0], mapCoords[1]])}>entreguei</button>
                            </div>
                        </Popup> */}
                        {/* <Tooltip
                            // direction="auto"
                            // offset={[15, 0]}
                            // opacity={1}>
                            // <span><a href={URL}>Precisando de<br></br>{Roaster}</a></span>
                            // <span>{City}, BR</span>
                        </Tooltip> */}
                    </Marker>);
            })}
        </MarkerClusterGroup>
    }

    renderSwitch(param){
        switch(this.state.filtro) {
            case "Todos":
                return ([
                    this.renderDoadoresAzul(),
                    this.renderDoadoresVerde(),
                    this.renderNecessitados(),
                    this.renderCestaBasica(),
                    this.renderDoadoresVermelho()]
                )
                break;
            case "CestaBasica":
                return ([
                    this.renderCestaBasica()]
                )
                break;
            case "MoradorRua":
                return ([
                    this.renderNecessitados()]
                )
                break;
            case "Doadores":
                return ([
                    this.renderDoadoresAzul(),
                    this.renderDoadoresVerde(),
                    this.renderDoadoresVermelho()]
                )
                break;
            case "Refeição Pronta":
                return ([
                    this.renderDoadoresVerde(),
                    this.renderDoadoresVermelho()]
                )
                break;	
            case "RedeSocial":	
                return ([	
                    this.renderRedeSocial()]	
                )	
                break;	
            case "Verificados":	
                return ([	
                    this.renderVerificados()]	
                )	
                break;	
            case "Nenhum":	
                return (<div></div>);	
                break;
            default:
                return (<div></div>);	
                break;

        }
    }

}

export default CoffeeMap;