import React, { Component } from 'react';

class Filter extends Component {
  render() {
    return (
      <section id="filter">
        <label htmlFor="filter">Filter</label>
        <input
          id="filter"
          type="text"
          onChange={this.props.onInputChange}
          value={this.props.input}
        />
      </section>
    )
  }
}

export default Filter
