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

    useEffect(()=>{
        api.get("Finance/get-all-semesters").then(success => {
            if(success.status === 200){
                // console.log("SEMESTERS: ")
                // console.log(success.data)
                setSemesters(success.data);
                setSelectedValue(success.data[0].semesterId);
                onChange({target: {value: success.data[0].semesterId}});
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
            petrolPrice: petrolPrice
        }).then(success =>{
            setSemesters([...semesters, { semesterName, dieselPrice, petrolPrice, semesterId: success.data}]);
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
        return <p className='alert alert-danger'>Create new semester object failed.</p>
    }
    else{
    return <div><select className='form-select' onChange={onSelectionChanged} value={selectedValue} >
        {}
        {semesters.map((item,index)=><option value={item.semesterId} key={index}>{item.semesterName} {isUserAdmin && allowCreatingNewSemesters? `(Diesel: ${item.dieselPrice}p Petrol: ${item.petrolPrice}p)`: ""}</option>)}
        {isUserAdmin && allowCreatingNewSemesters && 
        <option value={"-1"} >Create new semester</option>
        }
    </select>
    {selectedValue === "-1" && isUserAdmin  &&
    <div >
    <div className="form-group">
        <label>Semester Name</label>
        <input type='text' className='form-control'  value={semesterName} onChange={(e)=> setSemesterName(e.target.value)} required/>
        
        <span className="validity"></span>
        
    </div>
    <div className="form-group">
        <label>Diesel price</label>
        <div className='input-group'>
        <input type='number' className='form-control'value={dieselPrice} onChange={(e)=> setDieselPrice(e.target.value)} step={0.01} min={0} max={1000} required/>
        <div class="input-group-prepend">
         <span class="input-group-text">p</span>
         </div>
        </div>
         <span className="validity"></span>
    </div>
    <div className='form-group'>
        <label>Petrol price</label>
        <div className='input-group'>
        <input type='number' className='form-control'value={petrolPrice} onChange={(e)=> setPetrolPrice(e.target.value)} step={0.01} min={0} max={1000} required/>
        <div class="input-group-append">
    <span class="input-group-text">p</span>
    </div>
  </div>
        <span className="validity"></span>
    </div>
    <button type='button' className='btn btn-primary' onClick={submitNewSemester}>Submit</button>
</div>
    }
    
    </div>
    }
}

export default CreateNewSemester;