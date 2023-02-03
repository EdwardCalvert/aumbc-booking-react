import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import {Marker} from 'react-leaflet/Marker'
import { Popup } from "react-leaflet";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import LeafletControlGeocoder from './LeafletControlGeocoder';
import { useRef } from 'react'
import L from "leaflet";
import api from "./../services/api"
const icon = L.icon({
    iconSize: [31, 52],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
  });


function SelectLocation(props){
    const [selectedLocation, setSelectedLocation] = useState();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [zoom, setZoom] = useState(7);
    const addNewLocation= useRef(false);
    const [map, setMap] = useState(null)
    let markerRefs = useRef([])
    const editMarkerRef = useRef(null);
    const [newMarkerName, setNewMarkerName] = useState("");
    const [newWhat3WordsAddress, setNewWhat3WordsAddress] = useState("");
    const [what3WordsAddressSet,setWhat3WordsAddressSet] = useState(false);
    const [errorWhileProcessing,setErrorWhileProcessing] = useState(false);
    const [locations,setLocations] = useState();
    const [errorWhileLoading, setErrorWhileLoading] = useState(false);

    useEffect(()=>{
        api.get("Location/get-all-locations").then(success =>{
            setLocations(success.data);
            let indexOfASV = success.data.findIndex(x => x.what3WordsAddress === 'recent.soup.mock');
            
            if(indexOfASV !== -1){
                setSelectedIndex(indexOfASV);
                setSelectedLocation(success.data[indexOfASV]);
                props.onLocationChanged(success.data[indexOfASV]);
            }else{
            setSelectedLocation(success.data[0])
            setSelectedIndex(0)
            props.onLocationChanged(success.data[0]);
            }
        },
        error => {
            setErrorWhileLoading(true);
            props.selectedLocation(null);
        })
    },[])

    function markerSelected(event){
        if(!addNewLocation.current){
        const index = locations.findIndex(x => x.what3WordsAddress ===event.what3WordsAddress)
        if(index !== -1){
            setSelectedIndex(index);
            setSelectedLocation(event);
            props.onLocationChanged(event);
        }
    }
    }
 
    function selectionChanged(event){
        let value = event.target.value
        if(value != -1){
            let newLocation = locations[parseInt(value)]
            setSelectedLocation(newLocation);
            setSelectedIndex(value);
            props.onLocationChanged(newLocation);
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
            props.onLocationChanged(null);
        }
    }


   function onAddNewLocationClicked(event){
        addNewLocation.current = true;
        editMarkerRef.current = L.marker([map.getCenter().lat, map.getCenter().lng], { draggable: 'true', icon });
        editMarkerRef.current.addTo(map);
        setSelectedIndex(-1);
        props.onLocationChanged(null);
   }

   function onCancelAddingNewLocationClicked(event){
        map.removeLayer(editMarkerRef.current)
        addNewLocation.current = false;
        setSelectedIndex(0);
        props.onLocationChanged(locations[0]);
    }   
    if(errorWhileLoading){
        return <p className='alert alert-danger'>We could not load the locations from the API. Sorry, this form will not work!</p>
    }

    if(locations){
    return  <div>
        <select className="form-select"  value={selectedIndex} onChange={selectionChanged}>
        <option disabled={!addNewLocation.current} value={-1}>Use map to create new location (click button below & move red marker)</option>
             {locations.map((item,key)=> (<option value={key} key={item.lat+item.lng+item.name} disabled={addNewLocation.current} >{ `${item.name }  (///${item.what3WordsAddress})`}</option>) )}
        </select>
        <div className="card mb-3" >
        {selectedLocation &&
             <div className='map card-img-top'>
               <MapContainer center={[selectedLocation.lat,selectedLocation.lng]} zoom={zoom}  scrollWheelZoom={true}  ref={setMap}  >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        {  locations.map((x,key) =>  <Marker key={x.lat+x.lng+x.name} position={[x.lat,x.lng]} ref={el => markerRefs.current[key] = el}   eventHandlers={{
      click: (e) => {
        if( map){
            map.flyTo([x.lat,x.lng], 16); //normally not run when the map has just been initialised. 
        }
        markerSelected(x)},
    }} > <Popup >{x.name}</Popup></Marker>)}
    <LeafletControlGeocoder/>
        </MapContainer>
             </div> 
        }
        {addNewLocation.current && !errorWhileProcessing&&
             <React.Fragment>
                <p>Create a new location, by moving the marker on the map or supplying a what 3 words address. You need to enter a name before the location is saved.</p>
                <label>Give the marker a name: </label>
                <input type="text" value={newMarkerName} onChange={onMarkerNameChanged}  className="form-control" placeholder="ASV"/>
                <button className="btn btn-success"  disabled={newMarkerName.length < 2} onClick={onSaveMarkerLocation}>Save red marker location</button>
                {!what3WordsAddressSet &&
                <React.Fragment>
                     <label>Or supply a what 3 words address:</label>
                     <input type="text" value={newWhat3WordsAddress} onChange={onWhat3WordsChanged} className="form-control" placeholder="recent.mock.soup"/>
                     <button className="btn btn-secondary" onClick={onWhat3WordsSubmitted}  disabled={newWhat3WordsAddress.length < 3}>Load from What 3 Words Address (please save afterwards!)</button>
                     <button className="btn btn-danger" onClick={onCancelAddingNewLocationClicked}>Cancel adding new location.</button>
                     </React.Fragment>
                }
               
            </React.Fragment>
        }
        {!addNewLocation.current && !errorWhileProcessing &&
            <button className="btn btn-primary" onClick={onAddNewLocationClicked}>Add new location</button>
        }
        {errorWhileProcessing&&
           <p className="alert alert-danger">An error occured while processing your request! No new location can be made. </p> 
        }
         </div>
        </div>
    }

    function onWhat3WordsSubmitted(){
        // Get lat lng object. Set location of marker. Disable dragging. 
        let requestAddress = newWhat3WordsAddress
        if(newWhat3WordsAddress.startsWith("///")){
            requestAddress= newWhat3WordsAddress.substring(3)
        }
        // let latLngResonse ;
        if(locations.findIndex(x => x.what3WordsAddress === newWhat3WordsAddress) ===-1){
        api.get('Location/w3w-to-latlng', { params: { w3w: requestAddress } }).then(success => { 
            let latLngResonse = success.data;
            map.removeLayer(editMarkerRef.current)
            map.flyTo([latLngResonse.lat,latLngResonse.lng], 16)
            setLocations([...locations,{...success.data,what3WordsAddress:requestAddress}])
            setWhat3WordsAddressSet(true);
        }, 
            failure => {console.log(failure);
                errorOutNewLocation();
        });
    }  
    }

    function errorOutNewLocation(){
        setErrorWhileProcessing(true);
        addNewLocation.current = false;
        setSelectedIndex(0);
        setSelectedLocation(locations[0]);
        if(editMarkerRef.current){
        map.removeLayer(editMarkerRef.current);
        }
    }

    function onMarkerNameChanged(e){
        setNewMarkerName(e.target.value);
    }
    function onWhat3WordsChanged(e){
        setNewWhat3WordsAddress(e.target.value);
    }
    function onSaveMarkerLocation(){
        let selectedLocation;
        //Get location of current marker
        if(!what3WordsAddressSet){
         selectedLocation = editMarkerRef.current.getLatLng(); // object of {lat:, lng:}
        map.removeLayer(editMarkerRef.current) 
        }
        else{
            selectedLocation = locations[locations.length -1] // Last item in list.
        }
        api.post("Location/insert-lat-lng",{
                lat: selectedLocation.lat,
                lng: selectedLocation.lng,
                name: newMarkerName
        }).then(success => {
            if(what3WordsAddressSet){
                locations[locations.length -1] = success.data
                setSelectedIndex(locations.length -1);
                map.flyTo([selectedLocation.lat,selectedLocation.lng], 18); //Make super clear which pin they made!
                props.onLocationChanged(success.data);
                setWhat3WordsAddressSet(false);
                setNewWhat3WordsAddress("");
            }
            else{
                props.onLocationChanged(success.data);
                setLocations( [...locations,success.data]);
                setSelectedIndex(locations.length);
                map.flyTo([selectedLocation.lat,selectedLocation.lng], 16);
            }

            setNewMarkerName("");
            //Attempt to make the user 'fly' to where they put the pin. 
          
            addNewLocation.current = false;
          
        }, error => {
            console.log(error);
            errorOutNewLocation();
        }
        )

       


       
    }

}


export default SelectLocation;
