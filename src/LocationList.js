import React, { Component } from 'react';

class LocationList extends Component {
  onListClick = e => {
    const {markers, infoWindow, animateMarker, getAdditionalInfo} = this.props
    const filteredMarker = markers.filter(m => m.title.toLowerCase() === e.target.innerText.toLowerCase())
    animateMarker(filteredMarker[0])
    getAdditionalInfo(filteredMarker[0], infoWindow)
  }

  render() {
    const {filteredVenues} = this.props
    return (
      <div id="locations">
        <ul className="locations-list">{filteredVenues.map((v, i) => (
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
