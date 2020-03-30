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

let connections = [];

// Incomplete WebSocket server
const wsServer = net.createServer(connection => {
    console.log('Client connected');

    connection.on('data', data => {

        //Add connection to list of connections if not already exist
        if (connections.indexOf(connection) === -1){
            console.log("adding connection to list of connections");
            connections.push(connection);
        }

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

            for (let i = 0; i < connections.length; i++){
                //If the client still exists, and is not this same client we are sending from
                if (!connections[i].destroyed && connections[i] !== connection){
                    //Write the data to all other clients than "yourself"
                    connections[i].write(Buffer.from(transformData(dataOutput)));
                }
                //If this is our client
                else if (connections[i] === connection){
                    //Give a message that we have sent data to other clients
                    connections[i].write(Buffer.from(transformData("Data sent to all other clients!")));
                }
            }



        }
    });

    connection.on('end', () => {
        console.log('Client disconnected');
        connections = connections.filter(e => e !== connection);
        connection.end();
        connection.destroy();
    });
});

wsServer.on('error', error => {
    console.error('Error: ', error);
});

wsServer.listen(3001, () => {
    console.log('WebSocket server listening on port 3001');
});

function transformData(str) {
    //First byte
    let typeOfMessage = 81;
    //Second byte
    let lengthOfMessage = str.length;
    //Can only send 127 bytes at a time.
    if (lengthOfMessage > 127){
        throw new Error("Cannot process more than 127 bytes of sending. Make a buffer");
    }

    //Length of message to hexadecimal
    let hexLength = lengthOfMessage.toString(16);
    if(hexLength.length === 1)
       hexLength = ("0" + hexLength);

    //The generated Hex string
    let hexString = typeOfMessage + "" + hexLength + "" + ascii_to_hexa(str);
    console.log(hexString);

    //toByteArray
    var byteArray = [];
    for (var i = 0; i < hexString.length; i += 2) {
        byteArray.push(parseInt(hexString.substr(i, 2), 16));
    }
    return byteArray;
}

//Ascii to hexadecimal
function ascii_to_hexa(str)
{
    var arr1 = [];
    for (var n = 0, l = str.length; n < l; n ++)
    {
        var hex = Number(str.charCodeAt(n)).toString(16);
        arr1.push(hex);
    }
    return arr1.join('');
}
