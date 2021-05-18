import './App.css';
import Header from './header';
import store from './store/store';
import * as actions from './store/actions';
import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

window.store = store;
window.actions = actions;
const divStyle = {
  'width': '50%',
  'marginTop': '20px',
};

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn: false,
      displayModal: true,
      username: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }

  showLoginButton() {
    return (
      <div className="container font-italic bg-light" style={divStyle}>
        <h3>To see information about books you need to login first.</h3>
        <button type="button" className="btn btn-link" onClick={() => this.showHideModal(true)}>Click here to login</button>
      </div>
    );
  }

  loginUser() {
    if (this.state.username && this.state.password) {
      fetch('http://localhost:3001/login/')
        .then(data => data.json())
        .then(response => {
          let filteredResult = response.filter(r =>
            r.username === this.state.username && r.password === this.state.password
          );
          this.setState({ userLoggedIn : (filteredResult && filteredResult.length === 1)});
          store.dispatch(actions.loginUser(true));
        })
    } else {
      alert('Please enter username and password');
    }
  }

  showBody() {
    return (
      <Switch>
        User logged in successfully!
      </Switch>
    );
  }

  showHideModal(value) {
    this.setState({ displayModal: value })
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  showModal(userLoggedIn, displayModal) {
    return (
      <div className="modal" role="dialog" style={{ display: (userLoggedIn === true && displayModal === false ? 'none' : 'contents') }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Login</h5>
            </div>
            <div className="modal-body">
              <p className="text-center">Please login to continue</p>
              <div className="">
                <label className="form-label">User Name:</label>
                <input type="text" className="form-control" name="username" value={this.state.username} maxLength="20"
                  placeholder="Enter your username" onChange={this.handleChange} />
              </div>
              <div className="">
                <label className="form-label">Password:</label>
                <input type="password" name="password" value={this.state.password} maxLength="20" className="form-control"
                  placeholder="Enter your password" onChange={this.handleChange} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => this.showHideModal(false)}>Close</button>
              <button type="button" className="btn btn-primary" onClick={() => this.loginUser()}>Login</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Header userLoggedIn={this.state.userLoggedIn}></Header>
          {
            this.state.userLoggedIn === true ? this.showBody() :
              this.state.displayModal === true ? this.showModal(this.state.userLoggedIn, this.state.displayModal) : this.showLoginButton()
          }
        </div>
      </BrowserRouter>
    );
  }
}


export default App;
