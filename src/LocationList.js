import React, { Component } from 'react';

class LocationList extends Component {
  onListClick = e => {
    const {markers, infoWindow} = this.props
    const filteredMarker = markers.filter(m => m.title.toLowerCase() === e.target.innerText.toLowerCase())
    this.props.createInfoWindow(filteredMarker[0], infoWindow)
  }

  render() {
    return (
      <div id="locations">
        <ul className="locations-list">{this.props.venues.map((v, i) => (
          <li
            key={i}
            onClick={this.onListClick}
          >
            {v.venue.name}
          </li>
        ))}</ul>
      </div>
    )
  }
}

export default LocationList
