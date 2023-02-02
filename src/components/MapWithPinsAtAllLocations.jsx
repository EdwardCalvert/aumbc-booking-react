import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import {Marker} from 'react-leaflet/Marker'
import React, { useEffect, useState, useCallback, useMemo } from "react";
import LeafletControlGeocoder from './LeafletControlGeocoder';

 const asv = [57.161953, -2.091058]
// const zoom = 16


//https://react-leaflet.js.org/docs/example-draggable-marker/
function DisplayPosition({ map, lat,lng, zoom }) {
  useEffect(() => {
    map.setView([lat,lng], zoom)
  }, [lat, lng]) 
}

function MapWithPinsAtAllLocations({lat,lng,locations,onMarkerSelected,zoom}) {
  const [map, setMap] = useState(null)

  const displayMap = useMemo(
    () => (
      <MapContainer 
        center={[lat,lng]}
        zoom={5}
        scrollWheelZoom={true}
        ref={setMap}  >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <LeafletControlGeocoder /> */}
      {  locations.map((x,key) =>  <Marker key={key} position={[x.lat,x.lng]} eventHandlers={{
    click: (e) => {
      if(map){
        zoom = 16;
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
     
     {map ? <DisplayPosition map={map}  lat={lat} lng={lng} zoom={zoom}  /> : null}
   
     

 </div>
  )
}

export default MapWithPinsAtAllLocations;
