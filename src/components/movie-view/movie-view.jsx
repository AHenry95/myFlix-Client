export const MovieView = ({ movie, onBackClick }) => {
  return (
    <div>
{/* There is no image in the sample dataset, or the current DB configuration, but that will be implemented at a later date and this code will be uncommented.       
      <div>
        <img src={movie.image} />
      </div> */}
      <div>
        <span>Title: </span>
        <span>{movie.title}</span>
      </div>
      <div>
        <span>Director: </span>
        <span>{movie.director}</span>
      </div>
      <div>
        <span>Genre: </span>
        <span>{movie.genre}</span>
      </div>
      <div>
        <span>Description: </span>
        <span>{movie.description}</span>
      </div>
      <div>
        <span>Actors: </span>
        <ul>
          {movie.actors.length === 0 ? (
            <li>This movie features no actors! How strange!</li>
          ) : (
            movie.actors.map((actor) => <li key={actor.id}>{actor.name}</li>)
          )}
        </ul>
      </div>
      <div>
        <span>Release Year: </span>
        <span>{movie.releaseYear}</span>
      </div>

      <button onClick={onBackClick}>Back</button>
    </div>
  )
}