import React, { Component } from 'react';
import Title from './Title'
import LocationList from './LocationList'
import GoogleMap from './GoogleMap'

class App extends Component {
  render() {
    return (
      <div>
        <Title />
        <LocationList />
        <GoogleMap />
      </div>
    );
  }
}

export default App;
