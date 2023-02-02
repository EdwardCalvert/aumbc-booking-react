import MapWithPinsAtAllLocations from "./MapWithPinsAtAllLocations";
import StaticMap from "./StaticMap";
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import {Marker} from 'react-leaflet/Marker'
import { Popup } from "react-leaflet";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import LeafletControlGeocoder from './LeafletControlGeocoder';
import { useRef } from 'react'
import L from "leaflet";
const icon = L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
  });


function SelectLocation({locations}){
    const [selectedLocation, setSelectedLocation] = useState({what3WordsAddress: 'recent.soup.mock', visible: true, name: 'ASV', lat: 57.161957, lng: -2.091061});
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [zoom, setZoom] = useState(7);
    const addNewLocation= useRef(false);
    const [map, setMap] = useState(null)
    let markerRefs = useRef([])
    const editMarkerRef = useRef(null);

    function markerSelected(event){
        if(!addNewLocation.current){
        const index = locations.findIndex(x => x.what3WordsAddress ===event.what3WordsAddress)
        if(index !== -1){
            setSelectedIndex(index);
            setSelectedLocation(event);
        }
    }
    }
 
    function selectionChanged(event){
        let value = event.target.value
        if(value != -1){
            let newLocation = locations[parseInt(value)]
            setSelectedLocation(locations[parseInt(value)]);
            setSelectedIndex(value);
            //Programattically update location of map
            if (map) {
                map.flyTo([newLocation.lat,newLocation.lng], 16)
                const marker = markerRefs.current[value]
                if (marker) {
                    marker.openPopup()
                }
            }
        }
        else{
            setSelectedIndex(-1);
        }
    }

    function EditMarkerDragEnd(e){
        console.log(e)

    }

   function onAddNewLocationClicked(event){
        addNewLocation.current = true;
        editMarkerRef.current = L.marker([map.getCenter().lat, map.getCenter().lng], { draggable: 'true', icon }).addEventListener("dragend",EditMarkerDragEnd);
        editMarkerRef.current.addTo(map);
        setSelectedIndex(-1);
   }

   function onCancelAddingNewLocationClicked(event){

        map.removeLayer(editMarkerRef.current)
    addNewLocation.current = false;
    setSelectedIndex(0);
    }   

    const displayMap = useMemo(
      () => (
        <MapContainer center={[selectedLocation.lat,selectedLocation.lng]} zoom={zoom}  scrollWheelZoom={true}  ref={setMap} eventHandlers={{
            click : (e)=>{
                if(map){
                        const { lat, lng } = e.latlng;
                        L.marker([lat, lng]).addTo(map);
                      }}} } >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        {  locations.map((x,key) =>  <Marker key={key} position={[x.lat,x.lng]} ref={el => markerRefs.current[key] = el}   eventHandlers={{
      click: (e) => {
        if( map){
            map.flyTo([x.lat,x.lng], 16); //normally not run when the map has just been initialised. 
        }
        markerSelected(x)},
    }} > <Popup >{x.name}</Popup></Marker>)}
        </MapContainer>
      ),
      []
    )

    if(locations){
    return  <div>

    <select className="form-select"  value={selectedIndex} onChange={selectionChanged}>
        <option disabled={!addNewLocation} value={-1}>Use map to create new location (click button below & move red marker)</option>
             {locations.map((item,key)=> (<option value={key} disabled={addNewLocation} key={key}>{ `${item.name }  (///${item.what3WordsAddress})`}</option>) )}
        </select>
        {selectedLocation &&
             <div className="card mb-3" >
             <div className='map card-img-top'>
               
               {displayMap}
             </div>
             
              <AddNewLocationControlWidget/>
              {/* {map ? <DisplayPosition map={map}  lat={selectedLocation.lat} lng={selectedLocation.lng} zoom={zoom}  /> : null} */}
            
              
         
          </div>
        }
        
        <p>Selected map Location:</p>
        <p>Lat:{selectedLocation.lat} Lng:{selectedLocation.lng} </p>
        </div>
    }

    function AddNewLocationControlWidget(){
        if(addNewLocation.current){
            return <React.Fragment>
            
            <input type="text" className="form-control" placeholder="Name the red marker (like 'ASV')"/>
            <button className="btn btn-primary" disabled={true}>Save red marker location</button>
            <p>Or supply a what 3 words address:</p>
            <input type="text" className="form-control" placeholder="recent.mock.soup"/>
            <button type="text" className="btn btn-primary" disabled={true}>Load from What 3 Words Address</button>
            <button className="btn btn-danger" onClick={onCancelAddingNewLocationClicked}>Cancel adding new location.</button>

            </React.Fragment>
        }
        else{
            return <button className="btn btn-success" onClick={onAddNewLocationClicked}>Add new location</button>
            
        }
    }

}


export default SelectLocation;
