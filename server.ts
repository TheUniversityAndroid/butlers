import * as http from "http";

export default http.createServer((req, res) => {
    res.setHeader("Content-type", "application/json")
    res.end(JSON.stringify({hello: "goodbye"}));
});
