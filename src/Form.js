import { useState } from 'react';
import './expander.css';

export default function Form() {
	const [text, setText] = useState('');

	return (
		<div>
			<h1>Text</h1>
			<input name='text' />
		</div>
	);
}
