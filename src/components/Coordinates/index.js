import React from 'react';

import './css/styles.css'

const Coordinates = (props) => {
	return (
		<section className="coordinates">
			{props.children}
		</section>
	);
};

export default Coordinates;