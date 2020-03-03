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
            if (err) {
                console.error(`exec error: ${err}`);
                return;
            }
            console.log(`Kompilert kode: ${stdout}`);
            res.json({output: stdout})

        });
    })

});

/*
app.post('/run/code', (req, res) => {
    let code = req.body.input;
    fs.writeFile("hello.cpp", code, () => {
        compile('g++ -o hello hello.cpp', () => {
            //Run code
            exec('./hello', (err, stdout, stderr) => {
                if (err) {
                    console.error(`exec error: ${err}`);
                    return;
                }
                console.log(`Kompilert kode: ${stdout}`);
                res.json({output: stdout})

            });
        })
    });
});

 */

app.post('/run/code', (req, res) => {
    let code = req.body.input;
    writeToFile(code, () => {
        compile('g++ -o hello hello.cpp', () => {
            //Run code
            exec('./hello', (err, stdout, stderr) => {
                if (err) {
                    console.error(`exec error: ${err}`);
                    return;
                }
                console.log(`Kompilert kode: ${stdout}`);
                res.json({output: stdout})

            });
        })
    });
});

/*
function writeToFile(code, callback){
    try{
        fs.writeFile("hello.cpp", code, () => callback);
    } catch(exception){
        console.log(exception);
    }

}
 */



function writeToFile(code, callback){
    try{
        fs.writeFileSync("hello.cpp", code);
        callback();
    } catch(exception){
        console.log(exception);
    }

}


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

