import React, { Component } from 'react'
import LocationList from './LocationList'
import Filter from './Filter'
import Error from './Error'
import axios from 'axios'

class MapContainer extends Component {
  state = {
    allVenues: [],
    filteredVenues: [],
    infoWindow: new this.props.google.maps.InfoWindow(),
    markers: [],
    input: '',
    photoURLs: [],
    venuesError: '',
    photosError: ''
  }

  //When the map is rendered an API call is made to fetch all venues.
  componentDidMount() {
    this.getAllVenues()
  }

  getAllVenues = () => {
    //const endpoint = "https://api.myjson.com/bins/fo41s"
    const testEndpoint = "https://api.myjson.com/bins/fo41s"
    // const parameters = {
    //   client_id: "FA4SYGNXG02SY2UUAGLCWQNWQ12TYIWOYQJO0XZ2FLRIVAPI",
    //   client_secret: "3PDXYRFCXNYSMISWXT5Y0YQPPALTI1ZUZLTHMETYNE3YCM3G",
    //   query: "sights",
    //   ll: "40.7033,-74.0170",
    //   v: "20182507"
    // }

    /* this axios get is for testing so we don't go over rate limit on Foursquare */

    axios.get(testEndpoint)
      .then(response => {
        this.setState({
          allVenues: response.data.response.groups[0].items,
          filteredVenues: response.data.response.groups[0].items,
        })
      })
      // If there is an error fetching venue data add an error to the state
      .catch(error => {
        this.setState({ venuesError: error })
      })
      /* A second .then is chained so that we know the data from the API
       * request has been returned before calling loadMap. If there is an error
       * don't load the map. Instead render the error message section.
       */
      .then(() => {
        if(!this.state.venuesError) {
          this.loadMap()
        } else {
          this.renderError()
        }
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

  // Loads the Google map and calls addMarkers
  loadMap() {
    if (!this.state.venuesError && this.props.google) {
      const {google} = this.props

      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.7218, lng: -73.9998 },
        zoom: 15
      })
    } else {
      'there was an error'
    }

    this.addMarkers()
  }

  /* Uses the data in allVenues to create a marker for each venue. A click listener
   * is also added to each venue.  The state is updated as well as the current
   * bounds for the map.
   */
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

  /* This controls the value of the input field and also calls additional functions
   * to apply the filter.
   */
  onInputChange = e => {
    this.setState({ input: e.target.value })
    this.filterList(e.target.value)
    this.filterMarkers(e.target.value)
  }

  /* When a marker or list item is clicked an additional API call is made to fetch
   * additional info.
   */
  getAdditionalInfo = (marker, infoWindow) => {
    const venueID = this.getVenueID(marker)
    this.setState({ photoURLs: [] })
    const testEndpoint = "https://api.myjson.com/bins/dpfdg"
    //const endpoint = `https://api.foursquare.com/v2/venues/${venueID}/photos?`
    const parameters = {
      client_id: "FA4SYGNXG02SY2UUAGLCWQNWQ12TYIWOYQJO0XZ2FLRIVAPI",
      client_secret: "3PDXYRFCXNYSMISWXT5Y0YQPPALTI1ZUZLTHMETYNE3YCM3G",
      v: "20182507"
    }
    //axios.get(endpoint + new URLSearchParams(parameters))
    axios.get(testEndpoint)
      .then(response => {
        let photos = response.data.response.photos.items
        photos.forEach(photo => {
          let photoURL = `${photo.prefix}${photo.height}x${photo.width}${photo.suffix}`
          this.setState(state => ({
             photoURLs: [...state.photoURLs, photoURL]
           }))
        })
      })
      // If there is an error fetching photo data, add error to the state
      .catch(error => {
        this.setState({ photosError: error })
      })
      /* Another .then is chained to the first so that createInfoWindow isn't called
       * before the data is ready.
       */
      .then(() => this.createInfoWindow(marker, infoWindow))
  }

  getVenueID = marker => {
    let {allVenues} = this.state
    let venue = allVenues.filter(venue => venue.venue.name === marker.title)
    let venueID = venue[0].venue.id
    return venueID
  }

  // Filters the location list based on the text in the input field
  filterList = input => {
    let {allVenues} = this.state
    let filteredVenues = allVenues.filter(venue => venue.venue.name.toLowerCase().includes(input.toLowerCase()))
    this.setState({ filteredVenues })
  }

  /* Filters the markers based on the text in the input field. When the input
   * field changes, all markers are set to invisible and then only those markers
   * whose title matches the input field text are then set back to visible.
   */
  filterMarkers = input => {
    let {markers, infoWindow} = this.state
    infoWindow.close()
    this.animateMarker()
    let filteredMarkers = markers.filter(marker => marker.title.toLowerCase().includes(input.toLowerCase()))
    markers.forEach(marker => marker.setVisible(false))
    filteredMarkers.forEach(marker => marker.setVisible(true))
  }

  /* Sets the animation for a marker when it is clicked.  Turns off animation for
   * the rest of them.
   */
  animateMarker = marker => {
    let {google} = this.props
    let {markers} = this.state
    markers.forEach(marker => marker.setAnimation(null))
    marker ? marker.setAnimation(google.maps.Animation.BOUNCE) : null
  }

  // Sets the content for an info window and opens it on the specific marker.
  createInfoWindow = (marker, infoWindow) => {
    // If there is no error, render the photos
    if (!this.state.photosError) {
      let photosString = ''
      this.state.photoURLs.forEach(photoURL => {
        photosString += `<img src=${photoURL} />`
      })
      infoWindow.setContent(`<h3>${marker.title}</h3><h4>${photosString}</h4>`)
      infoWindow.open(this.map, marker)
      // If there is an error, render error message instead.
    } else {
      infoWindow.setContent(`<h3>${marker.title}</h3><h4>Can't get photos. Try agian later.</h4>`)
      infoWindow.open(this.map, marker)
    }
  }

  /* Checks for an existing error. If there is one, then render the Error
   * component with the message
   */
  renderError = () => {
    if (this.state.venuesError) {
      return <Error
        venuesError = {this.state.venuesError}
        errorMsg = 'There was an error loading the map. Please try again.'
      />
    }
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
            {this.renderError()}
            <div id="map"></div>
          </section>
      </section>
    )
  }
}

export default MapContainer
