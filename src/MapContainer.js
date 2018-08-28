import React, { Component } from 'react'

class MapContainer extends Component {
  componentDidMount() {
    this.loadMap()
  }

  loadMap() {
    if (this.props.google) {
      const {google} = this.props

      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.7218, lng: -73.9998 },
        zoom: 14
      })
    }
  }

  render() {
    return (
      <div id="map"></div>
    )
  }
}

export default MapContainer
