import React from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import store from '../store/store';
import * as actions from '../store/actions';
import '../resources/properties.css';
import { HOST_NAME, PORT_NUM, BOOKS_URL } from '../url.constants';

const imgStyle = {
    'width': '5em',
    'height': '5em'
}
const divStyle = {
    'maxWidth': '95%',
    'marginTop': '2em',
    'border': '1px black dotted',
    'padding': '2em',
};

export default class SearchBooks extends React.Component {

    storedState = store.getState();
    loggedInUser = "";
    books = [];
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            renderedBooks: [],
            searchClicked: false,
            selectCriteria: 'Title',
            displayModal: false,
            checkedOutbooks: [],
            checkedOutBooksRendered: ''
        }
        this.searchBooks = this.searchBooks.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.checkout = this.checkout.bind(this);
        this.checkoutPopup = this.checkoutPopup.bind(this);
        this.continueCheckout = this.continueCheckout.bind(this);
    }

    componentDidMount() {
        this.storedState = store.getState();
        this.loggedInUser = this.storedState.userLoggedIn;
        this.books = this.storedState.books;
    }

    handleKeyDown(e) {
        if (e.key === 'Enter') {
            this.searchBooks();
        }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    searchBooks() {
        if (this.state.searchTerm === "" || this.state.searchTerm.length < 3) {
            alert('Please enter more than 3 words to search');
            return;
        }
        this.setState({ searchClicked: true });
        let filteredBooks = this.books.filter(element => {
            let selectCriteria = this.state.selectCriteria.toLowerCase();
            return element[selectCriteria]?.toString().toLowerCase().indexOf(this.state.searchTerm) > -1
        });
        let renderedBooks = this.createRowsOfBooks(filteredBooks, true);
        this.setState({
            renderedBooks: renderedBooks
        });
        this.uncheckAllCheckBoxes();
    }

    createRowsOfBooks(books, extraFields) {
        let renderedBooks = [];
        books.forEach((element, index) => {
            let date = new Date(element.publishedDate);
            let categories = element.categories.length > 1 ? element.categories.map(function (val) {
                return val;
            }).join(',') : element.categories;
            let authors = element.authors.length ? element.authors.map(function (val) {
                return val;
            }).join(',') : element.authors;
            let checkedOutBy = element.checkedOutBy.length > 1 ? element.checkedOutBy.map(function (val) {
                return val;
            }).join(',') : element.checkedOutBy;
            renderedBooks.push(
                extraFields ? this.fullTableRow(index, element, date, authors, categories, checkedOutBy)
                    : this.smallTableRow(index, element, authors, categories)
            );
        });
        return renderedBooks;
    }

    fullTableRow(index, element, date, authors, categories, checkedOutBy) {
        return (
            <tr key={index} className={(element.status === "CHECKEDOUT") ? 'line-through' : ''}>
                <td align="center">
                    <input className="form-check-input" style={{ width: '1.25em', height: '1.25em' }}
                        type="checkbox" value={element.id} name="books" disabled={(element.status === "CHECKEDOUT")} />
                </td>
                <td><img src={element.thumbnailUrl} alt={element.title} style={imgStyle} /></td>
                <td>{element.title}</td>
                <td>{element.shortDescription}</td>
                <td>{date.toUTCString()}</td>
                <td>{authors}</td>
                <td>{element.status}</td>
                <td>{categories}</td>
                <td>{element.rack}</td>
                <td>{element.leftQuantity}</td>
                <td>{checkedOutBy}</td>
            </tr>
        );
    }

    smallTableRow(index, element, authors, categories) {
        return (
            <tr key={index}>
                <td>{element.title}</td>
                <td>{authors}</td>
                <td>{categories}</td>
                <td>{element.rack}</td>
            </tr>
        );
    }

    checkout() {
        let checkedOutBooks = document.querySelectorAll('input[name="books"]:checked');
        if (checkedOutBooks.length > 0) {
            this.setState({ displayModal: true });
            let bookIds = [];
            checkedOutBooks.forEach(e => bookIds.push(e.value));
            checkedOutBooks = this.books.filter(element => {
                let valueToReturn = bookIds.includes(element.id) && !element.checkedOutBy.includes(this.loggedInUser);
                if (bookIds.includes(element.id) && element.checkedOutBy.includes(this.loggedInUser)) {
                    alert("You have already checked out " + element.title + ". Cannot check out same books more than once.")
                }
                return valueToReturn;
            });
            if (checkedOutBooks.length > 0) {
                this.setState({
                    checkedOutBooks: checkedOutBooks,
                    checkedOutBooksRendered: this.createRowsOfBooks(checkedOutBooks, false)
                });
            } else {
                this.uncheckAllCheckBoxes();
                this.setState({ displayModal: false });
            }
        } else {
            alert("Please select atleast 1 book to checkout");
        }
    }

    checkoutPopup() {
        return (
            <div className="modal" role="dialog" style={{ display: (this.state.displayModal === false ? 'none' : 'inherit') }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Checkout books</h5>
                        </div>
                        <div className="modal-body">
                            <p className="text-center">Please review and click on continue to proceed</p>
                            <div className="d-flex justify-content">
                                <table className="table table-striped" style={{ 'marginTop': '2em' }}>
                                    <thead>
                                        <tr>
                                            <th scope="col">Title</th>
                                            <th scope="col">Authors</th>
                                            <th scope="col">Categories</th>
                                            <th scope="col">Rack</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.checkedOutBooksRendered ? this.state.checkedOutBooksRendered : <tr><td></td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => this.setState({ displayModal: false })}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={() => this.continueCheckout()}>Continue</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    continueCheckout() {
        this.state.checkedOutBooks.forEach(element => {
            element.leftQuantity -= 1;
            if (element.leftQuantity === 0) {
                element.status = "CHECKEDOUT";
            }
            element.checkedOutBy.push(this.loggedInUser);
            fetch(HOST_NAME + PORT_NUM + BOOKS_URL + '/' + element.id,
                {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'PUT',
                    body: JSON.stringify(element),
                })
                .then(data => data.json())
                .then(response => {
                    alert("Checked out successfully!!");
                    this.setState({ displayModal: false });
                    this.uncheckAllCheckBoxes();
                    this.componentDidMount();
                    this.setState({
                        checkedOutBooks: [],
                        checkedOutBooksRendered: '',
                        searchClicked: false,
                        renderedBooks: [],
                        searchTerm: ''
                    });
                })
                .catch(error => {
                    alert("An error occured. Please check the logs");
                    console.log(console.log);
                });
        });
    }

    uncheckAllCheckBoxes() {
        this.books.forEach(book => {
            this.state.checkedOutBooks?.forEach(checkedOutBook => {
                if (book.id === checkedOutBook.id) {
                    book = checkedOutBook;
                }
            })
        });
        store.dispatch(actions.loadBooks(this.books));
        let checkedOutBooks = document.querySelectorAll('input[name="books"]:checked');
        checkedOutBooks.forEach(element => {
            element.checked = false
        });
    }

    render() {
        return (
            <div className="container bg-light form-inline" style={divStyle}>
                {this.checkoutPopup()}
                <div className="input-group" style={{ 'margin': 'auto' }}>
                    <DropdownButton id="dropdown-basic-button" variant="secondary" title={this.state.selectCriteria}
                        onSelect={(eventKey, event) => this.setState({ selectCriteria: eventKey })}>
                        <Dropdown.Item eventKey="Title">Title</Dropdown.Item>
                        <Dropdown.Item eventKey="Authors">Author</Dropdown.Item>
                        <Dropdown.Item eventKey="Categories">Category</Dropdown.Item>
                    </DropdownButton>
                    <div className="form-outline">
                        <input type="search" value={this.state.searchTerm} name="searchTerm" style={{ 'width': '35em' }} className="form-control"
                            onChange={this.handleChange} onKeyDown={this.handleKeyDown} />
                    </div>
                    <button type="button" className="btn btn-secondary" onClick={() => this.searchBooks()}>
                        <i className="fa fa-search"></i>
                    </button>
                    <button type="button" className="btn btn-success ml-5" onClick={() => this.checkout()}>
                        Checkout <i className="fa fa-shopping-cart"></i>
                    </button>
                </div>
                {this.state.searchClicked ?
                    <table className="table table-striped table-dark" style={{ 'marginTop': '2em' }}>
                        <thead>
                            <tr>
                                <th scope="col">Checkout</th>
                                <th scope="col">Thumbnail</th>
                                <th scope="col">Title</th>
                                <th scope="col">Short Description</th>
                                <th scope="col">Published Date</th>
                                <th scope="col">Authors</th>
                                <th scope="col">Status</th>
                                <th scope="col">Categories</th>
                                <th scope="col">Rack</th>
                                <th scope="col">Quantity Left</th>
                                <th scope="col">Checked Out By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.renderedBooks && this.state.renderedBooks.length > 0 ?
                                    this.state.renderedBooks
                                    :
                                    <tr className="text-center">
                                        <th scope="row" colSpan="11">No books found</th>
                                    </tr>
                            }

                        </tbody>
                    </table> : ''
                }
            </div>
        )
    }
}