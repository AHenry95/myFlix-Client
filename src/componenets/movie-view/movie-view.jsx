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
      <button onClick={onBackClick}>Back</button>
    </div>
  )
}