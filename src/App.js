import React, { Component } from 'react';
import axios from 'axios';

/*
 * Instructions on adding and using Google API to React are from here:
 * https://www.youtube.com/watch?v=ywdxLNjhBYw&t=134s
 */

class App extends Component {

  state = {
    map: {},
    venues: [],
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
          venues: response.data.response.groups[0].items
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
    console.log('initMap called')
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7075, lng: -74.01},
      zoom: 16
    })

    this.setState({
      map
    })

    this.createMarkers(this.state.venues, this.state.map)
    this.createButtons(this.state.venues, this.state.map)
    this.renderDetails()
  }

  createMarkers = (venues, map) => {
    let markers = []
    window.infowindow = new window.google.maps.InfoWindow({});

    venues.map(myVenue => {
      let contentString = `${myVenue.venue.name}`

      let marker = new window.google.maps.Marker({
        position: {lat: myVenue.venue.location.lat, lng: myVenue.venue.location.lng},
        map: map,
        title: myVenue.venue.name,
        visible: false
      });

      marker.addListener('click', function() {
        window.infowindow.setContent(contentString)
        window.infowindow.open(map, marker);
      });

      markers.push(marker)

      myVenue.marker = marker

    })
  }

  createButtons = (venues, map) => {
    let buttons = []
    const buttonsDiv = window.document.getElementById('buttons')

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
    let venues = this.state.venues
    if (input.length > 0) {
      let filteredVenues = venues.filter(myVenue => {
        myVenue.venue.name === input
      })
      console.log(filteredVenues)
      this.renderDetails(this.state.map, filteredVenues)
    }
  }

  renderDetails = () => {

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
