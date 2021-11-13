import React, {useRef, useEffect, useState} from 'react';

// Mapbox
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

// Mapbox token
mapboxgl.accessToken = 'API_KEY';

export default function Map({ state }) {
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

    // Defining the zoom hook, initial state of 7, with the 2nd element in the array 
    // being a function to change the zoom
    const [zoom, setZoom] = useState(7);

    useEffect(() => {
        // If map is already present, don't render another one
        if (map.current) {
            return;
        }
        // Sets the current map state from 'null' to a new 'mapboxgl.Map' object
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
        map.current.addControl(
            new MapboxDirections({
                accessToken: mapboxgl.accessToken,
                controls: {
                    profileSwitcher: false
                },
            }),
            'top-left'
        );
    });

    useEffect(() => {
        // Function to set state of Long, Lat and Zoom value to to the center, updating the values when center changes
        // toFixed is used for rounding decimal places.
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        })
    });
    return(
        <div ref={mapContainer} className="map-container" style={{display: state}} />
    )
}