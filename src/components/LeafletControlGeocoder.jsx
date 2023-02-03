import { useMap } from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import L from "leaflet";

import  { useState } from "react";

export default function LeafletControlGeocoder() {
    let [map, marker] = useState(null)
   map = useMap();

      const control = L.Control.geocoder({
        query: '',
        placeholder: 'Search by postcode...',
        defaultMarkGeocode: false,
        geocoder: L.Control.Geocoder.nominatim(),
      }).on('markgeocode', function(e) {
    
        const location = new L.LatLng(e.geocode.center.lat,e.geocode.center.lng)
    map.setView( location, 14)

  })
      .addTo(map);
  return null;
}
