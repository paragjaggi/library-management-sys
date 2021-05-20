import './App.css';
import Header from './header';
import store from './store/store';
import * as actions from './store/actions';
import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { HOST_NAME, PORT_NUM, LOGIN_URL, BOOKS_URL } from './url.constants';
import BrowseBooks from './components/browsebooks';
import SearchBooks from './components/searchbooks';

window.store = store;
window.actions = actions;
const divStyle = {
  'width': '50%',
  'marginTop': '2em',
};

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn: "",
      displayModal: true,
      username: '',
      password: '',
      booksData: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.fetchBooks = this.fetchBooks.bind(this);
  }

  componentDidMount() {
    this.setState({ userLoggedIn: store.getState().userLoggedIn });
    if (this.state.userLoggedIn === "") {
      this.props.history.push('/');
    } else {
      this.props.history.push('/home');
    }
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
      fetch(HOST_NAME + PORT_NUM + LOGIN_URL)
        .then(data => data.json())
        .then(response => {
          let filteredResult = response.filter(r =>
            r.username === this.state.username && r.password === this.state.password
          );
          this.setState({ userLoggedIn: (filteredResult && filteredResult.length === 1) ? this.state.username : "" });
          if (this.state.userLoggedIn === "") {
            alert('Wrong username/password combination');
            this.setState({
              username: '',
              password: ''
            });
            this.props.history.push('/');
          } else {
            store.dispatch(actions.loginUser(this.state.userLoggedIn));
            this.fetchBooks(true);
          }
        })
    } else {
      alert('Please enter username and password');
    }
  }

  fetchBooks(navigatToHome) {
    fetch(HOST_NAME + PORT_NUM + BOOKS_URL)
      .then(data => data.json())
      .then(response => {
        if (response && response.length > 0) {
          this.setState({
            booksData: response
          });
          store.dispatch(actions.loadBooks(response));
        }
        if (navigatToHome) this.props.history.push('/home');
      });
  }

  showBody() {
    return (
      <Switch>
        <Route exact path="/home" render={() => (
          <BrowseBooks booksData={this.state.booksData} />
        )} />
        <Route exact path="/search" render={() => (
          <SearchBooks booksData={this.state.booksData} />
        )} />
      </Switch>
    );
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.loginUser();
    }
  }

  showHideModal(value) {
    this.setState({ displayModal: value })
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  showModal(userLoggedIn, displayModal) {
    return (
      <div className="modal" role="dialog" style={{
        display: (userLoggedIn !== "" && displayModal === false ? 'none' : 'inherit'),
        'top': '5em'
      }}>
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
                  placeholder="Enter your password" onChange={this.handleChange} onKeyDown={this.handleKeyDown} />
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
      <div className="App">
        <Header userLoggedIn={this.state.userLoggedIn}></Header>
        {
          this.state.userLoggedIn !== "" ? this.showBody() :
            this.state.displayModal === true ? this.showModal(this.state.userLoggedIn, this.state.displayModal) : this.showLoginButton()
        }
      </div>
    );
  }
}


export default withRouter(App);
