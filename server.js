const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost/chatroom', { useNewUrlParser: true, useUnifiedTopology: true });

// Set up the database schema for user accounts
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Set up the database schema for chat messages
const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Set up the user model
const User = mongoose.model('User', userSchema);

// Set up the message model
const Message = mongoose.model('Message', messageSchema);

// Set up express-session to manage user sessions
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Set up Express to serve static files from the "public" directory
app.use(express.static('public'));

// Set up Express to parse incoming request bodies as JSON
app.use(express.json());

// Set up Express to use the Pug template engine
app.set('view engine', 'pug');

// Set up the route for displaying the registration form
app.get('/register', (req, res) => {
  res.render('register');
});

// Set up the route for handling registration form submissions
app.post('/register', async (req, res) => {
  try {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user document with the hashed password
    const user = new User({
      username: req.body.username,
      password: hashedPassword
    });

    // Save the user document to the database
    await user.save();

    // Redirect the user to the login page
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Set up the route for displaying the login form
app.get('/login', (req, res) => {
  res.render('login');
});

// Set up the route for handling login form submissions
app.post('/login', async (req, res) => {
  try {
    // Find the user with the matching username
    const user = await User.findOne({ username: req.body.username });

    // If no user was found, redirect back to the login page
    if (!user) {
      res.redirect('/login');
      return;
    }

    // Compare the provided password
