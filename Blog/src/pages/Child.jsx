import React from 'react'

const Child = (props) => {
  return (
    <div>
      I am child
      <p>{hareem}</p>
      <button  onClick={greet}>press me</button>
      <GrandChild hareem/>
    </div>
  )
}

export default Child
