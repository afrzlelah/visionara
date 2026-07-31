import http from 'http';
import httpProxy from 'http-proxy';

// Create a proxy server with WebSocket support enabled
const proxy = httpProxy.createProxyServer({ ws: true });

// Error handling to prevent the script from crashing if a target is down
proxy.on('error', (err, req, res) => {
    console.error('[Proxy Error]', err.message);
    if (res && res.writeHead) {
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Bad Gateway');
    }
});

// Create the main HTTP server
const server = http.createServer((req, res) => {
    // If the request is for Reverb (starts with /app or /apps), proxy to 8080
    if (req.url.startsWith('/app') || req.url.startsWith('/apps')) {
        proxy.web(req, res, { target: 'http://127.0.0.1:8080' });
    } else {
        // Otherwise, proxy to Laravel (8000)
        proxy.web(req, res, { target: 'http://127.0.0.1:8000' });
    }
});

// Handle WebSocket upgrade requests
server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/app') || req.url.startsWith('/apps')) {
        proxy.ws(req, socket, head, { target: 'ws://127.0.0.1:8080' });
    } else {
        proxy.ws(req, socket, head, { target: 'ws://127.0.0.1:8000' });
    }
});

const PORT = 8001;
console.log(`=========================================`);
console.log(`🚀 Reverse Proxy is running on port ${PORT}`);
console.log(`=========================================`);
console.log(`Targeting Laravel on http://127.0.0.1:8000`);
console.log(`Targeting Reverb on ws://127.0.0.1:8080`);
console.log(`\nSilakan jalankan perintah berikut di terminal baru:`);
console.log(`ngrok http ${PORT}`);

server.listen(PORT);
