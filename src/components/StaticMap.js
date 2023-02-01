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


function StaticMap({lat,lng,zoom}){ 
        const location = new L.LatLng(lat,lng);
        return (
            <div className='EventTile-map'>
            <MapContainer center={location} zoom={zoom} scrollWheelZoom={false} position={location}  {...interactionOptions} >
              
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={location}>
    
    </Marker>
  </MapContainer>
  </div>
        )
    
}

export default StaticMap;