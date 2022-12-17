const fs = require('fs');

function createAccount(request, response) {
  let body = '';
  request.on('data', chunk => {
    body += chunk.toString(); // convert Buffer to string
  });
  request.on('end', () => {
    const account = JSON.parse(body);
    fs.readFile('./accounts.json', (err, data) => {
      if (err) throw err;
      const accounts = JSON.parse(data);
      accounts.push(account);
      fs.writeFile('./accounts.json', JSON.stringify(accounts), err => {
        if (err) throw err;
        response.end('Account created');
      });
    });
  });
}

module.exports = { createAccount };
