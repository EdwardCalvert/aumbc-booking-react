import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import {Marker} from 'react-leaflet/Marker'
import React, { useEffect, useState, useCallback, useMemo } from "react";
import LeafletControlGeocoder from './LeafletControlGeocoder';

 const asv = [57.161953, -2.091058]
const zoom = 16


//https://react-leaflet.js.org/docs/example-draggable-marker/
function DisplayPosition({ map, lat,lng }) {
  useEffect(() => {
    map.setView([lat,lng], zoom)
  }, [lat, lng]) 
}

function MapWithPinsAtAllLocations({lat,lng,locations,onMarkerSelected}) {
  const [map, setMap] = useState(null)

  const displayMap = useMemo(
    () => (
      <MapContainer 
        center={[lat,lng]}
        zoom={zoom}
        scrollWheelZoom={true}
        ref={setMap}  >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <LeafletControlGeocoder /> */}
      {  locations.map(x =>  <Marker position={[x.lat,x.lng]} eventHandlers={{
    click: (e) => {
      if(map){
      map.setView([x.lat,x.lng],16);
      }
      onMarkerSelected(x);
    },
  }} />)}
      </MapContainer>
    ),
    []
  )
  

  return (
    <div className="card mb-3" >
    <div className='map card-img-top'>
      
      {displayMap}
    </div>
     
     {map ? <DisplayPosition map={map}  lat={lat} lng={lng}  /> : null}
   
     

 </div>
  )
}

export default MapWithPinsAtAllLocations;
