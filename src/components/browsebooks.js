import React, { PureComponent } from 'react';
import store from '../store/store';
import * as actions from '../store/actions';
import '../resources/properties.css';
import { HOST_NAME, PORT_NUM, BOOKS_URL } from '../url.constants';

const divStyle = {
    'maxWidth': '95%',
    'marginTop': '2em',
    'border': '1px black dotted',
    'padding': '2em',
};

const imgStyle = {
    'width': '5em',
    'height': '5em'
}

export default class BrowseBooks extends PureComponent {
    storedState = store.getState();
    loggedInUser = "";
    books = [];
    constructor(props) {
        super(props);
        this.state = {
            booksData: [],
            renderedBooks: [],
            displayModal: false,
            checkedInbooks: [],
            checkedInBooksRendered: ''
        };
        this.checkIn = this.checkIn.bind(this);
        this.checkInPopup = this.checkInPopup.bind(this);
        this.continueCheckIn = this.continueCheckIn.bind(this);
    }

    componentDidMount() {
        this.storedState = store.getState();
        this.loggedInUser = this.storedState.userLoggedIn;
        this.books = this.storedState.books;
        let filteredBooks = this.books.filter(book => book.checkedOutBy.includes(this.loggedInUser));
        let renderedBooks = this.createRowsOfBooks(filteredBooks, true)
        this.setState({ renderedBooks: renderedBooks });
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
            renderedBooks.push(
                extraFields ? this.fullTableRow(index, element, date, authors, categories)
                    : this.smallTableRow(index, element, authors, categories)
            );
        });
        return renderedBooks;
    }

    fullTableRow(index, element, date, authors, categories) {
        return (
            <tr key={index}>
                <td align="center">
                    <input className="form-check-input" style={{ width: '1.25em', height: '1.25em' }}
                        type="checkbox" value={element.id} name="books" />
                </td>
                <td><img src={element.thumbnailUrl} alt={element.title} style={imgStyle} /></td>
                <td>{element.title}</td>
                <td>{element.shortDescription}</td>
                <td>{date.toUTCString()}</td>
                <td>{authors}</td>
                <td>{categories}</td>
                <td>{element.rack}</td>
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

    checkIn() {
        let checkedInBooks = document.querySelectorAll('input[name="books"]:checked');
        if (checkedInBooks.length > 0) {
            this.setState({ displayModal: true });
            let bookIds = [];
            checkedInBooks.forEach(e => bookIds.push(e.value));
            checkedInBooks = this.books.filter(element => bookIds.includes(element.id));
            this.setState({
                checkedInBooks: checkedInBooks,
                checkedInBooksRendered: this.createRowsOfBooks(checkedInBooks, false)
            });
        } else {
            alert("Please select atleast 1 book to checkin");
        }
    }


    checkInPopup() {
        return (
            <div className="modal" role="dialog" style={{ display: (this.state.displayModal === false ? 'none' : 'inherit') }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Checkin books</h5>
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
                                        {this.state.checkedInBooksRendered ? this.state.checkedInBooksRendered : <tr><td></td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => this.setState({ displayModal: false })}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={() => this.continueCheckIn()}>Continue</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    continueCheckIn() {
        this.state.checkedInBooks.forEach(element => {
            element.leftQuantity += 1;
            if (element.leftQuantity !== 0) {
                element.status = "AVAILABLE";
            }
            element.checkedOutBy.splice(element.checkedOutBy.indexOf(this.loggedInUser), 1);
            fetch(HOST_NAME + PORT_NUM + BOOKS_URL + '/' + element.id,
                {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'PUT',
                    body: JSON.stringify(element),
                })
                .then(data => data.json())
                .then(response => {
                    alert("Checked in successfully!!");
                    this.setState({ displayModal: false });
                    this.uncheckAllCheckBoxes();
                    this.componentDidMount();
                })
                .catch(error => {
                    alert("An error occured. Please check the logs");
                    console.log(console.log);
                })
        });
    }

    uncheckAllCheckBoxes() {
        this.books.forEach(book => {
            this.state.checkedInBooks?.forEach(checkedInBook => {
                if (book.id === checkedInBook.id) {
                    book = checkedInBook;
                }
            })
        });
        store.dispatch(actions.loadBooks(this.books));
        let checkedInBooks = document.querySelectorAll('input[name="books"]:checked');
        checkedInBooks.forEach(element => {
            element.checked = false
        });
    }

    render() {
        return (
            <div className="container bg-light form-inline" style={divStyle}>
                {this.checkInPopup()}
                <h3>Hi <span className="doubleUnderlined">{this.loggedInUser}</span>. Here are books checked out by you</h3>
                <br /><br /><br />
                <button type="button" className="btn btn-success ml-5" onClick={() => this.checkIn()}>
                    Checkin <i className="fa fa-check"></i>
                </button>
                <table className="table table-striped table-dark">
                    <thead>
                        <tr>
                            <th scope="col">Check in</th>
                            <th scope="col">Thumbnail</th>
                            <th scope="col">Title</th>
                            <th scope="col">Short Description</th>
                            <th scope="col">Published Date</th>
                            <th scope="col">Authors</th>
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
                </table>
            </div>
        )
    }
}