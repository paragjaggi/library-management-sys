import React from 'react';
import { NavLink } from 'react-router-dom';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userLoggedIn: props.userLoggedIn
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (state.userLoggedIn !== props.userLoggedIn) {
            return {
                userLoggedIn: props.userLoggedIn,
            };
        } else {
            return {
                userLoggedIn: state.userLoggedIn,
            };
        }
    }

    render() {
        return (
            <nav className="navbar navbar-expand-sm nav-pills bg-dark">
                <ul className="nav w-100 mr-auto">
                    <li className="nav-item">
                        <NavLink to="/home" className="nav-link">Home</NavLink>
                    </li>
                    {
                        this.state.userLoggedIn === true ?
                            <li className="nav-item">
                                <NavLink to="/search" className="nav-link">Search Books</NavLink>
                            </li>
                            :
                            <li className="nav-item">
                                <NavLink to="/register" className="nav-link">Register</NavLink>
                            </li>
                    }

                </ul>
                {/* <form className="form-inline my-2 my-lg-0">
                    <input className="form-control mr-sm-2" type="text" placeholder="Search" />
                    <button className="btn btn-success my-2 my-sm-0" type="button">Search</button>
                </form> */}
            </nav>
        );
    }
}

export default Header;
