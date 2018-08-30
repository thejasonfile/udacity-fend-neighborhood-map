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
  apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY
})(App);
