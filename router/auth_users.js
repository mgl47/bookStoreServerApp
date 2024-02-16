const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    username: "MgL",
    password: 123,
  },
];
const isValid = (username) => {
  const newUser = users.filter((user) => user.username == username).length > 0
  if(newUser){
    return false;
  } else {
    return true;
  
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const user = req.body.user;
  const username = user.username;
  const password = user.password;
  if (!username || !password) {
    return res.status(300).json({
      message: "Please make sure both username and password are inserted.",
    });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).json({ message: "Welcome back " + username });
  }

  return res
    .status(300)
    .json({ message: "Newcomer? Please Create an account!" });
});

// Add/Update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  //  console.log(req.session.authorization.username);
  const currentUser = req.session.authorization.username;
  const selectedReviews = books[isbn].reviews;
  let lastKey;
  for (key in selectedReviews) {
    lastKey = Number(key); // Update lastKey with the current key
  }
  const newReviewKey = Number(lastKey + 1);

  for (key in selectedReviews) {
    if (selectedReviews[key].username == currentUser) {
      selectedReviews[key].description = review.description;
      return res.status(200).json({ message: "Your review was update!" });
    }
  }

  selectedReviews[newReviewKey] = {
    username: currentUser,
    description: review.description,
  };

  return res.status(200).json({ message: "Your review was added!" });
});



regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let selectedReviews;
  selectedReviews = books[isbn].reviews;
  let tempReviews = selectedReviews;
  for (key in tempReviews) {
    if (isValid(tempReviews[key].username)) delete tempReviews[key];
    console.log(tempReviews);
  }
  selectedReviews = tempReviews;

  return res
    .status(200)
    .json({ message: "Your review was deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
