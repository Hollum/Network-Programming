'use strict';

const net = require('net');
const CryptoJS = require('crypto-js');
const Base64 = require('crypto-js/enc-base64');
const fs = require('fs');

// Simple HTTP server responds with a simple WebSocket client test
const httpServer = net.createServer(connection => {
    connection.on('data', () => {
        let content =
            `<!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="UTF-8" />
                  </head>
                  <body>
                    WebSocket test page
                    <script>
                      let ws = new WebSocket('ws://localhost:3001');
                      ws.onmessage = event => alert('Message from server: ' + event.data);
                      ws.onopen = () => ws.send('hello');
                    </script>
                  </body>
                </html>
        `;
        connection.write('HTTP/1.1 200 OK\r\nContent-Length: ' + content.length + '\r\n\r\n' + content);
    });
});
httpServer.listen(3000, () => {
    console.log('HTTP server listening on port 3000');
});

let clients = [];

// Incomplete WebSocket server
const wsServer = net.createServer(connection => {
    console.log('Client connected');

    connection.on('data', data => {
        //Client has connected to websocket
        if ((data.toString().includes("HTTP/1.1"))) {
            if (clients.indexOf(connection) === -1){
                console.log("pushing");
                clients.push(connection);
            }

            //Retrieve the key from the http request. Remember to remove \r on the end of the line
            let clientKey = data.toString()
                .split("\n")
                .filter((line) => line.includes("Sec-WebSocket-Key"))[0].split(": ")[1].slice(0, -1);

            //Create the server key we send back
            let serverKey = Base64.stringify(CryptoJS.SHA1(clientKey + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"));

            //Create the http response
            let returnValue = "HTTP/1.1 101 Switching Protocols\r\n" +
                "Upgrade: websocket\r\n" +
                "Connection: Upgrade\r\n" +
                "Sec-WebSocket-Accept: " + serverKey.trim() + "\r\n" +
                "\r\n";

            //Write the http response
            connection.write(returnValue);
        }
        else{
            console.log("Recived data: ", data.toString());
        }
    });

    connection.on('end', () => {
        console.log('Client disconnected');
    });
});
wsServer.on('error', error => {
    console.error('Error: ', error);
});
wsServer.listen(3001, () => {
    console.log('WebSocket server listening on port 3001');
});
