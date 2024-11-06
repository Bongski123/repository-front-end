// MapboxMap.js
import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWxtYXJpbzEyMyIsImEiOiJjbTM0dnl6YnAwMm51MnFweWdsaTN2a3ZqIn0.lxOMyhlRpSL7jLKMSD2l5Q'; // Replace with your Mapbox access token

const MapboxMap = ({ downloadLocations }) => {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map', // Container ID
      style: 'mapbox://styles/mapbox/streets-v11', // Choose a style
      center: [121.7740, 12.8797], // Initial center position [lng, lat]
      zoom: 6, // Initial zoom
    });

    map.addControl(new mapboxgl.NavigationControl());

    // Function to add markers for locations
    const addMarkers = () => {
      // Clear existing markers if needed
      const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
      existingMarkers.forEach(marker => marker.remove());

      downloadLocations.forEach(location => {
        const { loc } = location; // loc is a comma-separated string
        const [lat, lng] = loc.split(',').map(coord => parseFloat(coord));

        // Filter locations to show only if they are within the Philippines
        if (lat >= 5.0 && lat <= 20.0 && lng >= 117.0 && lng <= 127.0) {
          new mapboxgl.Marker()
            .setLngLat([lng, lat]) // Set marker position
            .setPopup(new mapboxgl.Popup().setHTML(`<h4>Location</h4><p>${location.city}, ${location.region}, ${location.country}</p>`)) // Add a popup
            .addTo(map); // Add to map
        }
      });
    };

    // Add markers initially
    addMarkers();

    // Update markers whenever downloadLocations changes
    map.on('load', addMarkers);

    // Clean up on unmount
    return () => map.remove();
  }, [downloadLocations]);

  return <div id="map" style={{ width: '100%', height: '100%' }} />;
};

export default MapboxMap;
