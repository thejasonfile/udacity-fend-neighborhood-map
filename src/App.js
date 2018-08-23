import React, { Component } from 'react';
import axios from 'axios';

/*
 * Instructions on adding and using Google API with React are from here:
 * https://www.youtube.com/watch?v=ywdxLNjhBYw&t=134s
 */

class App extends Component {

  state = {
    map: null,
    allVenues: null,
    filteredVenues: null,
    markers: null,
    infoWindow: null,
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
          allVenues: response.data.response.groups[0].items,
          filteredVenues: response.data.response.groups[0].items
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
      map,
      infoWindow: new window.google.maps.InfoWindow({})
    })

    this.createMarkers(map)
  }

  createMarkers = (map) => {
    let {filteredVenues, allVenues, infoWindow} = this.state
    let venues = filteredVenues || allVenues
    let markers = []
    venues.map(venue => {
      let {lat, lng} = venue.venue.location
      let {name} = venue.venue
      let contentString = `${name}`
      let marker = new window.google.maps.Marker({
        position: {lat, lng},
        title: name,
        map
      });
      markers.push(marker)

      marker.addListener('click', function() {
        infoWindow.setContent(contentString)
        infoWindow.open(map, marker);
      });
    })
    this.setState({ markers })
  }

  onInputChange = (e) => {
    e.preventDefault()
    this.setState({
      input: e.target.value,
    })
    this.filterMarkers(e.target.value)
    this.filterList(e.target.value)
  }

  filterMarkers = (input) => {
    let {markers, map} = this.state
    let index = input.length
    markers.map(marker => {
      let markerTitleSubstring = marker.title.toLowerCase().substring(0, index)
      if (markerTitleSubstring === input) {
        marker.setMap(map)
      } else {
        marker.setMap(null)
      }
    })
  }

  filterList = (input) => {
    let index = input.length
    let {allVenues} = this.state
    let filteredVenues = allVenues.filter(venue => {
      let {name} = venue.venue
      let venueTitleSubstring = name.toLowerCase().substring(0, index)
      return venueTitleSubstring === input
    })
    this.setState({ filteredVenues })
  }

  renderList = () => {
    if(!this.state.filteredVenues) {
      return (
        <div>Loading...</div>
      )
    } else {
      return (
        <ul>
          {this.state.filteredVenues.map((venue, index) => {
            return (
              <li
                key={index}
                onClick={(e) => this.selectMarker(e)}
              >{venue.venue.name}
              </li>
            )
          })}
        </ul>
      )
    }
  }

  selectMarker(e) {
    e.preventDefault()
    let clickedItem = e.target.innerHTML
    let {markers, infoWindow, map} = this.state
    let selectedMarker = markers.filter(marker => marker.title === clickedItem)
    infoWindow.setContent(clickedItem)
    infoWindow.open(map, selectedMarker[0])
  }

  render() {
    return (
      <main>
        <div id="search">
          <input
            type="text"
            onChange={this.onInputChange}
          />
        </div>
        <div id="locations">
            {this.renderList()}
        </div>
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
