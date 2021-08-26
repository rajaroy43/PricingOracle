"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var client_1 = require("@apollo/client");
var cross_fetch_1 = __importDefault(require("cross-fetch"));
var app = express_1.default();
var SCHEMA_QUERY = client_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n{\n  __schema {\n    queryType{\n      fields {\n        name\n        description\n      }\n    }\n  }\n}\n"], ["\n{\n  __schema {\n    queryType{\n      fields {\n        name\n        description\n      }\n    }\n  }\n}\n"])));
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
app.get('/graphql', (function (req, res) {
    var client = new client_1.ApolloClient({
        link: new client_1.HttpLink({ uri: 'http://localhost:8000/subgraphs/name/scaffold-eth/your-contract/graphql', fetch: cross_fetch_1.default })
        //uri: 'http://localhost:8000/subgraphs/name/scaffold-eth/your-contract/graphql',
        ,
        //uri: 'http://localhost:8000/subgraphs/name/scaffold-eth/your-contract/graphql',
        cache: new client_1.InMemoryCache()
    });
    return client.query({
        query: SCHEMA_QUERY
    });
}));
app.listen(port, function () { return console.log("App listening on PORT " + port); });
var templateObject_1;
