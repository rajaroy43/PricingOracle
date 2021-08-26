import express from "express"
import http from "http"
import { gql, ApolloClient, InMemoryCache, HttpLink  } from '@apollo/client'
import fetch from 'cross-fetch'

const app = express()

const SCHEMA_QUERY = gql`query {
  __schema {
    queryType {
      fields {
        name
        description
      }
    }
  }
}
`

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
}));

const port = 9000;

/*
node is polling from 3rd party, munge data, transform it, then ship to python

 */

/*

new request object
request.post("http://python:8001/ping-me")

 */
app.get('/graphql', ((req, res) => {
    http.get('http://docker_graph-node_1:8000/subgraphs/name/scaffold-eth/your-contract/graphql?query=query%20%7B%0A%20%20__schema%20%7B%0A%20%20%20%20queryType%7B%0A%20%20%20%20%20%20fields%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20description%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D', (resp) => {
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
    // i hate typescript and can't figure out the below to get it to work. says there's an error in the JSON at position 0
    /*
    const client = new ApolloClient({
        link: new HttpLink({ uri: 'http://docker_graph-node_1:8000/subgraphs/name/scaffold-eth/your-contract/graphql', fetch }),
        //uri: 'http://localhost:8000/subgraphs/name/scaffold-eth/your-contract/graphql',
        cache: new InMemoryCache()
    });
    return client.query({
        query: SCHEMA_QUERY
    })
    .then(result => {
        console.log(result);
        return result
    });
     */
}));


app.listen(port, () => console.log(`App listening on PORT ${port}`));