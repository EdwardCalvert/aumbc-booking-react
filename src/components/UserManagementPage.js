import React,{ useEffect, useState } from "react";
import { config } from "rxjs";
import authenticationService from "../services/authentication.service";
import api from "./../services/api"

function UserManagementPage(){
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [errorWhileLoading,setErrorWhileLoading ] = useState(false)

useEffect( ()=>{
     api.get("auth/get-all-users").then(success => {
       
        if(success.status == 200){
            setUsers(success.data);
        }
        setLoading(false);
        setErrorWhileLoading(false);
    })
},[])

    async function ToggleAdminState(accountId){
        await api.get("auth/toggle-admin",  { params : { accountId : accountId}}).then(success => {
            editDataRow(accountId,"role",success.data);
        }, error=>{

        })
    }

   function editDataRow(accountId, propName, newValue){
        let copyOfRows = users
        const indexToRemove = copyOfRows.findIndex(x => x.accountId === accountId)
        copyOfRows[indexToRemove][propName] = newValue ;
        setUsers([...copyOfRows])
      }
    async function DeleteUser(accountId){
        await api.delete("auth/delete-user",  { params : { accountId : accountId}}).then(success => {
           const index =  users.findIndex(x => x.accountId ==  accountId);
           const copyOfUsers = users;
           copyOfUsers.splice(index, 1);
           setUsers([...copyOfUsers]);
        }, error=>{

        })
    }

return <div>
    <h2>User Manager</h2>
    <p>Please note: when you promote/demote a user, there will be a delay of up to 24 hours before the effect is propogated to the user, due to the design of the authentication system. If the affected user logs out and in again, the effects will be immediate </p>
<table className="table">
    <thead>
        <tr>
        <th>Name</th>
        <th>Role</th>
        <th>Controls</th>
        </tr>
    </thead>
    <tbody>
        { users.map((item, index) => <tr key={item.accountId}>
            {item.accountId !== authenticationService.currentUserValue.accountId &&
            <React.Fragment>
                <td>{item.firstName} {item.lastName}</td>
                <td>{item.role}</td>
                <td><button className="btn btn-sm btn-primary btn-block me-1" onClick={() => ToggleAdminState(item.accountId)}> <i className={item.role !== "Administrator"? "bi bi-person-up": "bi bi-person-fill-down"} ></i></button>
                <button className="btn btn-sm btn-danger btn-block me-1" onClick={() => DeleteUser(item.accountId)}><i className="bi bi-trash"></i></button></td>
                </React.Fragment>
            }
            {item.accountId === authenticationService.currentUserValue.accountId &&
                <td colSpan={3}>You</td>
            }
            
        </tr>)}

    </tbody>
</table>
{loading &&
   
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                </div>
            </div>
}
</div>

}

export default UserManagementPage;