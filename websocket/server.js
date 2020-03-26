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
            let recivedData = data.toString();
            console.log("Recived data: ", recivedData);

            //Extracting key from repsonse data



            let key = recivedData.split("\n").find(str => {return str.includes("Sec-WebSocket-Key")}).trim().split(":")[1];

            //We need to remove the last two char's because of \r

            console.log("The websocket key is: ",key, " length: ", key.length);

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
