// websocket.js
function startWebSocket() {
    let ws = new WebSocket('ws://localhost:9900');
    ws.onopen = () => {
        ws.onmessage = (event) => {
            if (event.data === 'reload') {
                console.log('Received reload command. Reloading...');
                window.location.reload();
            }
        };
    }

    ws.onclose = () => {
        console.log('WebSocket connection closed. Attempting to reconnect...');
        setTimeout(startWebSocket, 1000);
    };
}

startWebSocket();
