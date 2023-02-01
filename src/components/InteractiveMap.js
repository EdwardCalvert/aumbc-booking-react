// import { MapContainer } from 'react-leaflet/MapContainer'
// import { TileLayer } from 'react-leaflet/TileLayer'
// import { useMap } from 'react-leaflet/hooks'
// import {Marker} from 'react-leaflet/Marker'
// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import LeafletControlGeocoder from './LeafletControlGeocoder';

//  const asv = [57.161953, -2.091058]
// const zoom = 16


// //https://react-leaflet.js.org/docs/example-draggable-marker/
// function DisplayPosition({ map, lat,lng,onChange }) {
//   const [position, setPosition] = useState(() => map.getCenter())


//   const recenterMap = useCallback(() => {
//     map.setView([lat,lng], zoom)
//   }, [lat,lng])

//   const goToASV = useCallback(() => {
//     map.setView(asv, zoom)
//   }, [lat,lng])


//   const onMove = useCallback(() => {
 
//     setPosition(map.getCenter())
//     onChange(map.getCenter())
//   }, [map])

//   useEffect(() => {
//     map.on('move', onMove)
//     return () => {
//       map.off('move', onMove)
//     }
//   }, [map, onMove])

//   useEffect(() => {
//     recenterMap()
//     setPosition(map.getCenter())
//   }, [lat, lng]) // Watches the parameters and makes the map view the center! 
  

 
//   return (
//     <div className='card-body'>
//      <p className="card-text">Latitude: {position.lat.toFixed(6)}, Longitude: {position.lng.toFixed(6)}{' '}</p>
//      <button onClick={goToASV} className="btn btn-danger">Go to ASV</button>

    
//     </div>
//   )
// }

// function InteractiveMap({lat,lng,onChange,locations,onMarkerSelected}) {
//   const [map, setMap] = useState(null)

//   const displayMap = useMemo(
//     () => (
//       <MapContainer 
//         center={[lat,lng]}
//         zoom={zoom}
//         scrollWheelZoom={true}
//         ref={setMap}  >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <LeafletControlGeocoder />
//       {  locations.map(x =>  <Marker position={[x.lat,x.lng]} eventHandlers={{
//     click: (e) => {
//       console.log('marker clicked', e)
//       onMarkerSelected(x)
//     },
//   }} />)}
//       </MapContainer>
//     ),
//     []
//   )
  

//   return (
//     <div className="card mb-3" >
//     <div className='map card-img-top'>
      
//       {displayMap}
//     </div>
     
//      {map ? <DisplayPosition map={map}  lat={lat} lng={lng} onChange={onChange} /> : null}
   
     

//  </div>
//   )
// }

// export default InteractiveMap;
