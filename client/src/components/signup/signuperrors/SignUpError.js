import React from 'react';
import '../SignUp.css';

const SignUpError = ({errors}) => {
  return (
    <p className="errortext">{errors[0]}</p>
  )
}

export default SignUpError;
