import React, { Component } from 'react';
import { MapContainer, Marker, TileLayer, Tooltip, AttributionControl, Popup, LayersControl } from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import "react-leaflet-markercluster/dist/styles.min.css";
import coffeeBean from '../images/bean.svg';
import hub from '../images/hub.svg';
import green from '../images/green.svg';
import CurrentLocationSVG from '../images/currentLocation.svg';
import TimeAgo from 'javascript-time-ago';

import pt from 'javascript-time-ago/locale/pt.json';
TimeAgo.addDefaultLocale(pt);

const timeAgo = new TimeAgo();

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


class CoffeeMap extends Component {

    // Initial state
    constructor(props) {
        super(props);
        
        this.state = {
            dataMaps: [],
            center: props.location,
        }
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
                    attributionControl={false}>


{/* https://github.com/dhis2-club-tanzania/function-maintenance/blob/0dadaa96955156b6ddefc0fcf9dd54e45ffb9458/src/app/shared/modules/ngx-dhis2-visualization/modules/map/constants/tile-layer.constant.ts */}
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
                    <LayersControl position="topleft">
                    <LayersControl.BaseLayer checked name="Mapa">
                    <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                     attribution=" &copy; <a href='http://openstreetmap.org' target='_blank' rel='noreferrer'>OpenStreetMap</a>"
                    />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Satelite">
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution=" &copy; <a href='http://openstreetmap.org' target='_blank' rel='noreferrer'>OpenStreetMap</a>"
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

                    <MarkerClusterGroup
                        spiderfyDistanceMultiplier={1}
                        showCoverageOnHover={false}
                        maxClusterRadius={35}
                        iconCreateFunction={markerclusterOptionsAnjos}
                    >                        
                        {this.props.dataMapsProp.filter(x => { return x.Coordinates; }).map((dataItem, k) => {
                            let { City, mapCoords, Roaster, URL, DateISO, Telefone, DiaSemana } = dataItem;
                            let googleDirection = `https://www.google.com/maps/search/${[mapCoords[0]+','+mapCoords[1]]}`;
                            
                            let dateMarked;
                            if(DateISO) dateMarked = timeAgo.format(Date.now() - (Date.now() - new Date(DateISO).getTime()) );
                            if(Telefone) Telefone="contato:"+Telefone;
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
                                
                                case "Alimento de cesta básica":
                                case "Alimento pronto":
                                    precisandoMsg = `Precisando de ${Roaster}`+URL;
                                    CurrentIcon = myIcon;
                                    return (<div></div>);
                                    break;
                                
                                case "PrecisandoBuscar":
                                    precisandoMsg = `Precisando de pessoas para buscar `+DiaSemana;
                                    CurrentIcon = greenIcon;
                                    break;
                                
                                default:
                                    precisandoMsg = `Precisando de ${Roaster}`+URL;
                                    CurrentIcon = myIcon;
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
                                    <Popup>
                                        <a href={googleDirection} target='_blank' rel="noreferrer">Ir para o destino</a>
                                        <br/>
                                        {precisandoMsg}
                                        <br/>
                                        {dateMarked} {Telefone}
                                    </Popup>
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

                    
                    <MarkerClusterGroup
                        spiderfyDistanceMultiplier={1}
                        showCoverageOnHover={false}
                        maxClusterRadius={35}
                        iconCreateFunction={markerclusterOptionsPrecisando}
                    >                        
                        {this.props.dataMapsProp.filter(x => { return x.Coordinates; }).map((dataItem, k) => {
                            let { City, mapCoords, Roaster, URL, DateISO, Telefone, DiaSemana } = dataItem;
                            let googleDirection = `https://www.google.com/maps/search/${[mapCoords[0]+','+mapCoords[1]]}`;
                            
                            let dateMarked;
                            if(DateISO) dateMarked = timeAgo.format(Date.now() - (Date.now() - new Date(DateISO).getTime()) );
                            if(Telefone) Telefone="contato:"+Telefone;
                            //filtrar datas antigas
                            // if(
                            //     dateMarked.includes("semana") 
                            // //&& Number(dateMarked.replace(/[^0-9]/g,'')) > 7
                            // ) return (<div></div>);
                            
                            let precisandoMsg, CurrentIcon;
                            switch(Roaster){
                                case "PrecisandoBuscar":
                                case "Doador":
                                    return (<div></div>);
                                    break;
                                
                                case "Alimento de cesta básica":
                                case "Alimento pronto":
                                    precisandoMsg = `Precisando de ${Roaster}`+URL;
                                    CurrentIcon = myIcon;
                                    break;
                                
                                default:
                                    precisandoMsg = `Precisando de ${Roaster}`+URL;
                                    CurrentIcon = myIcon;
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
                                    <Popup>
                                        <a href={googleDirection} target='_blank' rel="noreferrer">Ir para o destino</a>
                                        <br/>
                                        {precisandoMsg}
                                        <br/>
                                        {dateMarked} {Telefone}
                                    </Popup>
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

                    
                </MapContainer>
            </div>
        );
    }
}

export default CoffeeMap;