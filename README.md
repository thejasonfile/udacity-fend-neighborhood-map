# Neighborhood Map Project

## Table of Contents

* [Description](#description)
* [Instructions](#instructions)
* [Contributing](#contributing)

## Description

A neighborhood map pointing out places of interest.  This is project number 7
for [Udacity's](https://www.udacity.com/) Front-End Nanodegree (FEND) Program.

The project was built using [create-react-app](https://github.com/facebook/create-react-app)

I used a few different resources for research and inspiration.  First,
[this great walkthrough by Edoh](https://www.youtube.com/watch?v=9t1xxypdkrE&feature=youtu.be)
on how to use the npm package [Goolge-Maps-React](https://github.com/fullstackreact/google-maps-react) for
integrating the Google Maps API with React.  Also, a lot of research using the
[Google Maps Javascript API Documentation](https://developers.google.com/maps/documentation/javascript/tutorial).

Dependencies include:
  * [React](https://reactjs.org/)
  * [Goolge-Maps-React](https://github.com/fullstackreact/google-maps-react)
  * [Axios](https://www.npmjs.com/package/axios)
  * [Foursquare API](https://developer.foursquare.com/)

## Instructions

Download this repo and install dependencies ```npm i```

Then start a web server with npm ```npm start```

Then open your browser to ```http://localhost:3000```

The map auto-populates 30 locations from the Foursquare API in lower
Manhattan.  You can filter those locations by typing in the input field.  If you
click on either the marker or the name in the list you will see additional
information about the location in a info window.

## Contributing

If you have something to add or change with the code, please submit a Pull
Request and it will be reviewed.
