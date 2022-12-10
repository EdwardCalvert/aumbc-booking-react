import { useMap } from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import L from "leaflet";

import React, { useEffect, useState, useCallback, useMemo } from "react";


import icon from "./constants";

export default function LeafletControlGeocoder() {
    let [map, marker] = useState(null)
   map = useMap();

   marker = L.marker(map.getCenter()).addTo(map);
      const geocoder = L.Control.Geocoder.nominatim();
      
      

      const control = L.Control.geocoder({
        query: 'Moon',
        placeholder: 'Search here...',
        defaultMarkGeocode: false,
        geocoder: geocoder
      }).on('markgeocode', function(e) {
    
        const location = new L.LatLng(e.geocode.center.lat,e.geocode.center.lng)
    map.setView( location, 14)

  })
      .addTo(map);

      setTimeout(function() {
        control.setQuery('Earth');
      }, 12000);

      control.log = true;

      map.on('move', function () {
		marker.setLatLng(map.getCenter());
	});


  return null;
}
