import React from 'react';

const Filter = props => {
  return (
    /* Just an text field and label. The value of the text field is controlled
     * by value of props.input and that is changed with the pros.onInputChange
     * function.
     */
    <section id="filter">
      <label htmlFor="filter-input">Filter</label>
      <input
        id="filter-input"
        type="text"
        onChange={props.onInputChange}
        value={props.input}
      />
    </section>
  )
}

export default Filter
