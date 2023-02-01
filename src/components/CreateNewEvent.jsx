import api from "./../services/api";
import { useEffect , useState} from "react";
import AutoTextArea from "./AutoTextArea";
import SelectLocation from "./SelectLocation";

const locations = [
    {
      "what3WordsAddress": "firebird.wallet.portable",
      "visible": true,
      "name": "Kirkhill A96 Carpark",
      "lat": 57.1932,
      "lng": -2.242359
    },
    {
      "what3WordsAddress": "recent.soup.mock",
      "visible": true,
      "name": "ASV",
      "lat": 57.161957,
      "lng": -2.091061
    },
    {
      "what3WordsAddress": "scanty.putts.caressed",
      "visible": true,
      "name": "Glentress Forest Lodges",
      "lat": 55.647368,
      "lng": -3.139119
    }
  ]
function CreateNewEvent(){





    return <div>

        <div className="row mb-3 gx-3 gy-2 form-group">
            <label className="col-sm-2">Name</label>
            <div className="col-sm-10">
                <input className=" form-control"  type="text"/>
            </div>
        </div>
        <div className="row mb-3 gx-3 gy-2 form-group">
            <label className="col-sm-2">Description</label>
            <div className="col-sm-10">
                <AutoTextArea/>
            </div>
        </div>
        
        {/* <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">Lift share Location</label>
            <div className="col-sm-10">
            <LocationSelector/>
            </div>
        </div> */}
        <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">Ride Start Location</label>
            <div className="col-sm-10">
                <SelectLocation locations={locations} />
            </div>
        </div>
        <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">Start date & time</label>
            <div className="col-sm-3">
                <input type="datetime-local" className="form-control"/>
            </div>
        </div>
        <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">End date & time</label>
            <div className="col-sm-3">
                <input type="datetime-local" className="form-control"/>
            </div>
        </div>

        <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">Cost for passenger</label>
            <div className="col-sm-3 ">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">£</span>
                    </div>
                    <input className="form-control" type="number"/>
                </div>
            </div>
        </div>
        <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">Cost for driver</label>
            <div className="col-sm-3 ">
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">£</span>
                    </div>
                    <input className="form-control" type="number"/>
                </div>
            </div>
        </div>

    </div>
}

export default CreateNewEvent;

