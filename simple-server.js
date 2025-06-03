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

  // Extraer la ruta sin los parámetros de la consulta (query parameters)
  let filePath = path.join(__dirname, 'dist', req.url.split('?')[0] === '/' ? 'index.html' : req.url.split('?')[0]);
  let ext = path.extname(filePath);

  // Extraer parámetros de la consulta (si los hay)
  let urlParams = new URLSearchParams(req.url.split('?')[1]);

  console.log("Query Parameters:", Object.fromEntries(urlParams));

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
