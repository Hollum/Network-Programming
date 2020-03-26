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

            //Extracting key from response data
            let key = recivedData.split("\r\n").find(str => {return str.includes("Sec-WebSocket-Key")}).split(": ")[1];
            console.log("Recived key:",key);

            //Create the key to create websocket connection
            let serverKey = Base64.stringify(CryptoJS.SHA1(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"));

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

            let bytes = data;

            let length = bytes[1] & 127;
            let maxStart = 2;
            let dataStart = maxStart + 4;

            let dataOutput = "";

            for (let i = dataStart; i < dataStart + length; i++) {
                let byte = bytes[i] ^ bytes[maxStart + ((i - dataStart) % 4)];
                dataOutput += String.fromCharCode(byte);
            }
            console.log("Data from client:", dataOutput);


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
