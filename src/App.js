import React, { Component } from 'react';
import Title from './Title'
import LocationList from './LocationList'
import GoogleMap from './GoogleMap'

class App extends Component {
  state = {
    locations: [
      {
        title: 'Statue of Liberty',
        lat: 40.6892,
        lng: -74.0445
      },
      {
        title: 'Ellis Island',
        lat: 40.6995,
        lng: -74.0396
      },
      {
        title: 'Governor\'s Island',
        lat: 40.6895,
        lng: -74.0168
      },
      {
        title: 'New York Stock Exchange',
        lat: 40.7067,
        lng: -74.0112
      },
      {
        title: 'Battery Park',
        lat: 40.7033,
        lng: -74.0170
      },
      {
        title: 'The Charging Bull',
        lat: 40.7055,
        lng: -74.0134
      },
      {
        title: 'Federal Hall',
        lat: 40.7074,
        lng: -74.0102
      },
      {
        title: 'One World Trade Center',
        lat: 40.7127,
        lng: -74.0134
      },
      {
        title: '9/11 Memorial',
        lat: 40.7116,
        lng: -74.0133
      }
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
