const express = require('express');
const app = express();
const { exec } = require("child_process");
const bodyParser  = require('body-parser');
const fs = require('fs');
var cors = require('cors');

app.use(bodyParser.json());
app.use ( bodyParser.json( { type: '*/*' } ));

app.use(cors());

app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

//docker build -t hello-docker .
//docker run -it -p 8888:4000 hello-docker

app.get('/products/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
});

app.get('/code', function (req, res) {
    res.json({'code': 'Hello World'})
});

app.get('/', function (req, res) {
    res.send("JEPP DET FUNKER");
    fs.writeFileSync("mjau.txt", "Hello World");

    exec('cat mjau.txt', (err, stdout, stderr) => {
        if (err) {
            console.error(`exec error: ${err}`);
            return;
        }
        console.log(`CAT = ${stdout}`);
    });



    compile('g++ -o hello hello.cpp', () => {

        exec('./hello', (err, stdout, stderr) => {
            if (err) {
                console.error(`exec error: ${err}`);
                return;
            }
            console.log(`Kompilert kode: ${stdout}`);
        });
    })

});

function compile(command, callback){
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error(`exec error: ${err}`);
        }
    });
    callback();
}


app.listen(4000, function () {
    console.log("app listening on 4000");
});

