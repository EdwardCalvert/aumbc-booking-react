import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMap } from 'react-leaflet/hooks'
import {Marker} from 'react-leaflet/Marker'
import L from "leaflet";
import React, { useEffect, useState, useCallback, useMemo ,Component} from "react";

class StaticMap extends Component{
    render(){
        const position = new L.LatLng(this.props.lat,this.props.lng)
        return (
            <div className='EventTile-map'>
            <MapContainer center={position} zoom={this.props.zoom} scrollWheelZoom={false}>
              
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