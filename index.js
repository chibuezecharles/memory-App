// index.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const authenticate = require('./auth');

const PORT = 3000;
const MEMORIES_FILE = path.join(__dirname, 'memories.json');

const server = http.createServer((req, res) => {
  // Authentication Middleware
  authenticate(req, res, () => {
    if (req.method === 'GET' && req.url === '/memories') {
      // Handle viewing memories
      fs.readFile(MEMORIES_FILE, 'utf8', (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end('Internal Server Error');
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
      });
    } else if (req.method === 'POST' && req.url === '/memories') {
      // Handle creating a new memory
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const memory = JSON.parse(body);
        fs.readFile(MEMORIES_FILE, 'utf8', (err, data) => {
          if (err) {
            res.statusCode = 500;
            res.end('Internal Server Error');
            return;
          }
          const memories = JSON.parse(data);
          memory.id = memories.length ? memories[memories.length - 1].id + 1 : 1;
          memories.push(memory);
          fs.writeFile(MEMORIES_FILE, JSON.stringify(memories, null, 2), err => {
            if (err) {
              res.statusCode = 500;
              res.end('Internal Server Error');
              return;
            }
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(memory));
          });
        });
      });
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
