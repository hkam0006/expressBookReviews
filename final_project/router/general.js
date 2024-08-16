const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const newUser = {
    username: req.body.username,
    password: req.body.password
  }
  users.push(newUser);
  return res.status(200).json({message: `Customer successfully registered. You can now log in.`});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  retrieveBooks()
    .then((books) => res.status(200).json({books: books}))
    .catch((err) => res.status(400).json({message: "Error getting books"}))
});

function retrieveBooks(){
  return new Promise((resolve, reject) => {
    resolve(books)
  })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  retreiveBookWithISBN(isbn)
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(400).json({message: err.message}))
 });

function retreiveBookWithISBN(isbn){
  return new Promise((resolve, reject) => {
    if (!books[isbn]){
      reject({message: `Book with ISBN ${isbn} does not exist in the database`})
    } else {
      resolve(books[isbn])
    }
  })
}
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  retreiveBookWithAuthor(author)
    .then((books) => res.status(200).json({booksByAuthor: books}))
    .catch((error) => res.status(400).json({message: "Server error"}))
});

function retreiveBookWithAuthor(author){
  return new Promise((resolve, reject) => {
    const arr = []
    for (const key in books){
      if (books[key].author === author){
        arr.push(books[key])
      }
    }
    resolve(arr)
  })
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const filteredBooks = [];
  const title = req.params.title;
  retreiveBooksWithTitle(title)
    .then((books) => res.status(200).json({booksByTitle: books}))
    .catch((error) => res.status(400).json({message: "Server Error"}))
});

function retreiveBooksWithTitle(title){
  return new Promise((resolve, reject) => {
    const filteredBooks = [];
    for (const key in books){
      if (books[key].title === title){
        filteredBooks.push(books[key])
      }
    }
    resolve(filteredBooks);
  })
}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
