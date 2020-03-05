const express = require('express');
const app = express();
const { exec } = require("child_process");
const bodyParser  = require('body-parser');
const fs = require('fs');
var cors = require('cors');

app.use (bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

app.use(cors());


//docker build -t hello-docker .
//docker run -it -p 8888:4000 hello-docker

app.post('/run/code', (req, res) => {
    let code = req.body.input;
    fs.writeFile("hello.cpp", code, () => {
        exec('g++ -o hello hello.cpp', (err, stdout, stderr) => {
            if (err || stderr) {
                console.error(`test error: ${err}`);
                res.json({output: "Error: Syntax error"});
                return;
            }
            exec('./hello', (err, stdout, stderr) => {
                console.log(`Kompilert kode: ${stdout}`);
                res.json({output: stdout})

            });
        });
    });
});


app.listen(4000, function () {
    console.log("app listening on 4000");
});

