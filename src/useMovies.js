import { useState, useEffect } from "react";

const KEY = "c0baf384";

export function useMovies(query) {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsloading] = useState(false);
	const [error, setError] = useState("");

	useEffect(
		function () {
			// callback?.();

			// Browser API for terminating || Aboring HTTP request
			const controller = new AbortController();

			async function fetchMovies() {
				try {
					setIsloading(true);
					setError("");
					const res = await fetch(
						`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
						{ signal: controller.signal }
					);

					if (!res.ok)
						throw new Error("Something went wrong with fetching movies");

					const data = await res.json();
					if (data.Response === "False") throw new Error("Movie not found");

					setMovies(data.Search);
					setError("");
					// console.log(data.Search);
				} catch (err) {
					if (err.name !== "AbortError") setError(err.message);
				} finally {
					setIsloading(false);
				}
			}

			if (query.length < 3) {
				setMovies([]);
				setError("");
				return;
			}

			fetchMovies();

			return function () {
				controller.abort();
			};
		},
		[query]
	);

	return { movies, isLoading, error };
}
