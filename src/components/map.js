import React, { Component } from 'react';
import { MapContainer, Marker, TileLayer, Tooltip, AttributionControl } from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import "react-leaflet-markercluster/dist/styles.min.css";
import coffeeBean from '../images/bean.svg'

// Leaflet custom marker
const myIcon = new L.Icon({
    // Coffee bean attribution -- Thanks! https://commons.wikimedia.org/wiki/File:Coffee_bean_symbol.svg
    iconUrl: coffeeBean,
    iconSize: new L.Point(20, 20),
    className: 'leaflet-bean-icon',
});

class CoffeeMap extends Component {

    // Initial state
    constructor(props) {
        super(props);
        
        this.state = {
            dataMaps: [],
            center: props.location
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
                    maxZoom={20}
                    center={this.state.center}
                    attributionControl={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution=" &copy; <a href='http://openstreetmap.org' target='_blank'>OpenStreetMap</a>"
                    />

                    <AttributionControl
                        position="bottomleft"
                        prefix={false}
                    />

                    <MarkerClusterGroup
                        spiderfyDistanceMultiplier={1}
                        showCoverageOnHover={false}
                        maxClusterRadius={35}
                    >
                        {this.props.dataMapsProp.filter(x => { return x.Coordinates; }).map((dataItem, k) => {
                            let { City, mapCoords, Roaster, URL } = dataItem;
                            return (
                                <Marker
                                    eventHandlers={{
                                        click: (e) => { console.log(`indo para [${[mapCoords[0]+','+mapCoords[1]]}]`); window.open(`https://www.google.com/maps/search/${[mapCoords[0]+','+mapCoords[1]]}`) }
                                    }}
                                    icon={myIcon}
                                    key={k}
                                    center={[mapCoords[0], mapCoords[1]]}
                                    position={[mapCoords[0], mapCoords[1]]}
                                >
                                    <Tooltip
                                        direction="auto"
                                        offset={[15, 0]}
                                        opacity={1}>
                                        <span><a href={URL}>Precisando de<br></br>{Roaster}</a></span>
                                        {/* <span>{City}, BR</span> */}
                                    </Tooltip>
                                </Marker>);
                        })}
                    </MarkerClusterGroup>
                </MapContainer>
            </div>
        );
    }
}

export default CoffeeMap;