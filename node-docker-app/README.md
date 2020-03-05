This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Run node-docker-app

Change directory to server:
`$cd server`

`$npm install`

Build the docker on your computer
`$docker build -t hello-docker .`

Run the docker "hello-docker"
`$docker run -it -p 8888:4000 hello-docker .`

Change directory to client:
`$cd ../client`

`$npm install`

### `$npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

You will also see any errors in the console.

