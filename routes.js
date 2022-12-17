const accounts = require('./accounts');

function handleRequest(request, response) {
  const url = request.url;
  const method = request.method;

  if (url === '/signup' && method === 'POST') {
    accounts.createAccount(request, response);
  } else if (url === '/login' && method === 'POST') {
    accounts.authenticate(request, response);
  } else {
    // Handle other routes or methods as needed
  }
}

module.exports = { handleRequest };
