import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react'
import MapContainer from './MapContainer'
import Title from './Title'

class App extends Component {
  render() {
    return (
      <div id="container">
        <Title />
        <main>
          <MapContainer
            google = {this.props.google}
          />
        </main>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAEF0NBGLZqmzeUN1uUta4x9hBJf63Pb5g'
})(App);
