// health.js (CommonJS)
const http = require('http');

const options = { hostname: 'localhost', port: 3000, path: '/', method: 'GET', timeout: 5000 };

const req = http.request(options, res => {
  const code = res.statusCode;
  console.log(`StatusCode: ${code} - [${code === 200 ? 'OK' : 'FAIL'}]`);
  process.exit(code === 200 ? 0 : 1);
});

req.on('error', err => { console.error(err.message); process.exit(1); });
req.on('timeout', () => { console.error('Timeout'); req.destroy(); process.exit(1); });
req.end();

