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

    async function ToggleAdminState(email){
        await api.get("auth/toggle-admin",  { params : { emailAddress : email}}).then(success => {
           const index =  users.findIndex(x => x.emailAddress ==  email);
           const copyOfUsers = users;
           copyOfUsers[index].role = success.data;
           setUsers([...copyOfUsers]);
        }, error=>{

        })
    }

    async function ToggleNewsletterState(email){
        await api.get("auth/toggle-newsletter",  { params : { emailAddress : email}}).then(success => {
           const index =  users.findIndex(x => x.emailAddress ==  email);
           const copyOfUsers = users;
           copyOfUsers[index].notifyNewEvents = success.data;
           setUsers([...copyOfUsers]);
        }, error=>{

        })
    }

    async function DeleteUser(email){
        await api.delete("auth/delete-user",  { params : { emailAddress : email}}).then(success => {
           const index =  users.findIndex(x => x.emailAddress ==  email);
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
        { users.map((item, index) => <tr key={item.emailAddress}>
            {item.emailAddress !== authenticationService.currentUserValue.emailAddress &&
            <React.Fragment>
                <td>{item.firstName} {item.lastName}</td>
                <td>{item.role}</td>
                <td><button className="btn btn-sm btn-primary btn-block me-1" onClick={() => ToggleAdminState(item.emailAddress)}>{item.role == "Administrator"? "Demote": "Promote"}</button>
                <button className="btn btn-sm btn-primary btn-block me-1" onClick={() => ToggleNewsletterState(item.emailAddress)}>{item.notifyNewEvents ? "Unsubscribe": "Subscribe"}</button>
                <button className="btn btn-sm btn-danger btn-block me-1" onClick={() => DeleteUser(item.emailAddress)}>delete</button></td>
                </React.Fragment>
            }
            {item.emailAddress === authenticationService.currentUserValue.emailAddress &&
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