import React from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import store from '../store/store';

window.store = store;
const imgStyle = {
    'width': '5em',
    'height': '5em'
}
const divStyle = {
    'width': 'auto',
    'marginTop': '2em',
    'border': '1px black dotted',
    'padding': '2em',
};

export default class SearchBooks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            booksData: [],
            renderedBooks: [],
            searchClicked: false,
            selectCriteria: 'Title'
        }
        this.searchBooks = this.searchBooks.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleKeyDown(e) {
        if (e.key === 'Enter') {
            this.searchBooks();
        }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    static getDerivedStateFromProps(props, state) {
        if (props.booksData && props.booksData.length > 0) {
            if (store.getState().userLoggedIn) {
                return {
                    booksData: props.booksData,
                };
            } else {
                this.props.history.push('/');
                return null;
            }
        }
        return null;
    }

    searchBooks() {
        if(this.state.searchTerm.length && this.state.searchTerm.length<3) {
            alert('Please enter more than 3 words to search');
            return;
        }
        this.setState({
            searchClicked: true
        })
        let filteredBooks = this.state.booksData.filter(element => {
            let selectCriteria = this.state.selectCriteria.toLowerCase();
            return element[selectCriteria]?.toString().toLowerCase().indexOf(this.state.searchTerm) > -1
        }
        );

        let renderedBooks = [];
        filteredBooks.forEach((element, index) => {
            let date = new Date(element.publishedDate);
            element.categories = [element.categories];
            let categories = element.categories.map(function (val) {
                return val;
            }).join(',');
            element.authors = [element.authors];
            let authors = element.authors.map(function (val) {
                return val;
            }).join(',');
            renderedBooks.push(
                <tr key={index}>
                    <td><img src={element.thumbnailUrl} title={element.title} style={imgStyle} /></td>
                    <td>{element.title}</td>
                    <td>{element.shortDescription}</td>
                    <td>{date.toUTCString()}</td>
                    <td>{authors}</td>
                    <td>{element.status}</td>
                    <td>{categories}</td>
                </tr>
            );
        });
        this.setState({
            renderedBooks: renderedBooks
        })
    }

    render() {
        return (
            <div className="container bg-light form-inline" style={divStyle}>
                <div className="input-group" style={{ 'margin': 'auto' }}>
                    <DropdownButton id="dropdown-basic-button" variant="secondary" title={this.state.selectCriteria}
                        onSelect={(eventKey, event) => this.setState({ selectCriteria: eventKey })}>
                        <Dropdown.Item eventKey="Title">Title</Dropdown.Item>
                        <Dropdown.Item eventKey="Authors">Author</Dropdown.Item>
                        <Dropdown.Item eventKey="Categories">Category</Dropdown.Item>
                    </DropdownButton>
                    <div className="form-outline">
                        <input type="search" id="searchTerm" name="searchTerm" style={{ 'width': '35em' }} className="form-control"
                            onChange={this.handleChange} onKeyDown={this.handleKeyDown} />
                    </div>
                    <button type="button" className="btn btn-secondary" onClick={() => this.searchBooks()}>
                        <i className="fa fa-search"></i>
                    </button>
                </div>
                { this.state.searchClicked ?
                    <table className="table table-striped table-dark" style={{ 'margin': '2em' }}>
                        <thead>
                            <tr>
                                <th scope="col">Thumbnail</th>
                                <th scope="col">Title</th>
                                <th scope="col">Short Description</th>
                                <th scope="col">Published Date</th>
                                <th scope="col">Authors</th>
                                <th scope="col">Status</th>
                                <th scope="col">Categories</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.renderedBooks && this.state.renderedBooks.length > 0 ?
                                    this.state.renderedBooks
                                    :
                                    <tr className="text-center">
                                        <th scope="row" colSpan="7">No books found</th>
                                    </tr>
                            }

                        </tbody>
                    </table> : ''
                }
            </div>
        )
    }
}