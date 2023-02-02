import {Link} from 'react-router-dom'

function AdminHomePage(){
    return <div>
        <h2>Admin Homepage</h2>
        <Link to="/admin/new-event" className='btn btn-primary'>Create new event</Link>
    </div>
}

export default AdminHomePage;