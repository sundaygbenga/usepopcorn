// import React, { Fragment } from 'react';
// import spinner from './spinner.gif';
import spinner from './Spinner-2.gif';

const Spinner = () => (
	<>
		<img
			src={spinner}
			alt='Loading...'
			style={{
				width: '200px',
				margin: 'auto',
				display: 'block',
				background: 'none',
			}}
		/>
	</>
);

export default Spinner;
