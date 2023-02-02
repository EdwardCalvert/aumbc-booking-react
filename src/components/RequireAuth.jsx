import { useLocation } from 'react-router-dom';
import { Navigate, Link } from 'react-router-dom';
import authenticationService from '../services/authentication.service';

function RequireAuth({  children: Component, roles }) {
    const currentUser = authenticationService.currentUserValue;
    const returnRoute = encodeURIComponent(window.location.href.split('#')[1]);
        if (!currentUser) {

            // not logged in so redirect to login page with the return url //, state: { from: props.location }
            return <div><h2>Please login to view this page.</h2><Link className='btn btn-primary' to={"/login?redirect="+returnRoute} replace={true} >Take me to the login page </Link> </div>
        }

        // check if route is restricted by role
        if (roles && roles.indexOf(currentUser.role) === -1) {
            // role not authorised so redirect to home page
            return <div><h2>You don't have access to view this page.</h2><p>You attepmted to view a Administrator only page. </p><Link to="/" replace={true}  className='btn btn-primary'>Go home </Link> </div>
        }
  
    return Component;
  }

  export default RequireAuth;