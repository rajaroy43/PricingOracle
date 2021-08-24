import express from "express"
import http from "http"
const app = express()

app.get('/', ((req, res) => {
    http.get('http://reward_calculator:9001/ping-me', (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            console.log(data);
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

    res.send("Hello from the node server");
}))

const port = 9000;

/*
node is polling from 3rd party, munge data, transform it, then ship to python

 */

/*

new request object
request.post("http://python:8001/ping-me")

 */

app.listen(port, () => console.log(`App listening on PORT ${port}`));