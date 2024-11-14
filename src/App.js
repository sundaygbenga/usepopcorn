import { useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const average = (arr) =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "c0baf384";
// const KEY = '1d962e6a';

export default function App() {
	const [query, setQuery] = useState("");
	const [selectedId, setSelectedId] = useState(null);
	// Calling custom hooks
	const { movies, isLoading, error } = useMovies(query);

	const [watched, setWatched] = useLocalStorageState([], "watched");

	function handleSelectMovie(id) {
		setSelectedId((selectedId) => (id === selectedId ? null : id));
	}

	function handleCloseMovie() {
		setSelectedId(null);
	}

	function handleAddWatched(movie) {
		setWatched((watched) => [...watched, movie]);

		// localStorage.setItem("watched", JSON.stringify([...watched, movie]));
	}

	function handleDeleteWAtched(id) {
		setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
	}

	return (
		<>
			<NavBar>
				<Logo />
				<Search query={query} setQuery={setQuery} />
				<NumResults movies={movies} />
			</NavBar>
			<Main>
				<Box>
					{/* {isLoading ? <Spinner /> : <MovieList movies={movies} />} */}
					{isLoading && <Spinner />}
					{!isLoading && !error && (
						<MovieList movies={movies} onSelecteMovie={handleSelectMovie} />
					)}
					{error && <ErrorMessage message={error} />}
				</Box>
				<Box>
					{selectedId ? (
						<MovieDetails
							selectedId={selectedId}
							watched={watched}
							onCloseMovie={handleCloseMovie}
							onAddWatched={handleAddWatched}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedMovieList
								watched={watched}
								onDeleteWatched={handleDeleteWAtched}
							/>
						</>
					)}
				</Box>
			</Main>
		</>
	);
}

function ErrorMessage({ message }) {
	return (
		<p className="error">
			<span>🚫</span> {message}
		</p>
	);
}

function NavBar({ children }) {
	return <nav className="nav-bar">{children}</nav>;
}
function Logo() {
	return (
		<div className="logo">
			<span role="img">🍿</span>
			<h1>usePopcorn</h1>
		</div>
	);
}

function Search({ query, setQuery }) {
	// 1. Creating Ref
	const inputEl = useRef(null);

	// 3. Using the Ref
	useKey("Enter", function () {
		if (document.activeElement === inputEl.current) return;
		inputEl.current.focus();
		setQuery("");
	});

	// Manually selecting a dom element, which is not a React way. This can be solved with concept of refs
	// useEffect(() => {
	// 	const el = document.querySelector(".search");
	// 	console.log(el);
	// 	el.focus();
	// }, []);

	return (
		<input
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={(e) => setQuery(e.target.value)}
			//2.  Connecting Ref
			ref={inputEl}
		/>
	);
}

function NumResults({ movies }) {
	return (
		<p className="num-results">
			Found <strong>{movies.length}</strong> results
		</p>
	);
}

function Main({ children }) {
	return <main className="main">{children}</main>;
}

function Box({ children }) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="box">
			<button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
				{isOpen ? "–" : "+"}
			</button>

			{isOpen && children}
		</div>
	);
}

function MovieList({ movies, onSelecteMovie }) {
	return (
		<ul className="list list-movies">
			{movies?.map((movie) => (
				<Movie
					movie={movie}
					key={movie.imdbID}
					onSelecteMovie={onSelecteMovie}
				/>
			))}
		</ul>
	);
}

