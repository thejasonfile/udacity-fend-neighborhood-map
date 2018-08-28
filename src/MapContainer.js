import React, { Component } from 'react'
import LocationList from './LocationList'
import Filter from './Filter'
import axios from 'axios'

class MapContainer extends Component {
  state = {
    allVenues: [],
    filteredVenues: [],
    infoWindow: new this.props.google.maps.InfoWindow(),
    markers: [],
    input: '',
    additionalInfo: null
  }

  componentDidMount() {
    this.getAllVenues()
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
          filteredVenues: response.data.response.groups[0].items,
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

  loadMap() {
    if (this.props.google) {
      const {google} = this.props

      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.7218, lng: -73.9998 },
        zoom: 15
      })
    }

    this.addMarkers()
  }

  addMarkers = () => {
    const {google} = this.props
    let {infoWindow, allVenues} = this.state
    const bounds = new google.maps.LatLngBounds()

    allVenues.forEach((v, i) => {
      let {lat, lng} = v.venue.location
      let {name} = v.venue
      const marker = new google.maps.Marker({
        position: {lat, lng},
        map: this.map,
        title: name
      })

      marker.addListener('click', () => {
        this.animateMarker(marker)
        this.getAdditionalInfo(marker, infoWindow)
      })

      this.setState(state => ({
         markers: [...state.markers, marker]
       }))

      bounds.extend(marker.position)
    })

    this.map.fitBounds(bounds)
  }

  onInputChange = e => {
    this.setState({ input: e.target.value })
    this.filterList(e.target.value)
    this.filterMarkers(e.target.value)
  }

  getAdditionalInfo = (marker, infoWindow) => {
    console.log('get additional info')
    const endpoint = "https://api.myjson.com/bins/fo41s"
    axios.get(endpoint)
      .then(response => {
        this.setState({ additionalInfo: response.data.response.headerLocation })
      })
      .then(() => this.createInfoWindow(marker, infoWindow))
  }

  filterList = input => {
    let {allVenues} = this.state
    let filteredVenues = allVenues.filter(venue => venue.venue.name.toLowerCase().includes(input.toLowerCase()))
    this.setState({ filteredVenues })
  }

  filterMarkers = input => {
    let {markers, infoWindow} = this.state
    infoWindow.close()
    this.animateMarker()
    let filteredMarkers = markers.filter(marker => marker.title.toLowerCase().includes(input.toLowerCase()))
    markers.forEach(marker => marker.setVisible(false))
    filteredMarkers.forEach(marker => marker.setVisible(true))
  }

  animateMarker = marker => {
    let {google} = this.props
    let {markers} = this.state
    markers.forEach(marker => marker.setAnimation(null))
    marker ? marker.setAnimation(google.maps.Animation.BOUNCE) : null
  }

  createInfoWindow = (marker, infoWindow) => {
    infoWindow.setContent(`<h3>${marker.title}</h3><h4>${this.state.additionalInfo}</h4>`)
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
              filteredVenues = {this.state.filteredVenues}
              markers = {this.state.markers}
              infoWindow = {this.state.infoWindow}
              createInfoWindow = {this.createInfoWindow}
              animateMarker = {this.animateMarker}
              getAdditionalInfo = {this.getAdditionalInfo}
            />
            <div id="map"></div>
          </section>
      </section>
    )
  }
}

export default MapContainer
