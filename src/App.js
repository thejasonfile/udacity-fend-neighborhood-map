import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {

  state = {
    map: {},
    venues: [],
    markers: [],
    selectedMarker: {}
  }

  componentDidMount() {
    this.getVenues()
  }

  getVenues = () => {
    const endpoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "FA4SYGNXG02SY2UUAGLCWQNWQ12TYIWOYQJO0XZ2FLRIVAPI",
      client_secret: "3PDXYRFCXNYSMISWXT5Y0YQPPALTI1ZUZLTHMETYNE3YCM3G",
      query: "food",
      near: "Sydney",
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
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 10.5
    })

    var infowindow = new window.google.maps.InfoWindow({});

    this.state.venues.map(myVenue => {
      var contentString = `${myVenue.venue.name}`

      var marker = new window.google.maps.Marker({
        position: {lat: myVenue.venue.location.lat, lng: myVenue.venue.location.lng},
        map: map,
        title: myVenue.venue.name
      });

      markers.push(marker)

      marker.addListener('click', function() {
        infowindow.setContent(contentString)
        infowindow.open(map, marker);
      });
    })
    this.setState({
      markers,
      map
    })
  }

  onButtonClick = (e) => {
    var infowindow = new window.google.maps.InfoWindow({});
    const selectedMarker = this.state.markers.filter(marker => marker.title === e.target.value)
    this.setState({ selectedMarker })
    infowindow.setContent(selectedMarker[0].title)
    infowindow.open(this.state.map, this.state.selectedMarker[0])
  }

  render() {
    return (
      <main>
        <button value="Circa" onClick={this.onButtonClick}>Circa</button>
        <div id="map">

        </div>
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