function Movie({ movie, onSelecteMovie }) {
	return (
		<li key={movie.imdbID} onClick={() => onSelecteMovie(movie.imdbID)}>
			<img src={movie.Poster} alt={`${movie.Title} poster`} />
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>🗓</span>
					<span>{movie.Year}</span>
				</p>
			</div>
		</li>
	);
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
	const [movie, setMovie] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [userRating, setUserRating] = useState("");

	// Refs to persist data between renders
	const countRef = useRef(0);

	useEffect(() => {
		if (userRating) countRef.current = countRef.current++;
	}, [userRating]);

	const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
	const watchedUserRating = watched.find(
		(movie) => movie.imdbID === selectedId
	)?.userRating;

	const {
		Title: title,
		Year: year,
		Poster: poster,
		Runtime: runtime,
		imdbRating,
		Released: released,
		Actors: actors,
		Plot: plot,
		Director: director,
		Genre: genre,
	} = movie;

	// Breaking the Rules of Hooks : DO not call hooks inside conditionals, loops, nested function or after an early return
	/* eslint-disable */
	// if (imdbRating > 8) [isTop, setIsTop] = useState(true);
	// Early return
	// if (imdbRating > 8) return <p>The Greatest!</p>;

	// This can give us the functionality, but we don't have to set a state, instead use a derived state
	// const [isTop, setIsTop] = useState(imdbRating > 8);
	// console.log(isTop);
	// useEffect(() => {
	// 	setIsTop(imdbRating > 8);
	// }, [imdbRating]);

	const isTop = imdbRating > 8;
	// console.log(isTop);

	const [avgRating, setAvgRating] = useState(0);

	function handleAdd() {
		const newWatchedMovie = {
			imdbID: selectedId,
			title,
			year,
			poster,
			imdbRating: Number(imdbRating),
			runtime: Number(runtime.split(" ").at(0)),
			userRating,
			countRatingDecisions: countRef.current,
		};

		onAddWatched(newWatchedMovie);
		onCloseMovie();

		// Using call back to update state
		// setAvgRating(Number(imdbRating));
		// setAvgRating((avgRating) => (avgRating + userRating) / 2);
	}

	//Using the custome hook useKey
	useKey("Escape" || "Backspace", onCloseMovie);

	useEffect(
		function () {
			// Browser API for terminating || Aboring HTTP request
			const controller = new AbortController();

			async function getMovieDetails() {
				try {
					setIsLoading(true);
					const res = await fetch(
						`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`,
						{ signal: controller.signal }
					);

					if (!res.ok)
						throw new Error("There was an error fetching movie data");

					const data = await res.json();
					if (data.Response === "False") throw new Error("Movie not found");

					setMovie(data);
					setError("");
				} catch (err) {
					// console.log(err.message);
					if (err.name !== "AbortError") setError(err.message);
				} finally {
					setIsLoading(false);
				}
			}
			getMovieDetails();
			// setIsLoading(false);

			return function () {
				controller.abort();
			};
		},
		[selectedId]
	);

	useEffect(
		function () {
			if (!title) return;
			document.title = `Movie | ${title}`;

			return function () {
				document.title = "usePopcorn";
			};
		},
		[title]
	);

	return (
		<div className="details">
			{isLoading && <Spinner />}
			{!isLoading && !error && (
				<>
					<header>
						<div className="btn-back" onClick={onCloseMovie}>
							&larr;
						</div>
						<img src={poster} alt={`Poster of ${movie} movie`} />
						<div className="details-overview">
							<h2>{title}</h2>
							<p>
								{released} &bull; {runtime}
							</p>
							<p>{genre}</p>
							<p>
								<span>🌟</span> {imdbRating} IMdb rating
							</p>
						</div>
					</header>

					<section>
						<div className="rating">
							{isWatched ? (
								<div className="rated-message">
									<p>
										You rated this movie {watchedUserRating} <span>🌟</span>{" "}
									</p>
									<button className="btn-rated_back" onClick={onCloseMovie}>
										&larr;
									</button>
								</div>
							) : (
								<>
									<StarRating
										maxRating={10}
										size={25}
										onSetRating={setUserRating}
									/>
									{userRating > 0 && (
										<button className="btn-add" onClick={handleAdd}>
											+Add to list
										</button>
									)}
								</>
							)}
						</div>
						<p>
							<em>{plot}</em>
						</p>
						<p>Starring: {actors}</p>
						<p>Directed by: {director}</p>
						<p>Movie year: {year}</p>
					</section>
				</>
			)}
			{error && <ErrorMessage message={error} />}
		</div>
	);
}

function WatchedSummary({ watched }) {
	const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
	const avgUserRating = average(watched.map((movie) => movie.userRating));
	const avgRuntime = average(watched.map((movie) => movie.runtime));
	return (
		<div className="summary">
			<h2>Movies you watched</h2>
			<div>
				<p>
					<span>#️⃣</span>
					<span>{watched.length} movies</span>
				</p>
				<p>
					<span>⭐️</span>
					<span>{avgImdbRating.toFixed(1)}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{avgUserRating.toFixed(1)}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{avgRuntime.toFixed()} min</span>
				</p>
			</div>
		</div>
	);
}

function WatchedMovieList({ watched, onDeleteWatched }) {
	return (
		<ul className="list">
			{watched.map((movie) => (
				<WatchedMovie
					movie={movie}
					key={movie.imdbID}
					onDeleteWatched={onDeleteWatched}
				/>
			))}
		</ul>
	);
}

function WatchedMovie({ movie, onDeleteWatched }) {
	return (
		<li key={movie.imdbID}>
			<img src={movie.poster} alt={`${movie.title} poster`} />
			<h3>{movie.title}</h3>
			<div>
				<p>
					<span>⭐️</span>
					<span>{movie.imdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{movie.userRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{movie.runtime} min</span>
				</p>

				<button
					className="btn-delete"
					onClick={() => onDeleteWatched(movie.imdbID)}
				>
					X
				</button>
			</div>
		</li>
	);
}
