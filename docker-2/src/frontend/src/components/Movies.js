import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./Movies.module.css";

function Movies({ id, coverImg, title, year, summary, genres }) {
  return (
    <div className={styles.movie}>
      <Link to={`/movie/${id}`}>
        <img src={coverImg} alt={title} className={styles.movie__img} />
      </Link>
      <div>
        <h2 className={styles.movie__title}>
          <Link to={`/movie/${id}`}>{title}</Link>
        </h2>
        <h3 className={styles.movie__year}>{year}</h3>
        <p>{summary.length > 100 ? `${summary.slice(0, 100)}...` : summary}</p>
        <ul className={styles.movie__genres}>
          {genres.map((g, index) => (
            <li key={index}>{g}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

Movies.propTypes = {
  id: PropTypes.number.isRequired,
  coverImg: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  summary: PropTypes.string.isRequired,
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Movies;
