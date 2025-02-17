import { useState,useEffect } from "react"
import Search from "./components/Search"
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovie, updateSearchCount } from "./appwrite";
import { Link } from "react-router-dom";


const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method :"GET",
  headers:{
    accept : 'application/json',
    Authorization:`Bearer ${API_KEY}`
  }
}

const App = () => {

  const[searchSTerm,setSearchTerm] = useState('')
  const[errorMessage,setErrorMessage] = useState('');
  const [moviesList,setMoviesList] = useState([])
  const[trendingMovies,setTrendingMovies] = useState([]); 
  const[isLoading,setIsLoading] = useState (false);
  const[debounceSearchTerm,setDebounceSearchTerm] = useState('');
  useDebounce(()=>setDebounceSearchTerm(searchSTerm),1000,[searchSTerm])

  const fetchMovies = async (query = '') => {
    setIsLoading(true)
    setErrorMessage('');
    try{
        const endPoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
        const response = await fetch(endPoint,API_OPTIONS);
        console.log(response)
        if(!response.ok){
          throw new Error("Failed to fetch movies")
        }
        const data = await response.json();
        if(data.Response === 'False'){
          setErrorMessage(data.Error || "Failed to fetch movies")
          setMoviesList([])
          return
        }
        console.log(data.results)
        setMoviesList(data.results || []);
        if(query && data.results.length > 0){
          await updateSearchCount(query,data.results[0]);
        }
        
    }catch(error){
      console.log(`Error fetching movies : ${error}`)
      setErrorMessage("Error fetching moives. Please try again later.")
    }
    finally{
      setIsLoading(false);
    }
  }

  const loadTrendingMovies  = async ()=>{
    try{
        const movies = await getTrendingMovie();
        setTrendingMovies(movies);
    }
    catch(error){
      console.error(`Error fetching trending movies: ${error}`)
    }
  }


  

  useEffect(()=>{
    fetchMovies(debounceSearchTerm);
  },[debounceSearchTerm])

  useEffect(()=>{
    loadTrendingMovies();
  },[])

  return (
   <main>
    <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner png" />
          <h1>Find <span className="text-gradient">Movies</span> You&apos;ll Enjoy Without the Hassle</h1>
          <Search searchSTerm={searchSTerm} setSearchTerm={setSearchTerm}/>
        </header>
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie,index)=>(
                <li key={movie.$id}>
                  <p>{index+1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        ) }
        <section className="all-movies">
          <h2 >All Movies</h2>
          {
            isLoading ? ( <Spinner/> ) : errorMessage ? ( <p
            className="text-red-500">{errorMessage}</p> ) : ( <ul>

                {moviesList.map((movie) => (
                
                  <Link to={`/movie/${movie.id}`} key={movie.id}>
                    <MovieCard movie={movie}/>
                  </Link>
                ))}

            </ul> )
          }

        </section>
      </div> 
   </main>
  )
}

export default App
