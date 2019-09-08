export class WebSocketServer {
    constructor(port) {
        this.clients = new Map();
        this.server = require('net').createServer();
        this.port = port || 3000;
    }

    listen(port) {
        this.server.listen(port || this.port);
    }
}
