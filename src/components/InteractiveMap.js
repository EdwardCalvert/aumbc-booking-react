import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { useMap } from 'react-leaflet/hooks'
import {Marker} from 'react-leaflet/Marker'
import React, { useEffect, useState, useCallback, useMemo } from "react";
import LeafletControlGeocoder from './LeafletControlGeocoder';

const center = [57.161953, -2.091058]
const zoom = 16


//https://react-leaflet.js.org/docs/example-draggable-marker/
function DisplayPosition({ map }) {
  const [position, setPosition] = useState(() => map.getCenter())


  const onClick = useCallback(() => {
    map.setView(center, zoom)
  }, [map])

  const onMove = useCallback(() => {
    setPosition(map.getCenter())
  }, [map])

  useEffect(() => {
    map.on('move', onMove)
    return () => {
      map.off('move', onMove)
    }
  }, [map, onMove])

 
  return (
    <div className='card-body'>
        <h5 className="card-title"> Map for starting location  </h5>
     <p className="card-text">Latitude: {position.lat.toFixed(6)}, Longitude: {position.lng.toFixed(6)}{' '}</p>
     <a className='btn btn-primary' target="_blank" href={"http://maps.google.com/maps?q="+position.lat.toFixed(6)+","+position.lng.toFixed(6)}>Open in Google Maps</a>
     <button onClick={onClick} className="btn btn-danger">Go to ASV</button>

    
    </div>
  )
}

function ExternalStateExample() {
  const [map, setMap] = useState(null)


  const displayMap = useMemo(
    () => (
    
        
      <MapContainer 
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        ref={setMap}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
       
        <LeafletControlGeocoder />

      </MapContainer>
      
   
    ),
    [],
  )

  return (
    <div className="card mb-3" >
    <div className='map card-img-top'>
      
      {displayMap}
    </div>
     
     {map ? <DisplayPosition map={map} title={"Start location"}/> : null}
     

 </div>
  )
}

export default ExternalStateExample;
