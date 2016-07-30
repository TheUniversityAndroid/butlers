import * as http from "http";
import * as fs from "fs";
// tslint:disable-next-line:no-require-imports no-var-requires
const toml = require("toml");

export default (jobsConfigPath: string): http.Server =>
    http.createServer((req, res) => {

        fs.readFile(jobsConfigPath, "utf-8", (err, data) => {
            if (err) { res.statusCode = 500; res.end(); return; }
            const jobConfig = toml.parse(data);
            res.setHeader("Content-type", "application/json");
            res.end(JSON.stringify(jobConfig));
        });
    });
