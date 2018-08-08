import React, { Component } from 'react';
import Title from './Title'
import LocationList from './LocationList'

class App extends Component {
  render() {
    return (
      <div>
        <Title />
        <LocationList />
      </div>
    );
  }
}

export default App;
