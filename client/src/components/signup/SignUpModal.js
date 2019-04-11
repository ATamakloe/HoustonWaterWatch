import React, {Component} from 'react';
import SignUpForm from '../signup/signupform/SignUpForm';
import SignUpComplete from '../signup/signupcompleted/SignUpCompleted';
import {checkPhoneNumber, checkAddress} from '../../helpers/helpers'
import './SignUp.css';

class SignUpModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formCompleted: false,
      address:"",
      phoneNumber:"",
      formErrors:{address:[], phoneNumber:[]}
    }
  }

  handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
      if (name === "number") {
        this.setState(prevState => ({
          phoneNumber:value,
          formErrors: {
            ...prevState.formErrors,
            phoneNumber:checkPhoneNumber(value)}
        }));
      } else if (name === "address") {
        this.setState(prevState => ({
          address:value,
          formErrors: {
            ...prevState.formErrors,
            address:checkAddress(value)}
        }))
      }
    }

  setFormCompletion = () => {
    this.setState({formCompleted: true}, () => {this.props.onSubmit(this.state.address, this.state.phoneNumber)})
  }

  render() {

  const isEnabled = this.state.formErrors.address.length === 0 && this.state.formErrors.phoneNumber.length === 0;

  const modalBody = this.state.formCompleted ?
  <SignUpComplete triggerModal={this.props.triggerModal}/> :
  <SignUpForm  handleInputChange={this.handleInputChange} setFormCompletion={this.setFormCompletion} triggerModal={this.props.triggerModal} isEnabled={isEnabled} formErrors={this.state.formErrors}/>;

  return(
    <div className="modal">
      <span onClick={this.props.triggerModal} className="close" title="Close Form" aria-label="Close Form">&times;</span>
      <div className="overlay"></div>
        <form action="#" className="modal-content">
        {modalBody}
      </form>
    </div>
  )
}
}

export default SignUpModal
