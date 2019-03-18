import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import './css/styles.css';

class Map extends Component {
	componentDidMount() {
		mapboxgl.accessToken = 'pk.eyJ1IjoicHNrd2lyb3dza2kiLCJhIjoiY2p0ZTZrY3RoMWVvMTN5cDl5MjMzeTNlOSJ9.P4MMUufRr5lMk1ULhpptfw';
		this.map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/streets-v9',
			zoom: 0
		});
	}

	componentDidUpdate() {
		const issPosition = this.props.issPosition;
		const markerElement = document.createElement('div');
		markerElement.className = 'marker';
		if (issPosition) {
			this.issMarker = new mapboxgl.Marker(markerElement)
				.setLngLat(issPosition)
				.addTo(this.map);
		}
		this.map.flyTo({
			center: issPosition,
			speed: 0.1,
			curve: 1,
			easing(t) {
				return t;
			}
		})
	}

	render() {
		return (
			<div id="map" />
		);
	}
}

export default Map;