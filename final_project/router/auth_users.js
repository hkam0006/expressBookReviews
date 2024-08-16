const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const filteredUsers = users.filter((user) => user.username === username && user.password === password);
  return filteredUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password){
    return res.status(404).json({message: "Error logging in"});
  }
  if (!authenticatedUser(username, password)){
    return res.status(208).json({message: "Invalid login. Check username and password"});
  }

  let accessToken = jwt.sign({
    data:password
  }, 'access', {expiresIn: 60*60});

  req.session.authorisation = {
    accessToken, 
    username
  }
  return res.status(200).json({message: "User successfully logged in"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  if (!books[isbn]){
    return res.status(404).json({message: `Could not find book with ISBN: ${isbn}`});
  }
  books[isbn].reviews[req.session.authorisation.username] = review;
  return res.status(200).json({message: `Review for the book with ISBN ${isbn} has been added/updated`});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorisation.username;
  if(!books[isbn]){
    return res.status(404).json({message: `Book with ISBN: ${isbn} does not exist`})
  }
  if (!books[isbn].reviews[username]){
    return res.status(404).json({message: `User ${username} does not have a review on book with ISBN: ${isbn}`})
  }
  delete books[isbn].reviews[username];
  return res.status(200).json({message: `Review for the ISBN: ${isbn} posted by the user ${username} has been deleted.`})
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
