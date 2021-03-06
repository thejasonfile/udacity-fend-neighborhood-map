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
    const endpoint = "https://api.foursquare.com/v2/venues/explore?"
    axios.get(endpoint, {
      params: {
        client_id: process.env.REACT_APP_FS_CLIENT,
        client_secret: process.env.REACT_APP_FS_SECRET,
        query: "sights",
        ll: "40.7033,-74.0170",
        v: "20182507"
      }
    })
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
  }

  // Loads the Google map and calls addMarkers
  loadMap() {
    const mapContainerThis = this
    const {google} = this.props
    const {venuesError, infoWindow} = this.state
    if (!venuesError && google) {

      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.7218, lng: -73.9998 },
        zoom: 15
      })
    } else {
      'there was an error'
    }

    /* Add listener for clicking on map that closes infoWindow and stops marker
     * animations.
     */
    this.map.addListener('click', () => {
      const {markers} = mapContainerThis.state
      markers.forEach(marker => marker.setAnimation(null))
      infoWindow.close()
    })

    /* Add listener to add title to iFrame. Needed to pass Lighthouse a11y audit.
     * Code example from here:
     * https://stackoverflow.com/questions/49012240/google-maps-js-iframe-title
     */
     this.map.addListener('idle', () => {
       document.getElementsByTagName('iframe')[0].title = "Google Maps";
     })

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
    const endpoint = `https://api.foursquare.com/v2/venues/${venueID}/photos?`
    axios.get(endpoint, {
      params: {
        client_id: process.env.REACT_APP_FS_CLIENT,
        client_secret: process.env.REACT_APP_FS_SECRET,
        v: "20182507"
      }
    })
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
        photosString += `<img src="${photoURL}" alt="${marker.title}" />`
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
