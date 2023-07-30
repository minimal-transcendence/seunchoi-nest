import { useEffect, useState } from "react";
import Movies from "../components/Movies";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";

function Home() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  // test - api connection
  const [api, setAPI] = useState();
  const getAPI = async () => {
    const json = await (
      await fetch(
        "http://localhost/api"
      )
    ).json();
    setAPI(json);
  };
  /*-----------------------*/
  const getMovies = async () => {
    const json = await (
      await fetch(
        "https://yts.mx/api/v2/list_movies.json?minimum_rating=8.8&sort_by=year"
      )
    ).json();
    setMovies(json.data.movies);
    setLoading(false);
  };
  useEffect(() => {
    getMovies();
    // test - api connection
    getAPI();
    /*-----------------------*/
  }, []);
  return (
    <div className={styles.container}>
      {loading ? (
        <h1 className={styles.loader}>Loading...</h1>
      ) : (
        <div>
          <h1 className={styles.home}>
            <Link to="/">{api.message}</Link>
          </h1>
          <div className={styles.movies}>
            {movies.map((movie) => (
              <Movies
                key={movie.id}
                id={movie.id}
                coverImg={movie.medium_cover_image}
                title={movie.title}
                year={movie.year}
                summary={movie.summary}
                genres={movie.genres}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
