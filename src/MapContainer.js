import React, { Component } from 'react'
import axios from 'axios'

class MapContainer extends Component {
  state = {
    allVenues: []
  }

  componentDidMount() {
    this.loadMap()
    this.getAllVenues()
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

  getAllVenues = () => {
    const endpoint = "https://api.myjson.com/bins/fo41s"
    // const parameters = {
    //   client_id: "FA4SYGNXG02SY2UUAGLCWQNWQ12TYIWOYQJO0XZ2FLRIVAPI",
    //   client_secret: "3PDXYRFCXNYSMISWXT5Y0YQPPALTI1ZUZLTHMETYNE3YCM3G",
    //   query: "sights",
    //   ll: "40.7033,-74.0170",
    //   v: "20182507"
    // }

    /* this axios get is for testing so we don't go over rate limit on Foursquare */

    axios.get(endpoint)
      .then(response => {
        this.setState({
          allVenues: response.data.response.groups[0].items,
        })
      })

    // axios.get(endpoint + new URLSearchParams(parameters))
    //   .then(response => {
    //     this.setState({
    //       allVenues: response.data.response.groups[0].items,
    //       filteredVenues: response.data.response.groups[0].items
    //     }, this.renderMap())
    //   })
    //   .catch(error => {
    //     console.log('ERROR! ' + error)
    //   })
  }

  render() {
    return (
      <div id="map"></div>
    )
  }
}

export default MapContainer
