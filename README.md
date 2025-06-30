# myFlix - Client 

## Description

A React-based application that will allow users to browse detials about their favorite movies, and list their favorites for other users to see. 

## Tech Stack

- **React**
- **React DOM**
- **Parcel**
- **Sass/SCSS**
- **JSX**

## Project Layout

myflix-client/
├── src/
│   ├── index.html          # Main HTML file
│   ├── index.jsx           # Main React component
│   └── index.scss          # Sass styles
├── package.json            # Project dependencies
└── README.md              # Project documentation

## Current Status

This project is in the earliest stages of devlopment, and currently only includes basic React setup

## Planned Views and Features

* **API Integration** with movie_api 

#### Main View
* Show users all movies on application
* Allow users to filter movies with a search function
* Allow users to filter/sort movies with different criteria
* Allow users to select movies in order to view more details about each movie
* Allow users to log out
* Allow users to navigate to profile view

#### Single Movie View
* Returns data (description, genre, director, image, actors) about a single movie to the user
* Allow the user to add the movie to their favorite's list
* Allow users to access different views to view more information (i.e. will link to genre view, director view, and actor views for genre/director/actors from each movie)
* Allow users to share a movie
* Display a list of similar movies

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