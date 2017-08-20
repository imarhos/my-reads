import React, { Component } from 'react';
import * as BooksAPI from '../utils/BooksAPI';
import { Link } from 'react-router-dom';
import Book from './book'


class SearchBooks extends Component{
    constructor(props){
        super(props);
        this.state = {
            query : '',
            results: [],
            error: false,
            popmsg: '',
            popmsgdisplay: 'none',
            loader: 'none'
        }
    }

    updateQuery = (query) => {
        this.setState({query: query}, this.performSearch);
    }

    clearQuery = (query) => {
        this.setState({query: ''});
    }

    clearSearchResults = (query) => {
        this.setState({results: []});
    }


    performSearch(){
        if(this.state.query === '' || this.state.query === undefined){
            //Reset
            this.clearSearchResults();
            return;
        }
        this.setState({ loader: "block"});
        BooksAPI.search(this.state.query.trim()).then((books) => {
            if(books.error && books.error === "empty query"){
                // Bad Query, No Results
                this.setState({
                    loader: "none",
                    error: true,
                    results: []
                });
            } else{
                if(this.state.results !== books){
                    this.setState({results: books});
                }
                this.setState({loader:"none", error: false});
            }
        })
        .catch((error) => console.log("error", error));
    }


    render(){
        return(
            <div className="search_books">

              <div className="search-books-bar">

                <Link to="/" className="close-search" >Close</Link>
                <div className="search-books-input-wrapper">
                  <input type="text"
                         placeholder="Search by title or author"
                         value={this.state.query}
                         onChange={(event) => this.updateQuery(event.target.value)}
                    />
                </div>

              </div>

              <div className="search-books-results">

                <img alt="loader " className="middle" style={{width: "175px", display: this.state.loader}} src={require("../img/loader.gif")} />

                <ol className="books-grid">
                    {this.state.results.length > 0 && this.state.results.map((book, index) => (
                        <Book key={book.id}
                              book={book}
                              imgurl={book.imageLinks === undefined ? "" : book.imageLinks.thumbnail}
                              title={book.title}
                              author={book.authors}
                        />
                    ))}
                </ol>
                {this.state.error && <p>No Results...</p>}
              </div>

            </div>
        )
    }
}

export default SearchBooks;
