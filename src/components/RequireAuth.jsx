import { useLocation } from 'react-router-dom';
import { Navigate, Link } from 'react-router-dom';
import authenticationService from '../services/authentication.service';

function RequireAuth({  children: Component, roles }) {
    const currentUser = authenticationService.currentUserValue;
        if (!currentUser) {

            // not logged in so redirect to login page with the return url //, state: { from: props.location }
            return <Navigate to="/login" replace={true} />
        }

        // check if route is restricted by role
        if (roles && roles.indexOf(currentUser.role) === -1) {
            // role not authorised so redirect to home page
            return <Navigate to="/login" replace={true} />
        }
  
    return Component;
  }

  export default RequireAuth;