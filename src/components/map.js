import React, { Component } from 'react';
import { MapContainer, Marker, TileLayer, Tooltip, AttributionControl, Popup, LayersControl } from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import "react-leaflet-markercluster/dist/styles.min.css";
import coffeeBean from '../images/bean.svg';
import hub from '../images/hub.svg';
import green from '../images/green.svg';
import red from '../images/red.svg';
import CurrentLocationSVG from '../images/currentLocation.svg';
import TimeAgo from 'javascript-time-ago';

import envVariables from './variaveisAmbiente';

import pt from 'javascript-time-ago/locale/pt.json';
TimeAgo.addDefaultLocale(pt);

const timeAgo = new TimeAgo();

global.lastMarked = undefined;
global.lastMarkedCoords = undefined;

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
                          envVariables.lastMarked = L.marker([lat, lng], {icon:CurrentLocation, draggable: true}).addTo(map.target);
                        });
                      }}
                    >


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
                    <LayersControl position="bottomleft">
                    <LayersControl.BaseLayer checked name="Waze">
                    <TileLayer url="https://worldtiles1.waze.com/tiles/{z}/{x}/{y}.png"
                        attribution=" &copy; <a href='www.waze.com/pt-BR/live-map' target='_blank' rel='noreferrer'>Waze</a>"
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

                    
                </MapContainer>
            </div>
        );
    }

    
    setupVariables(mapCoords,DateISO,Telefone){
        let googleDirection = `https://www.google.com/maps/search/${[mapCoords[0]+','+mapCoords[1]]}`;
                            
        let dateMarked = timeAgo.format(Date.now() - (Date.now() - new Date(DateISO).getTime()) );
         //if(DateISO) dateMarked
        if(Telefone){
            switch(Telefone.length){
                case 8:
                    Telefone="contato:"+Telefone.replace(/(\d{4})(\d{4})/g, "$1-$2");
                    break;
                case 9:
                    Telefone="contato:"+Telefone.replace(/(\d{5})(\d{4})/g, "$1-$2");
                    break;
                default:
                    Telefone="contato:"+Telefone.replace(/(\d{2})(\d{5})(\d{4})/g, "($1) $2-$3");
                    break;
            }
        }
        return {googleDirection, dateMarked, Telefone};
    }

    configPopup(googleDirection, precisandoMsg, dateMarked, contato, 
        AlimentoEntregue, mapCoords, Roaster){
        return <Popup>
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
                                    
        </Popup>
    }

    renderDoadoresAzul(){
        return <MarkerClusterGroup
                    // grupo de onde pode ajudar
                        spiderfyDistanceMultiplier={1}
                        showCoverageOnHover={false}
                        maxClusterRadius={35}
                        iconCreateFunction={markerclusterOptionsAnjos}
                    >                        
                        {this.props.dataMapsProp.filter(x => { return x.Coordinates; }).map((dataItem, k) => {
                            let { City, mapCoords, Roaster, URL, DateISO, Telefone, DiaSemana, Horario, AlimentoEntregue} = dataItem;
                            
                            let {googleDirection, dateMarked, Telefone: contato} = this.setupVariables(mapCoords,DateISO,Telefone);
                            
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
                                
                                default:
                                    return (<div></div>);
                                    break;
                            }
                            
                            return (
                                <Marker
                                    eventHandlers={{
                                        click: (e) => { 
                                            // alert(`Precisando de ${Roaster}`); 
                                            console.log(`indo para [${[mapCoords[0]+','+mapCoords[1]]}]`); 
                                            // window.open(`https://www.google.com/maps/search/${[mapCoords[0]+','+mapCoords[1]]}`) 
                                        }
                                    }}
                                    icon= {CurrentIcon} 
                                    key={k}
                                    center={[mapCoords[0], mapCoords[1]]}
                                    position={[mapCoords[0], mapCoords[1]]}
                                >
                                   {this.configPopup(googleDirection,precisandoMsg,dateMarked,contato,AlimentoEntregue,mapCoords,Roaster)}
                                    
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
                        {this.props.dataMapsProp.filter(x => { return x.Coordinates; }).map((dataItem, k) => {
                            let { City, mapCoords, Roaster, URL, DateISO, Telefone, DiaSemana, Horario, AlimentoEntregue} = dataItem;
                            
                            let {googleDirection, dateMarked, Telefone: contato} = this.setupVariables(mapCoords,DateISO,Telefone);
                            
                            //filtrar datas antigas
                            // if(
                            //     dateMarked.includes("semana") 
                            // //&& Number(dateMarked.replace(/[^0-9]/g,'')) > 7
                            // ) return (<div></div>);
                            
                            let precisandoMsg, CurrentIcon;
                            switch(Roaster){
                                case "PrecisandoBuscar":
                                    precisandoMsg = `Precisando de pessoas para buscar `+DiaSemana + " pela "+Horario;
                                    CurrentIcon = greenIcon;
                                    break;                                
                                
                                default:
                                    return (<div></div>);
                                    break;
                            }
                            
                            return (
                                <Marker
                                    eventHandlers={{
                                        click: (e) => { 
                                            // alert(`Precisando de ${Roaster}`); 
                                            console.log(`indo para [${[mapCoords[0]+','+mapCoords[1]]}]`); 
                                            // window.open(`https://www.google.com/maps/search/${[mapCoords[0]+','+mapCoords[1]]}`) 
                                        }
                                    }}
                                    icon= {CurrentIcon} 
                                    key={k}
                                    center={[mapCoords[0], mapCoords[1]]}
                                    position={[mapCoords[0], mapCoords[1]]}
                                >
                                   {this.configPopup(googleDirection,precisandoMsg,dateMarked,contato,AlimentoEntregue,mapCoords,Roaster)}
                                    
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
        >                        
            {this.props.dataMapsProp.filter(x => { return x.Coordinates; }).map((dataItem, k) => {
                let { City, mapCoords, Roaster, URL, DateISO, Telefone, DiaSemana, Horario, AlimentoEntregue } = dataItem;
                
                let {googleDirection, dateMarked, Telefone: contato} = this.setupVariables(mapCoords,DateISO,Telefone);
                //filtrar datas antigas
                // if(
                //     dateMarked.includes("semana") 
                // //&& Number(dateMarked.replace(/[^0-9]/g,'')) > 7
                // ) return (<div></div>);
                
                let precisandoMsg, CurrentIcon;
                switch(Roaster){
                    case "EntregaAlimentoPronto":
                        precisandoMsg = `Entregando refeições prontas `+DiaSemana+" pela "+Horario;
                        CurrentIcon = redIcon;
                        break;
                    
                    default:
                        return (<div></div>);
                        break;
                }
                
                return (
                    <Marker
                        eventHandlers={{
                            click: (e) => { 
                                // alert(`Precisando de ${Roaster}`); 
                                console.log(`indo para [${[mapCoords[0]+','+mapCoords[1]]}]`); 
                                // window.open(`https://www.google.com/maps/search/${[mapCoords[0]+','+mapCoords[1]]}`) 
                            }
                        }}
                        icon= {CurrentIcon} 
                        key={k}
                        center={[mapCoords[0], mapCoords[1]]}
                        position={[mapCoords[0], mapCoords[1]]}
                    >
                        {this.configPopup(googleDirection,precisandoMsg,dateMarked,contato,AlimentoEntregue,mapCoords,Roaster)}
                                    
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
            {this.props.dataMapsProp.filter(x => { return x.Coordinates; }).map((dataItem, k) => {
                let { City, mapCoords, Roaster, URL, DateISO, Telefone, DiaSemana, AlimentoEntregue} = dataItem;
                let {googleDirection, dateMarked, Telefone: contato} = this.setupVariables(mapCoords,DateISO,Telefone);
        //filtrar datas antigas
                // if(
                //     dateMarked.includes("semana") 
                // //&& Number(dateMarked.replace(/[^0-9]/g,'')) > 7
                // ) return (<div></div>);
                
                let precisandoMsg, CurrentIcon;
                switch(Roaster){                                
                    case "Alimento de cesta básica":
                    case "Alimento pronto":
                        precisandoMsg = `Precisando de ${Roaster}`+URL;
                        CurrentIcon = myIcon;
                        break;
                    
                    default:
                        return (<div></div>);
                        break;
                }
                
                return (
                    <Marker
                        eventHandlers={{
                            click: (e) => { 
                                // alert(`Precisando de ${Roaster}`); 
                                console.log(`indo para [${[mapCoords[0]+','+mapCoords[1]]}]`); 
                                // window.open(`https://www.google.com/maps/search/${[mapCoords[0]+','+mapCoords[1]]}`) 
                            }
                        }}
                        icon= {CurrentIcon} 
                        key={k}
                        center={[mapCoords[0], mapCoords[1]]}
                        position={[mapCoords[0], mapCoords[1]]}
                    >
                        {this.configPopup(googleDirection,precisandoMsg,dateMarked,contato,AlimentoEntregue,mapCoords,Roaster)}
                                    
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
    }

}

export default CoffeeMap;