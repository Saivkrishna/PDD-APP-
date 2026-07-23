const http = require('http');

http.get('http://localhost:3000/matrix_bg.png', (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Headers:', res.headers);
}).on('error', (err) => {
  console.error('Error fetching file:', err);
});
