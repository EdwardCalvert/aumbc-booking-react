import React, {useEffect, useState} from "react";
import MapWithPinsAtAllLocations from "./MapWithPinsAtAllLocations";
import StaticMap from "./StaticMap";
function SelectLocation({locations}){
const [selectedLocation, setSelectedLocation] = useState({what3WordsAddress: 'recent.soup.mock', visible: true, name: 'ASV', lat: 57.161957, lng: -2.091061});
const [selectedIndex, setSelectedIndex] = useState(0);

    function markerSelected(event){

        const index = locations.findIndex(x => x.what3WordsAddress ===event.what3WordsAddress)
        if(index !== -1){
            setSelectedIndex(index);
            setSelectedLocation(event);
        }
    }
 
    function selectionChanged(event){
        // console.log("SELECTION CHANGED")
        let value = event.target.value
        if(value != -1){
        setSelectedLocation(locations[parseInt(value)]);
        setSelectedIndex(value);
        }
        else{
            setSelectedIndex(-1);
        }
    }

    if(locations){
    return  <div>

    <select className="form-select"  value={selectedIndex} onChange={selectionChanged}>
        <option value={-1}>Use map to select own value (work in progress) </option>
             {locations.map((item,key)=> (<option value={key} key={key}>{ `${item.name }  (///${item.what3WordsAddress})`}</option>) )}
        </select>
        {selectedLocation &&
            <MapWithPinsAtAllLocations lat={selectedLocation.lat} lng={selectedLocation.lng} zoom={13} locations={locations} onMarkerSelected={markerSelected}/>
        }

        Selected map Location:
        <p>Lat:{selectedLocation.lat} Lng:{selectedLocation.lng} </p>

        {/* Custom map location external state: 
        <p>Lat:{customMapLocation.lat} Lng:{customMapLocation.lng} </p> */}
        </div>
    }

}
export default SelectLocation;
