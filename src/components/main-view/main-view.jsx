import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
  const [ movies, setMovies ] = useState([
    {
      id: 1,
      title: "Flow",
      description: "Flow tells the story of a cat, along with a group of other animals, who attempt to survive a mysterious and extreme flood in a seemingly post-apocalyptic world. The movie features no dialogue.",
      director: "Gints Zilbalodis",
      genre: "Animation",
      actors: [],
      releaseYear: "2024" 
    },
    {
      id: 2, 
      title: "The Brutalist",
      description: "The Brutalist is the story of fictional Hungarian-Jewish holocaust survivor and renowned architect László Tóth's immigration to the United States, and the personal and professional success and strife he finds there.",
      director: "Brady Corbet",
      genre: "Period Drama",
      actors: ["Adrien Brody"],
      releaseYear: "2024"
    },
    {
      id: 3, 
      title: "Sing Sing",
      description: "Sing Sing portrays the real-life story of John 'Divine G' Whitfield and the Rehabilitation Through the Arts program at the Sing Sing Maximum Security Prison in New York. The film features inmates attempting to stage a play while they grapple with the US Justice System, and their own personal conflicts (both internal and external).",
      director: "Greg Kewdar",
      genre: "Prison Film",
      actors: ["Colman Domingo"],
      releaseYear: "2024",
    }
  ]);

  const [selectedMovie, setSelectedMovie] = useState(null);

  if (selectedMovie) {
    return <MovieView 
      movie={selectedMovie} 
      onBackClick={() => setSelectedMovie(null)}
    />;
  }

  if (movies.length === 0) {
    return <div>The list is empty</div>;
  }

  return (
    <div>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onMovieClick={(newSelectedMovie) => {
            setSelectedMovie(newSelectedMovie);
          }}
        />
      ))}
    </div>
  );
};