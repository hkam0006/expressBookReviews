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
  return res.status(200).json({books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]){
    res.status(200).json(books[isbn])
  } else {
    res.status(400).json({message: `Book with ${isbn} does not exist`});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const result = []
  for (const key in books){
    if (books[key].author === author){
      result.push(books[key])
    }
  }
  res.status(200).json({booksByAuthor: result})
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const filteredBooks = [];
  const title = req.params.title;
  for (const key in books){
    if (books[key].title === title){
      filteredBooks.push(books[key])
    }
  }
  return res.status(200).json({booksByTitle: filteredBooks});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
