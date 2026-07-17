// Tiny static server for previewing the demo kit locally (optional —
// the pages also open fine by double-clicking the .html files).
// Usage: node serve.js   ->   http://localhost:4173
const http = require('http'), fs = require('fs'), path = require('path'), zlib = require('zlib');
const root = __dirname, port = process.env.PORT || 4173;
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon', '.json': 'application/json'
};
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(root, path.normalize(p));
  if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
    const type = mime[path.extname(f).toLowerCase()] || 'application/octet-stream';
    const headers = { 'Content-Type': type };
    // gzip text assets like GitHub Pages does (woff2 is already compressed)
    if (/html|css|javascript|json|svg/.test(type) && /gzip/.test(req.headers['accept-encoding'] || '')) {
      headers['Content-Encoding'] = 'gzip';
      d = zlib.gzipSync(d);
    }
    res.writeHead(200, headers);
    res.end(d);
  });
}).on('error', e => {
  if (e.code === 'EADDRINUSE') {
    console.log('Already running at http://localhost:' + port);
    process.exit(0);
  }
  throw e;
}).listen(port, () => console.log('Demo kit running at http://localhost:' + port));
