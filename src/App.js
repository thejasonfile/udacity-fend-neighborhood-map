import React from 'react';
import { GoogleApiWrapper } from 'google-maps-react'
import MapContainer from './MapContainer'
import Title from './Title'

const App = props => {
  return (
    <div id="container">
      <Title />
      <main>
        <MapContainer
          google = {props.google}
        />
      </main>
    </div>
  )
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAEF0NBGLZqmzeUN1uUta4x9hBJf63Pb5g'
})(App);
