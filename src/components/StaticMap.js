import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMap } from 'react-leaflet/hooks'
import {Marker} from 'react-leaflet/Marker'
import L from "leaflet";
import React, { useEffect, useState, useCallback, useMemo ,Component} from "react";

 ///Errored out, look at https://github.com/codegeous/react-component-depot/blob/master/src/pages/Leaflet/StaticMap.js
const interactionOptions = {
  zoomControl: true,
  doubleClickZoom: false,
  closePopupOnClick: false,
  dragging: false,
  zoomSnap: true,
  zoomDelta: true,
  trackResize: false,
  touchZoom: true,
  scrollWheelZoom: false,
};


class StaticMap extends Component{

  
    render(){
        const position = new L.LatLng(this.props.lat,this.props.lng)
        return (
            <div className='EventTile-map'>
            <MapContainer center={position} zoom={this.props.zoom} scrollWheelZoom={false} {...interactionOptions} >
              
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={position}>
    
    </Marker>
  </MapContainer>
  </div>
        )
    }
}

export default StaticMap;