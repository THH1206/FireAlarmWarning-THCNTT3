import React from 'react'
import "../App.css"
import { MdClose } from 'react-icons/md'

const Formtable = ({handleSubmit,handleOnChange,handleclose,rest}) => {
  return (
    <div className="addContainer">
            <form onSubmit={handleSubmit}>
            <div className="close-btn" onClick={handleclose}><MdClose/></div>
          
              <label htmlFor="name">Name: </label>
              <input type="name" id="name" name="name" onChange={handleOnChange} value={rest.name}/>

              <label htmlFor="imageURL">Image URL: </label>
              <input type="imageURL" id="imageURL" name="imageURL" onChange={handleOnChange} value={rest.imageURL}/>

              <button className="btn">Submit</button>
            </form>
    </div>
  )
}

export default Formtable