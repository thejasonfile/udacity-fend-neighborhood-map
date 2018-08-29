import React from 'react';

const Error = props => {
  return (
    <section id="error">
      <h1>{props.errorMsg}</h1>
    </section>
  )
}

export default Error
