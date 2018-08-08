import React, { Component } from 'react';
import Title from './Title'
import LocationList from './LocationList'
import GoogleMap from './GoogleMap'

class App extends Component {
  state = {
    locations: [
      "Statue of Liberty",
      "Ellis Island",
      "Governor's Island",
      "New York Stock Exchange",
      "Battery Park",
      "The Charging Bull",
      "Federal Hall",
      "One World Trade Center",
      "9/11 Memorial"
    ]
  }

  render() {
    return (
      <div>
        <Title />
        <LocationList
          locations = {this.state.locations}
        />
        <GoogleMap />
      </div>
    );
  }
}

export default App;
