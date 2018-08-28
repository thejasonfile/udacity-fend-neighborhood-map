import React, { Component } from 'react'
import axios from 'axios'

class MapContainer extends Component {
  state = {
    allVenues: [],
    infoWindow: new this.props.google.maps.InfoWindow(),
    markers: []
  }

  componentDidMount() {
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

    this.addMarkers()
  }

  getAllVenues = () => {
    const appThis = this
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
      .then(() => this.loadMap())
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

  addMarkers = () => {
    const {google} = this.props
    let {infoWindow, allVenues} = this.state
    const bounds = new google.maps.LatLngBounds();
    allVenues.forEach((v, i) => {
      const marker = new google.maps.Marker({
        position: {lat: v.venue.location.lat, lng: v.venue.location.lng},
        map: this.map,
        title: v.venue.name
      })

      marker.addListener('click', () => {this.populateInfoWindow(marker, infoWindow)})

      this.setState(state => ({
         markers: [...state.markers, marker]
       }))

      bounds.extend(marker.position)
    })

    this.map.fitBounds(bounds)
  }

  render() {
    return (
      <div id="map"></div>
    )
  }
}

export default MapContainer
