import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react'
import MapContainer from './MapContainer'

class App extends Component {
  render() {
    return (
      <div>
        <MapContainer
          google={ this.props.google }
        />
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAEF0NBGLZqmzeUN1uUta4x9hBJf63Pb5g'
})(App);
