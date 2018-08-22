import React, { Component } from 'react';
import axios from 'axios';

/*
 * Instructions on adding and using Google API to React are from here:
 * https://www.youtube.com/watch?v=ywdxLNjhBYw&t=134s
 */

class App extends Component {

  state = {
    map: {},
    allVenues: [],
    filteredVenues: [],
    selectedMarker: {},
    input: '',
  }

  componentDidMount() {
    this.getAllVenues()
  }

  getAllVenues = () => {
    const endpoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "FA4SYGNXG02SY2UUAGLCWQNWQ12TYIWOYQJO0XZ2FLRIVAPI",
      client_secret: "3PDXYRFCXNYSMISWXT5Y0YQPPALTI1ZUZLTHMETYNE3YCM3G",
      query: "sights",
      ll: "40.7033,-74.0170",
      v: "20182507"
    }

    axios.get(endpoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          allVenues: response.data.response.groups[0].items
        }, this.renderMap())
      })
      .catch(error => {
        console.log('ERROR! ' + error)
      })

  }

  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAEF0NBGLZqmzeUN1uUta4x9hBJf63Pb5g&callback=initMap")
    window.initMap = this.initMap
  }

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7075, lng: -74.01},
      zoom: 16
    })

    this.setState({
      map
    })

    this.createMarkers(this.state.allVenues)
    this.createButtons(this.state.allVenues)
  }

  createMarkers = (venues) => {
    let map = this.state.map
    let markers = []
    window.infowindow = new window.google.maps.InfoWindow({});

    venues.map(myVenue => {
      let contentString = `${myVenue.venue.name}`

      let marker = new window.google.maps.Marker({
        position: {lat: myVenue.venue.location.lat, lng: myVenue.venue.location.lng},
        title: myVenue.venue.name,
        visible: true
      });

      marker.addListener('click', function() {
        window.infowindow.setContent(contentString)
        window.infowindow.open(map, marker);
      });

      markers.push(marker)

      myVenue.marker = marker
    })
    this.showMarkers()
  }

  createButtons = (venues, map) => {
    let buttons = []
    const buttonsDiv = window.document.getElementById('buttons')
    debugger
    venues.map(myVenue => {
      let contentString = `${myVenue.venue.name}`
      let button = window.document.createElement('button')
      let marker = myVenue.marker
      button.innerHTML = myVenue.venue.name
      buttons.push(button)

      button.addEventListener('click', function() {
        window.infowindow.setContent(contentString)
        window.infowindow.open(map, marker);
      })

      myVenue.button = button
    })
  }

  onInputChange = (e) => {
    e.preventDefault()
    this.setState({
      input: e.target.value
    })
    this.filterVenues(e.target.value)
  }

  filterVenues = (input=this.state.input) => {
    let index = input.length
    let venues = this.state.allVenues
    let filteredVenues = venues.filter(venue => {
      let venueSub = venue.venue.name.toLowerCase().substring(0, index)
      return input.toLowerCase() === venueSub
    })
    this.setState({ filteredVenues })
  }

  showMarkers = () => {
    let venues = this.state.filteredVenues || this.state.allVenues
    let venuesWithMarkers = venues.map(venue => venue.marker.setMap(this.state.map))
    this.setState({ allVenues: venuesWithMarkers })
  }

  render() {
    return (
      <main>
        <div id="search">
          <input type="text" value={this.state.input} onChange={this.onInputChange} />
        </div>
        <div id="buttons"></div>
        <div id="map"></div>
      </main>
    );
  }
}

function loadScript(url) {
  var index = window.document.getElementsByTagName('script')[0]
  var script = window.document.createElement('script')
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}

export default App;
