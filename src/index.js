import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StarRating from "./StarRating";
// import TextExpander from './TextExpander';
// import Form from './Form';

const root = ReactDOM.createRoot(document.getElementById("root"));

/*
function Test() {
	const [movieRating, setMovieRating] = useState(0);

	return (
		<div>
			<StarRating color='blue' maxRating={10} onSetRating={setMovieRating} />
			<p>This movie was rated {movieRating} stars</p>
		</div>
	);
}

const message = ['Terrible', 'Bad', 'Okay', 'Good', 'Amazing'];
*/
root.render(
	<React.StrictMode>
		<App />
		{/* <StarRating maxRating={5} message={message} /> */}
		{/* <StarRating size={25} color='red' className='test' defaultRating={3} /> */}
		{/* <Test /> */}
		{/* <TextExpander /> */}
		{/* <Form /> */}
	</React.StrictMode>
);
