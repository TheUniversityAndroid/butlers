import * as http from "http";

http.createServer((req, res) => {
    res.end("Hello world!");
}).listen(8080);
