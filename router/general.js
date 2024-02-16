const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", async (req, res) => {
  const user = req.body.user;

  if (!user.username || !user.password) {
    return res.status(300).json({
      message: "Please make sure both username and password are inserted.",
    });
  }

  if (isValid(user.username)) {
    users.push(user);
    return res.status(300).json({ message: "Welcome " + user.username });
  }
  return res.status(300).json({ message: "This username is already taken" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  await new Promise((resolve, reject) => {
    setTimeout(resolve, 1500);
  });
  return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  const selectedBook = books[isbn];
  await new Promise((resolve, reject) => {
    setTimeout(resolve, 1500);
  });
  if (selectedBook) {
    return res.status(200).send(JSON.stringify(selectedBook));
  }

  return res.status(404).json({ message: "This book is not available" });
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;

  const selectedBooks = []; // Array to store books by the requested author

  for (const key in books) {
    if (books.hasOwnProperty(key)) {
      if (books[key].author === author) {
        selectedBooks.push(books[key]);
      }
    }
  }
  await new Promise((resolve, reject) => {
    setTimeout(resolve, 1500);
  });
  if (selectedBooks.length > 0) {
    // If books by the requested author are found, send them as response

    return res.status(200).send(JSON.stringify(selectedBooks));
  }

  // If no books by the requested author are found, send a 404 response
  return res.status(404).json({ message: `No book by ${author} available` });
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;

  const selectedBooks = [];

  for (const key in books) {
    if (books.hasOwnProperty(key)) {
      if (books[key].title === title) {
        selectedBooks.push(books[key]);
      }
    }
  }
  await new Promise((resolve, reject) => {
    setTimeout(resolve, 1500);
  });

  if (selectedBooks.length > 0) {
    return res.status(200).send(JSON.stringify(selectedBooks));
  }

  return res
    .status(404)
    .json({ message: `No book with the title ${title} available` });
});

public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn]?.reviews));
  }
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
