import api from './../services/api'
import {useEffect, setState} from 'react';
import { useState } from 'react';
import authenticationService from '../services/authentication.service';
import Role from '../_helpers/role';



function CreateNewSemester({value,onChange,allowCreatingNewSemesters}){

    const [semesters, setSemesters ] = useState([]);
    const [selectedValue, setSelectedValue] = useState(-1);
    const [errorWithApi, setErrorWithApi] = useState(false);
    const [petrolPrice, setPetrolPrice] = useState("");
    const [dieselPrice, setDieselPrice] = useState("");
    const [semesterName, setSemesterName] = useState("");
    const [averageCostPerMile,setAverageCostPerMile] = useState(null);
    const [wearAndTearCost,setWearAndTearCost] = useState(null);
    const [carToSeatRatio,setCarToSeatRatio] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        api.get("Finance/get-all-semesters").then(success => {
            if(success.status === 200){
                setSemesters(success.data);
                setSelectedValue(success.data[0].semesterId);
                onChange({target: {value: success.data[0].semesterId}});
                setLoading(false);
            }
           
            setErrorWithApi(false);
        },
        error=> {
            setErrorWithApi(true);
        }
        );
        if(value){
            setSelectedValue(value);
        }
    },[])

    function submitNewSemester(event){
        console.log(event);
        event.preventDefault();
        api.post("Finance/semester",{
            semesterName: semesterName,
            dieselPrice: dieselPrice,
            petrolPrice: petrolPrice,
            averageCostPerMile: averageCostPerMile,
            wearAndTearCost: wearAndTearCost,
            carToSeatRatio: carToSeatRatio
        }).then(success =>{
            setSemesters([...semesters, { semesterName, dieselPrice, petrolPrice,averageCostPerMile,wearAndTearCost,carToSeatRatio, semesterId: success.data}]);
            setSelectedValue(success.data);
        } , error=>{
            setErrorWithApi(true);
        })

    }

    function onSelectionChanged(event){
        event.preventDefault();
        setSelectedValue(event.target.value);
        onChange(event);

    }
    const isUserAdmin = authenticationService.currentUserValue.role === Role.Admin;
    if(errorWithApi){
        return <p className='alert alert-danger'>Unable to load semesters</p>
    }
    else{
    return <div><select className='form-select' onChange={onSelectionChanged} value={selectedValue} disabled={loading} >
        {}
        {semesters.map((item,index)=><option value={item.semesterId} key={index}>{item.semesterName} {isUserAdmin && allowCreatingNewSemesters? `(Diesel: ${item.dieselPrice}p Petrol: ${item.petrolPrice}p, CPM: £${item.averageCostPerMile.toFixed(2)}, Wear & tear: £${item.wearAndTearCost.toFixed(2)} 🚗/💺ratio ${item.carToSeatRatio})`: ""}</option>)}
        {loading && 
            <option>Loading ....</option>
        }
        {isUserAdmin && allowCreatingNewSemesters && 
        <option value={"-1"} >Create new semester</option>
        }
    </select>
    {selectedValue === "-1" && isUserAdmin  &&
    <div className='col-sm-3'>
    <div className="form-group">
        <label>Semester Name</label>
        <input type='text' className='form-control'  value={semesterName} onChange={(e)=> setSemesterName(e.target.value)} required/>
        
        <span className="validity"></span>
        
    </div>
    <div className="form-group">
        <label>Diesel price</label>
        <div className='input-group'>
        <input type='number' className='form-control'value={dieselPrice} onChange={(e)=> setDieselPrice(e.target.value)} step={0.01} min={0} max={1000} required/>
        <div className="input-group-prepend">
         <span className="input-group-text">p</span>
         </div>
        </div>
         <span className="validity"></span>
    </div>
    <div className='form-group'>
        <label>Petrol price</label>
        <div className='input-group'>
        <input type='number' className='form-control'value={petrolPrice} onChange={(e)=> setPetrolPrice(e.target.value)} step={0.01} min={0} max={1000} required/>
        <div className="input-group-append">
    <span className="input-group-text">p</span>
    </div>
  </div>
        <span className="validity"></span>
    </div>
    <div className='form-group'>
        <label>Average cost per mile</label>
        <div className='input-group'>
        <div className="input-group-prepend">
    <span className="input-group-text">£</span>
    </div>
        <input type='number' className='form-control'value={averageCostPerMile} onChange={(e)=> setAverageCostPerMile(e.target.value)} step={0.01} min={0} max={1000} required/>
        
  </div>
        <span className="validity"></span>
    </div>
    <div className='form-group'>
        <label>Wear and tear cost</label>
        <div className='input-group'>
        <div className="input-group-prepend">
    <span className="input-group-text">£</span>
    </div>
        <input type='number' className='form-control'value={wearAndTearCost} onChange={(e)=> setWearAndTearCost(e.target.value)} step={0.01} min={0} max={1000} required/>
        
  </div>
        <span className="validity"></span>
    </div>
    <div className='form-group'>
        <label>Car to seat ratio</label>
        <div className='input-group'>
        <input type='number' className='form-control'value={carToSeatRatio} onChange={(e)=> setCarToSeatRatio(e.target.value)} step={0.01} min={0} max={1000} required/>

  </div>
     
    </div>
    <button type='button' className='btn btn-primary' onClick={submitNewSemester}>Submit</button>
</div>
    }
    
    </div>
    }
}

export default CreateNewSemester;