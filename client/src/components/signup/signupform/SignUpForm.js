import React from 'react';
import SignUpError from '../signuperrors/SignUpError'
import '../SignUp.css'


const SignUpForm = ({handleInputChange, setFormCompletion, triggerModal, isEnabled, formErrors}) => {
  return (
      <div className="container">
      <h1>Sign up for high water alerts</h1>
      <br></br>
        <label for="number"><h2>Phone Number</h2></label>
        <input type="tel" placeholder="123-456-7890" name="number" onChange={handleInputChange} required="required"></input>
        {formErrors.phoneNumber.length !== 0 && <SignUpError errors={formErrors.phoneNumber}/>}
      <label for="address"><h2>Address</h2></label>
      <input type="text" placeholder="1337 Main Street, Houston, TX" name="address" onChange={handleInputChange} required="required"></input>
        {formErrors.address.length !== 0 && <SignUpError errors={formErrors.address}/>}
      <p>We wont share or sell your data to anyone for any reason.</p>
      <button type="submit" className="signupbtn"  onClick={setFormCompletion} disabled={!isEnabled}>Get Alerts</button>
      <button type="cancel" className="cancel" onClick={triggerModal}>Cancel</button>
      </div>
  )
}

export default SignUpForm;
