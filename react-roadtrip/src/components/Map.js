import React, {useRef, useEffect, useState} from 'react';

// Mapbox
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions';

// Mapbox token
mapboxgl.accessToken = 'ACCESS_TOKEN';

export default function Map({ mapVisibility }) {
    // Defining the map's container, initial state of null, useRef as component re-renders are not needed
    const mapContainer = useRef(null);
    // Defining the map, initial state of null, useRef as component re-renders are not needed
    const map = useRef(null);

    // Defining the longitude hook, initial state of -70.9, with the 2nd element in the array 
    // being a function to change the longitude
    const [lng, setLng] = useState(-70.9);

    // Defining the latitude hook, initial state of -42.35, with the 2nd element in the array 
    // being a function to change the latitude
    const [lat, setLat] = useState(42.35);

    // Defining the zoom hook, initial state of 9, with the 2nd element in the array 
    // being a function to change the zoom
    const [zoom, setZoom] = useState(7);

    useEffect(() => {
        // If map is already present, don't render another one
        if (map.current) {
            return;
        }
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
        map.addControl(
            new MapboxDirections({
                accessToken: mapboxgl.accessToken
            }),
            'top-left'
        );
    });
    return(
        <div ref={mapContainer} className="map-container" style={{display: mapVisibility}} />
    )
}

