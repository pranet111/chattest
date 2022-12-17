const express = require('express');
const app = express();
const server = require('http').createServer(app);

// Use express middleware to parse request body and set up EJS templating
app.use(express.json());
app.set('view engine', 'ejs');

// Set up a route to handle user registration
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  // Store the new user in the database
  User.create({ username, password }).then(() => {
    res.send('User registered successfully');
  }).catch(err => {
    res.status(500).send(err.message);
  });
});

// Set up a route to handle user login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Check the username and password against the database
  User.findOne({ username, password }).then(user => {
    if (!user) {
      res.status(401).send('Invalid username or password');
    } else {
      // Generate a JWT token for the user
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.send({ token });
    }
  }).catch(err => {
    res.status(500).send(err.message);
  });
});

// Set up a route to render the chat page
app.get('/chat', (req, res) => {
  // Authenticate the user and get their messages
  const user = authenticate(req);
  if (!user) {
    res.redirect('/login');
  } else {
    Message.find({ user: user._id }).then(messages => {
      res.render('chat', { messages });
    }).catch(err => {
      res.status(500).send(err.message);
    });
  }
});

// Set up a route to handle AJAX requests to send messages
app.post('/send-message', (req, res) => {
  // Authenticate the user and save the message to the database
  const user = authenticate(req);
  if (!user) {
    res.status(401).send('You must be logged in to send a message');
  } else {
    const { message } = req.body;
    Message.create({ user: user._id, message }).then(() => {
      res.send('Message sent successfully');
    }).catch(err => {
      res.status(500).send(err.message);
    });
  }
});

// Start the server
server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
