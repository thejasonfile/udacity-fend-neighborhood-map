import React, { Component } from 'react';

class LocationList extends Component {
  render() {
    return (
      <div id="locations">
        <ul>{this.props.venues.map((v, i) => (
          <li key={i}>{v.venue.name}</li>
        ))}</ul>
      </div>
    )
  }
}

export default LocationList
