import api from './../services/api';
import {useEffect, useState} from 'react';

function NewsletterPage(){
    const [newsletterSubscribe, setNewsletterSubscribe] = useState(true);
    const [errorWhileLoading, setErrorWhileLoading] = useState();
    const [successWhileSaving, setSuccessWhileSaving] = useState(false);
    const [errorWhileSaving, setErrorWhileSaving] = useState(false);
    useEffect(()=> {
        api.get("auth/newsletter").then(success => {
            setNewsletterSubscribe(success.data)
            console.log(success.data)

        }, error=>{
            setErrorWhileLoading(true);
        } )

    },[])

    function postNewState(){
        console.log(!newsletterSubscribe);
        const data = !newsletterSubscribe;
        api.post("auth/newsletter",data).then(success=>{
            setSuccessWhileSaving(true);
            console.log(success);
        }, error => {
            setErrorWhileSaving(true);
            setSuccessWhileSaving(false);
        })
    }

    if(errorWhileLoading){
        return <p className='alert alert-danger'>Unable to load your current subscription state</p>
    }
    else{
        return<div>
            <h2>Newsletter prefences</h2>
              <div className="row mb-3 gx-3 gy-2">
            <label className="col-sm-2">Subscribe?</label>
            
            <div className="col-sm-6"><input type='checkbox' checked={newsletterSubscribe} onChange={(e) => {setNewsletterSubscribe(e.target.checked);
            postNewState();
        }} /> <label className='checkbox-text'>We'll let you know when a new event is created</label>
        </div>
            </div>
        
        {successWhileSaving && 
            <p className='alert alert-primary'>Your preferences have been updated</p>
        }
        {errorWhileSaving && 
            <p className='alert alert-danger'> We couldn't update your preference. </p>
        }
        </div>
    }

}

export default NewsletterPage;