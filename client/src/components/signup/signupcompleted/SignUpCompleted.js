import React from 'react';
import '../SignUp.css'


const SignUpComplete = ({triggerModal}) => {
  return (
      <div className="container">
      <h1>You'll recieve a text when a flood is near you</h1>
      <button type="submit" class="signupbtn" onClick={triggerModal}>Thanks!</button>
      </div>

  )
}

export default SignUpComplete;
