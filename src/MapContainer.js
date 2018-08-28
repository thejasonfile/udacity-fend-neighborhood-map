import React, { Component } from 'react'
import LocationList from './LocationList'
import Filter from './Filter'
import axios from 'axios'

class MapContainer extends Component {
  state = {
    allVenues: [],
    infoWindow: new this.props.google.maps.InfoWindow(),
    markers: [],
    input: ''
  }

  componentDidMount() {
    this.getAllVenues()
  }

  onInputChange = e => {
    this.setState({ input: e.target.value })
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
    const bounds = new google.maps.LatLngBounds()

    allVenues.forEach((v, i) => {
      const marker = new google.maps.Marker({
        position: {lat: v.venue.location.lat, lng: v.venue.location.lng},
        map: this.map,
        title: v.venue.name
      })

      marker.addListener('click', () => {
        this.createInfoWindow(marker, infoWindow)
      })

      this.setState(state => ({
         markers: [...state.markers, marker]
       }))

      bounds.extend(marker.position)
    })

    this.map.fitBounds(bounds)
  }

  createInfoWindow = (marker, infoWindow) => {
    infoWindow.setContent(`<h3>${marker.title}</h3>`)
    infoWindow.open(this.map, marker)
  }

  render() {
    return (
      <section>
          <Filter
            onInputChange = {this.onInputChange}
            input = {this.state.input}
          />
          <section id="info">
            <LocationList
              venues = {this.state.allVenues}
            />
            <div id="map"></div>
          </section>
      </section>
    )
  }
}

export default MapContainer
