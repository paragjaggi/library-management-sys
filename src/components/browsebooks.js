import React, { PureComponent } from 'react';
import store from '../store/store';

window.store = store;
const divStyle = {
    'width': 'auto',
    'marginTop': '2em',
};

const imgStyle = {
    'width': '5em',
    'height': '5em'
}

export default class BrowseBooks extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            booksData: [],
            renderedBooks: []
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.booksData && props.booksData.length > 0) {
            if (store.getState().userLoggedIn) {
                let renderedBooks = [];
                props.booksData.forEach((element, index) => {
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
                return {
                    booksData: props.booksData,
                    renderedBooks: renderedBooks
                };
            } else {
                this.props.history.push('/');
                return null;
            }
        }
        return null;
    }

    render() {
        return (
            <div className="container font-italic" style={divStyle}>
                <table className="table table-striped table-dark">
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
                            this.state.booksData && this.state.booksData.length > 0 ?
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