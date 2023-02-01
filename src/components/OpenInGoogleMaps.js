import React from "react";

function OpenInGoogleMps({position}){
  return  <a className='btn btn-primary mt-3' target="_blank" href={"http://maps.google.com/maps?q="+position.lat.toFixed(6)+","+position.lng.toFixed(6)}>Open in Google Maps</a>
}

export default OpenInGoogleMps