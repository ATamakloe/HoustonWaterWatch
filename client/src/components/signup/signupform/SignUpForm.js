import React from 'react';
import '../SignUp.css'


const SignUpForm = ({handleInputChange, setFormCompletion, triggerModal}) => {
  return (
      <div className="container">
      <h1>Sign up for high water alerts</h1>
      <br></br>
        <label for="number"><h2>Phone Number</h2></label>
        <input type="text" placeholder="123-456-7890" name="number" onChange={handleInputChange} required=""></input>

      <label for="address"><h2>Address</h2></label>
      <input type="text" placeholder="1337 Main Street, Houston, TX" name="address" onChange={handleInputChange} required="required"></input>

      <p>We wont share or sell your data to anyone for any reason.</p>
      <button type="submit" class="signupbtn"  onClick={setFormCompletion}>Sign Up</button>
      <button type="cancel" class="cancel" onClick={triggerModal}>Cancel</button>
      </div>
  )
}

export default SignUpForm;
