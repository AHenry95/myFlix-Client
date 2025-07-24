# myFlix - Client 

## Description

A React-based application that will allow users to browse detials about their favorite movies, and list their favorites for other users to see. 

## Tech Stack

- **React** ^19.1.0
- **React DOM** ^19.1.0
- **parcel/transformer-sass** ^2.15.4
- **PropTypes** ^15.8.1
- **Bootstrap** ^5.3.7
- **React Bootstrap** ^2.10.10
- **React Router** ^7.7.0
  

## Project Layout

```
myflix-client/
├── src/
│   ├── index.html          # Main HTML file
│   ├── index.jsx           # Main React component
│   └── index.scss          # Sass styles
├── package.json            # Project dependencies
└── README.md              # Project documentation
```

## Current Status

This project is in the very early stages of devlopment, and currently includes the following components:

* MainView - this displays a list of MovieCards from using data imported from movie_api. Includes feature to search or sort through movies based on director.genre/release year.
* MovieCard - These components display the titles and poster images of the movies in the databsse, and open the MovieView when clicked. Also allows users to add movies to their favorites list by clicking a heart icon.
* MovieView - This view displays the movie's poster image, title, director, genre, description, a list of actors, and release year, as well as a list of MovieCards for similar movies (movies that have the same genre). Allows users to add the movie to their favorites list.
* SignupView - Allows new users to create accounts and through the movie_api stores their data in the database. New users must provide their name, username, password, email, and may provide data of birth. 
* LoginView - Allows existing users to sign-in to the client and access its features using their username and password.
* ProfileView - Allows users to view their account detials, update/edit account detials, view their favorites list, remove movies from their favorites list, and deactivate their account.
* Navigation Bar: Allows users that are not signed in to toggle betweem Signup and Login views. Allows authenticated users to swtich between the ProfileView and MainView, as well as log out. 

## Planned Views and Features


#### Single Movie View
* Allow users to access different views to view more information (i.e. will link to genre view, director view, and actor views for genre/director/actors from each movie)
* Allow users to share a movie

#### Actors View
* Allows users to view information about actors in the application

#### Genre View
* Returns data about a genre, inclduing genre name and description
* Display example movies

####  Director View
* Returns data about a director (name, bio, year of birth, year of death)
* Displays movies the director has directed

### Potential Features To be Implemented Later

* Users will have the ability to request new movies to be added to the API
* Users will be abke to movies to a "To Watch List" in addition to their favorites list
* More details about each Movie/Director/Actor/Genre to be added to the API 
