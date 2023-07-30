import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Movie from "../components/Movie";
import styles from "./Detail.module.css";
import { Link } from "react-router-dom";

function Detail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState();
  const getMovie = async () => {
    const json = await (
      await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
    ).json();
    setMovie(json.data.movie);
    setLoading(false);
  };
  useEffect(() => {
    getMovie();
  }, []);
  return (
    <div className={styles.container}>
      {loading ? (
        <h1 className={styles.loader}>Loading...</h1>
      ) : (
        <div>
          <h1 className={styles.home}>
            <Link to="/">My Movie Web</Link>
          </h1>
          <div className={styles.movie}>
            <Movie
              coverImg={movie.large_cover_image}
              title={movie.title}
              year={movie.year}
              rating={movie.rating}
              runtime={movie.runtime}
              genres={movie.genres}
              description={movie.description_full}
            />
          </div>
        </div>
      )}
    </div>
  );
}
export default Detail;
