const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Use express middleware to parse request body
app.use(express.json());

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

// Set up Socket.io to handle real-time chat
io.on('connection', socket => {
  socket.on('join room', roomId => {
    socket.join(roomId);
  });
  socket.on('send message', data => {
    const { roomId, message } = data;
    // Send the message to all users in the room
    io.to(roomId).emit('new message', message);
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
