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

app.get('/run/code', (req, res) => {
    compile('g++ -o hello hello.cpp', () => {
        //Run code
        exec('./hello', (err, stdout, stderr) => {
            if (err || stderr) {
                console.error(`exec error: ${err}`);
                res.json({output: "Det skjedde en feil, sjekk syntax."});
                return;
            }
            console.log(`Kompilert kode: ${stdout}`);
            res.json({output: stdout})

        });
    })

});


app.post('/run/code', (req, res) => {
    let code = req.body.input;
    fs.writeFile("hello.cpp", code, () => {
        compile('g++ -o hello hello.cpp', () => {
            //Run code
            exec('./hello', (err, stdout, stderr) => {
                if (err) {
                    console.error(`exec error: ${err}`);
                    res.json({output: err});
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    res.json({output: stderr});
                    return;
                }
                console.log(`Kompilert kode: ${stdout}`);
                res.json({output: stdout})

            });
        })
    });
});


function compile(command, callback){
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error(`exec error: ${err}`);
        }
        callback();
    });

}


app.listen(4000, function () {
    console.log("app listening on 4000");
});

