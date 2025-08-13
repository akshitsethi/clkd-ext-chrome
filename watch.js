// watch.js
import { WebSocketServer } from 'ws';
import chokidar from "chokidar";

// WebSocket server on port 9000
const wss = new WebSocketServer({ port: 9900 });

wss.on('connection', (ws) => {
    console.log('Client connected for hot reload');
});

// Function to send reload command to all clients
function sendReloadCommand() {
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send('reload');
        }
    });
}

const directoryToWatch = '.';
let timeout;

// Watch for file changes
const watcher = chokidar.watch(directoryToWatch, {
    ignored: (path) => {
        return path.includes('node_modules') || path.includes('.git') || path.includes('assets/dist');
    },
    persistent: true,
    ignoreInitial: true
});
watcher.on('all', (eventName, path) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        console.log(`${path} triggered ${eventName}. Sending reload command...`);
        sendReloadCommand();
    }, 500); // Debounce for 500ms to avoid duplicate reloads
});
