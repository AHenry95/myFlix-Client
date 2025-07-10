# myFlix - Client 

## Description

A React-based application that will allow users to browse detials about their favorite movies, and list their favorites for other users to see. 

## Tech Stack

- **React** ^19.1.0
- **React DOM** ^19.1.0
- **parcel/transformer-sass** ^2.15.4

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

* MainView - this displays a list of MovieCards from using data imported from movie_api
* MovieCard - These components display the titles of the movies in the databse, and open the MovieView when clicked
* MovieView - This view displays the movie's title, director, genre, description, a list of actors, and release year, as well as a list of MovieCards for similar movies (movies that have the same genre).

## Planned Views and Features

* **API Integration** with movie_api 

#### Main View
* Allow users to filter movies with a search function
* Allow users to filter/sort movies with different criteria
* Allow users to log out
* Allow users to navigate to profile view

#### Single Movie View
* Allow the user to add the movie to their favorite's list
* Allow users to access different views to view more information (i.e. will link to genre view, director view, and actor views for genre/director/actors from each movie)
* Allow users to share a movie

#### Login View
* Allow users to login using their username and password

#### Signup View
* Allow users to register for a profile (users will provide their name, username, password, email, date of birth)

#### Profile View
* Displays user registration details
* Allows user to update their profile details(username, password, nmae, email, date of birth)
* Displays the user's favorite movies
* Allows users to remove a movie from their favorites list
* Allow users to deregister/delete their profile 

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
