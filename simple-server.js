// simple-server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

http.createServer((req, res) => {
  console.log(`Request: ${req.url}`);

  let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url);
  let ext = path.extname(filePath);

  fs.exists(filePath, exists => {
    if (!exists) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Server Error');
        return;
      }

      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
      res.end(content);
    });
  });
}).listen(port, () => {
  console.log(`Server running on port ${port}`);
});
