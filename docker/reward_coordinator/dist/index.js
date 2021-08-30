"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var app = express_1.default();
app.get('/', (function (req, res) {
    http_1.default.get('http://reward_calculator:9001/ping-me', function (resp) {
        var data = '';
        // A chunk of data has been received.
        resp.on('data', function (chunk) {
            data += chunk;
        });
        // The whole response has been received. Print out the result.
        resp.on('end', function () {
            console.log(data);
        });
    }).on("error", function (err) {
        console.log("Error: " + err.message);
    });
    res.send("Hello from the node server");
}));
var port = 9000;
/*
node is polling from 3rd party, munge data, transform it, then ship to python

 */
/*

new request object
request.post("http://python:8001/ping-me")

 */
app.listen(port, function () { return console.log("App listening on PORT " + port); });
