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
          <li>Location 1</li>
          <li>Location 2</li>
          <li>Location 3</li>
          <li>Location 4</li>
          <li>Location 5</li>
        </ul>
      </div>
    )
  }
}

export default LocationList
