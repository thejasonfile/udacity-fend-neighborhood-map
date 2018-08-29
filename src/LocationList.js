import React, { Component } from 'react';

class LocationList extends Component {
  /* When a location is clicked in the list, an array is created that contains
   * just that location object. That object is then passed to animateMarker to
   * animate that location's marker as well as getAdditionalInfo so another API
   * call can be made to get additional information on that location.
   */
  onListClick = e => {
    const {markers, infoWindow, animateMarker, getAdditionalInfo} = this.props
    const filteredMarker = markers.filter(m => m.title.toLowerCase() === e.target.innerText.toLowerCase())
    animateMarker(filteredMarker[0])
    getAdditionalInfo(filteredMarker[0], infoWindow)
  }

  render() {
    /* A list of venues is rendered. This list is based on the filteredVenues
     * value being passed down as props
     */
    const {filteredVenues} = this.props
    return (
      <div id="locations">
        <ul className="locations-list">{filteredVenues.map((v, i) => (
          <li
            key={i}
            onClick={this.onListClick}
            tabIndex="0"
          >
            {v.venue.name}
          </li>
        ))}</ul>
      </div>
    )
  }
}

export default LocationList
