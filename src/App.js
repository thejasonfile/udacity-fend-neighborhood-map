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
    markers: [],
    selectedMarker: {},
    input: ''
  }

  componentDidMount() {
    this.getVenues()
  }

  getVenues = () => {
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
    let markers = []
    let buttons = []
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.7075, lng: -74.01},
      zoom: 16
    })

    window.infowindow = new window.google.maps.InfoWindow({});

    this.state.venues.map(myVenue => {
      var contentString = `${myVenue.venue.name}`

      var marker = new window.google.maps.Marker({
        position: {lat: myVenue.venue.location.lat, lng: myVenue.venue.location.lng},
        map: map,
        title: myVenue.venue.name
      });

      markers.push(marker)

      marker.addListener('click', function() {
        window.infowindow.setContent(contentString)
        window.infowindow.open(map, marker);
      });

      var button = window.document.createElement('button')
      button.innerHTML = myVenue.venue.name
      buttons.push(button)


      button.addEventListener('click', function() {
        window.infowindow.setContent(contentString)
        window.infowindow.open(map, marker);
      })
    })

    this.setState({
      markers,
      map
    })

    buttons.forEach(button => {
      var buttonsDiv = window.document.getElementById('buttons')
      buttonsDiv.appendChild(button)
    })
  }

  onInputChange = (e) => {
    e.preventDefault()
    this.setState({
      input: e.target.value
    })
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
