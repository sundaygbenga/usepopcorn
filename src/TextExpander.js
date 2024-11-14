import { useState } from 'react';
import './expander.css';

export default function TextExpander() {
	return (
		<div>
			<ExpandedText>
				Space travel is the ultimate adventure! Imagine soaring past the stars
				and exploring new worlds. It's the stuff of dreams and science fiction,
				but believe it or not, space travel is a real thing. Humans and robots
				are constantly venturing out into the cosmos to uncover its secrets and
				push the boundaries of what's possible.
			</ExpandedText>

			<ExpandedText
				collapsedNumWords={20}
				expandButtonText='Show text'
				collapseButtonText='Collapse text'
				buttonColor='#ff6622'
			>
				Space travel requires some seriously amazing technology and
				collaboration between countries, private companies, and international
				space organizations. And while it's not always easy (or cheap), the
				results are out of this world. Think about the first time humans stepped
				foot on the moon or when rovers were sent to roam around on Mars.
			</ExpandedText>

			<ExpandedText expanded={true} className='box'>
				Space missions have given us incredible insights into our universe and
				have inspired future generations to keep reaching for the stars. Space
				travel is a pretty cool thing to think about. Who knows what we'll
				discover next!
			</ExpandedText>
		</div>
	);
}

function ExpandedText({
	children,
	expanded = false,
	collapsedNumWords = 10,
	expandButtonText = 'Show more',
	collapseButtonText = 'Show less',
	className,
	buttonColor = '#abd345',
}) {
	const [isExpanded, setIsExpanded] = useState(expanded);

	const displayedNumWords = children
		.split(' ')
		.slice(0, collapsedNumWords)
		.join(' ');

	function handleToggleWords() {
		setIsExpanded((exp) => !exp);
	}

	return (
		<div className={`${className} py-5`}>
			{isExpanded ? children : displayedNumWords}
			{isExpanded ? '' : '...'}
			<Button
				isExpanded={isExpanded}
				expandButtonText={expandButtonText}
				collapseButtonText={collapseButtonText}
				handleSHow={handleToggleWords}
				buttonColor={buttonColor}
			/>
		</div>
	);
}

function Button({
	isExpanded,
	expandButtonText,
	collapseButtonText,
	buttonColor,
	handleSHow,
}) {
	return (
		<button
			// style={{ color: buttonColor }}
			style={{ color: isExpanded ? 'red' : 'green' }}
			onClick={handleSHow}
		>
			{isExpanded ? collapseButtonText : expandButtonText}
		</button>
	);
}
