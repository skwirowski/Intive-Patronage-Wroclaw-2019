import React, { Component } from 'react';

import './css/styles.css'

let issCurrentCoordinatesArray = [];
let issCurrentSpeed = null;
class Speed extends Component {
	componentDidUpdate() {
		this.updateCurrentCoordinatesArray();
		if (issCurrentCoordinatesArray.length === 2) {
			issCurrentSpeed = this.calculateIssCurrentMovementSpeed();
		}
	}

	updateCurrentCoordinatesArray = () => {
		const issPosition = this.props.issPosition;
		issPosition.push(this.props.issTimestamp);

		const addCurrentPositionToEndOfArray = () => {
			return issCurrentCoordinatesArray.push(issPosition);
		}

		const removeCurrentPositionFromStartOfArray = () => {
			return issCurrentCoordinatesArray.shift();
		}

		if (issCurrentCoordinatesArray.length < 2) {
			addCurrentPositionToEndOfArray();
		} else {
			addCurrentPositionToEndOfArray();
			removeCurrentPositionFromStartOfArray();
		}
		return issCurrentCoordinatesArray;
	}

	calculateIssMovementDistanceBetweenDataUpdates = () => {
		// calculations based on ‘haversine’ formula (https://www.movable-type.co.uk/scripts/latlong.html)
		const earthRadiusInKilometers = 6371;
		const issAverageDistanceAboveEarthSurfaceInKilometers = 400;
		const totalRadius = earthRadiusInKilometers + issAverageDistanceAboveEarthSurfaceInKilometers;

		const previousLongitude = issCurrentCoordinatesArray[0][0];
		const previousLatitude = issCurrentCoordinatesArray[0][1];
		const currentLongitude = issCurrentCoordinatesArray[1][0];
		const currentLatitude = issCurrentCoordinatesArray[1][1];

		const longitudeDifference = currentLongitude - previousLongitude;
		const latitudeDifference = currentLatitude - previousLatitude;

		const convertDegreesToRadians = (valueInDegrees) => {
			return valueInDegrees * (Math.PI / 180);
		}

		const previousLatitudeInRadians = convertDegreesToRadians(previousLatitude);
		const currentLatitudeInRadians = convertDegreesToRadians(currentLatitude);
		const longitudeDifferenceInRadians = convertDegreesToRadians(longitudeDifference);
		const latitudeDifferenceInRadians = convertDegreesToRadians(latitudeDifference);

		const sphereSurfaceTriangleSideA = (
			Math.sin(latitudeDifferenceInRadians / 2) * Math.sin(latitudeDifferenceInRadians / 2) +
			Math.cos(previousLatitudeInRadians) * Math.cos(currentLatitudeInRadians) *
			Math.sin(longitudeDifferenceInRadians / 2) * Math.sin(longitudeDifferenceInRadians / 2)
		);

		const sphereSurfaceTriangleSideC = (
			2 * Math.atan2(Math.sqrt(sphereSurfaceTriangleSideA), Math.sqrt(1 - sphereSurfaceTriangleSideA))
		);

		const sphericalDistanceInKilometers = totalRadius * sphereSurfaceTriangleSideC;

		return sphericalDistanceInKilometers;
	}

	calculateIssCurrentMovementSpeed = () => {
		const previousTimestamp = issCurrentCoordinatesArray[0][2];
		const currentTimestamp = issCurrentCoordinatesArray[1][2];

		const timestampsDifference = currentTimestamp - previousTimestamp;
		const timeDifferenceInHours = timestampsDifference / 3600;

		const issCurrentSpeedInKilometersPerHour = (
			this.calculateIssMovementDistanceBetweenDataUpdates() / timeDifferenceInHours
		);

		const roundNumberDownwardToInteger = (number) => Math.floor(number);

		return roundNumberDownwardToInteger(issCurrentSpeedInKilometersPerHour);
	}

	render() {
		return (
			<section className="speed">
				<p>ISS current movement speed: {issCurrentSpeed} km/h</p>
			</section>
		);
	}
}

export default Speed;