import React, { Component } from 'react'

class LocationList extends Component {
  state = {
    input: ''
  }

  onInputChange = e => {
    e.preventDefault()
    this.setState({ input: e.target.value })
  }

  render() {
    return (
      <div>
        <input type="text" onChange={(e) => this.onInputChange(e)} />
        <ul>
          {this.props.locations.map((loc, index) => (
            <li key={index}>{loc}</li>
          ))}
        </ul>
      </div>
    )
  }
}

export default LocationList
