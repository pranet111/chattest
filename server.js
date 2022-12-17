const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
app.post('/block', (req, res) => {
  const { url } = req.body;
  if (url.includes('hapara')) {
    res.send('URL blocked');
  } else {
    res.send('URL not blocked');
  }
});
app.use((req, res, next) => {
  if (req.url.includes('hapara')) {
    res.send('URL blocked');
  } else {
    next();
  }
});
