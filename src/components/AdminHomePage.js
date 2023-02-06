import {Link} from 'react-router-dom'

function AdminHomePage(){
    return <div>
        <h2>Admin Homepage</h2>
        <ul className='no-bullets'>
            <li className='mb-3'><Link to="/admin/new-event" className='btn btn-primary'>Create new event</Link></li>
            <li className='mb-3'><Link to="/admin/unpaid-drivers" className='btn btn-primary'>View drivers that need to be paid</Link></li>
        </ul>
    </div>
}



export default AdminHomePage;