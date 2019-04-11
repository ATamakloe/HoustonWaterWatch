import React, {Component} from 'react';
import SignUpForm from '../signup/signupform/SignUpForm';
import SignUpComplete from '../signup/signupcompleted/SignUpCompleted';
import './SignUp.css';

class SignUpModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formCompleted: false,
      address:"",
      phoneNumber:""
    }
  }

  handleInputChange = (e) => {
    e.target.name === "number" ? this.setState({phoneNumber:e.target.value}) :
    this.setState({address:e.target.value});
  }

  setFormCompletion = () => {
    this.setState({formCompleted: true}, () => {this.props.onSubmit(this.state.address, this.state.phoneNumber)})
  }

  phoneValidation = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/;
  addressValidation = /[^a-zA-Z,\d\s:]/;
  render() {

    /*
  const isEnabled =
    (this.state.phoneNumber.length > 0 || this.state.phoneNumber.length < 11) &
    (this.phoneValidation.test(this.state.phoneNumber)) &
    (this.state.address.length > 0 || this.addressValidation.test(this.state.address))
    */

  const modalBody = this.state.formCompleted ?
  <SignUpComplete triggerModal={this.props.triggerModal}/> :
  <SignUpForm  handleInputChange={this.handleInputChange} setFormCompletion={this.setFormCompletion} triggerModal={this.props.triggerModal}/>;

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
