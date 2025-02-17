import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Assuming you're using React Router
import Spinner from "../components/Spinner"; // Ensure you have a Spinner component

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MovieDetailPage = () => {
  const { movieId } = useParams(); 
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true); 
      setError(""); 
      
      try {
        const response = await fetch(`${API_BASE_URL}/movie/${movieId}`, API_OPTIONS);
        
        if (!response.ok) {
          throw new Error("Failed to fetch movie details");
        }

        const data = await response.json();
        setMovie(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (error) return <p className="text-red-500">{error}</p>;

  if (isLoading) return <div className="w-full h-screen flex justify-center items-center"> <Spinner/> </div>;

  if (!movie) return <p>No movie data found.</p>;

  return (
    <div className="">
    
        <div className="relative w-full  h-screen">
        <img className="w-full h-screen hidden md:block bg-contain"
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt={movie.title} />
        </div>
        <div className="pattern absolute top-0 block md:hidden"></div>
        <div className="absolute top-0  md:bg-gray-900/80 mx-auto w-full h-screen">

        <div className="grid grid-cols-1 md:grid-cols-2 wrapper  md:mt-16 "> 
        <div className=" grid-cols-1 mx-auto movie-card w-full md:w-2/3">
        <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'} alt={movie.title} />
        </div>

        <div className="grid-cols-1 text-start ">
        <h3  className="text-gradient text-center md:text-start mt-4 md:mt-0 text-4xl md:text-5xl lg:text-7xl font-bold">{movie.title}</h3>
        <div className="flex flex-col md:flex-row items-center  gap-2 my-4">
        <p className="text-white md:text-orignal  my-1 text-start w-full md:w-fit font-bold">{(movie.release_date).replaceAll('-','/')}</p>
        <div className="flex flex-col md:flex-row gap-2 text-start w-full">
        {
            movie.genres.map((genre)=>
                <li key={genre.name} className="text-white   list-none"><span>•</span> {genre.name}</li>
            )
        }
        </div>
        </div>

        <div className="flex items-center gap-3">
        <div className="rating movie-card w-fit flex gap-1">
        <img src="../star.svg" alt="Star image"  className=" w-6"/>
        <span className="text-3xl text-white font-bold">{movie.vote_average.toFixed(1)}/10</span>
        </div>
        <div className="duration">
                <span className="text-white">Watch Time : {Math.floor(movie.runtime/60).toFixed()}h {" "} {movie.runtime%60}m</span>
        </div>
        </div>

        <h3 className="text-white my-2 text-2xl">{movie.tagline}</h3>

        <p className="text-white text-sm">{movie.overview}</p></div>
      </div>
      
    </div>

    </div>
  );
};

export default MovieDetailPage;
