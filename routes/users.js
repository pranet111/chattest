// routes/users.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Display the registration form
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle the form submission
router.post('/register', async (req, res) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const user = new User({
      username: req.body.username,
      password: hashedPassword
    });

    // Save the user to the database
    await user.save();

    // Redirect to the login page
    res.redirect('/users/login');
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

// Display the login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle the form submission
router.post('/login', async (req, res) => {
  try {
    // Find the user by their username
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      // If the user is not found, redirect to the login page
      res.redirect('/
