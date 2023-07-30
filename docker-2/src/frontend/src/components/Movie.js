import PropTypes from "prop-types";
import styles from "./Movie.module.css";

function Movie({
  coverImg,
  title,
  year,
  rating,
  runtime,
  genres,
  description,
}) {
  return (
    <div className={styles.movie}>
      <img src={coverImg} alt={title} className={styles.movie__img} />
      <div>
        <h1 className={styles.movie__title}>{title}</h1>
        <h2 className={styles.movie__year}>Year: {year}</h2>
        <h2 className={styles.movie__year}>Rating: {rating}</h2>
        <h2 className={styles.movie__year}>Runtime: {runtime}</h2>
        <p>{description}</p>
        <ul className={styles.movie__genres}>
          Genres:{" "}
          {genres.map((g, i) => (
            <li key={i}>
              {i + 1 === genres.length ? <span>{g}</span> : <span>{g}, </span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

Movie.propTypes = {
  coverImg: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  rating: PropTypes.number.isRequired,
  runtime: PropTypes.number.isRequired,
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
  description: PropTypes.string.isRequired,
};

export default Movie;
