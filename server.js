// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bcrypt = require('bcrypt');

const app = express();

// Set up the database and connect to it
mongoose.connect('mongodb://localhost/chatroom', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Set up the template engine
app.set('view engine', 'pug');
app.set('views', './views');

// Set up body-parser and express-session middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {
    maxAge: 60 * 60 * 1000 // 1 hour
  }
}));

// Set up the routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/chat', require('./routes/chat'));

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
