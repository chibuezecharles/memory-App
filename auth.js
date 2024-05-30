// auth.js
function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      res.status(401).send('Authentication required');
      return;
    }
  
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
  
    if (username === 'admin' && password === 'password') {
      next();
    } else {
      res.status(401).send('Authentication required');
    }
  }
  
  module.exports = authenticate;
  