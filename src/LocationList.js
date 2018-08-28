import React, { Component } from 'react';

class LocationList extends Component {
  render() {
    return (
      <ul>{this.props.venues.map((v, i) => (
        <li key={i}>{v.venue.name}</li>
      ))}</ul>
    )
  }
}

export default LocationList
