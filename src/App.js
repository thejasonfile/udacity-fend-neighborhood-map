import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react'
import MapContainer from './MapContainer'
import Title from './Title'
import LocationList from './LocationList'
import Filter from './Filter'

class App extends Component {
  state = {
    input: ''
  }

  onInputChange = e => {
    this.setState({ input: e.target.value })
  }

  render() {
    return (
      <div id="container">
        <Title />
        <main>
          <Filter
            onInputChange = {this.onInputChange}
            input = {this.state.input}
          />
          <LocationList />
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
