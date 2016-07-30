import * as http from "http";
import * as fs from "fs";
// tslint:disable-next-line:no-require-imports no-var-requires
const toml = require("toml-j0.4");

export default (jobsConfigPath: string): http.Server =>
    http.createServer((req, res) => {
        switch (req.url) {
            case "/api/jobs":
                handleJobsRequest(req, res, jobsConfigPath);
                break;
            default:
                unrecognizedRequest(res);
                break;
        }
    });

const unrecognizedRequest = (res: http.ServerResponse) => {
    res.statusCode = 404;
    res.end();
};

const handleJobsRequest = (req: http.IncomingMessage, res: http.ServerResponse, jobsConfigPath: string) => {
    switch (req.method) {
        case "GET":
            fs.readFile(jobsConfigPath, "utf-8", (err, data) => {
                if (err) { res.statusCode = 500; res.end(); return; }
                const jobConfig = toml.parse(data);
                res.setHeader("Content-type", "application/json");
                res.end(JSON.stringify(jobConfig));
            });
            break;
        case "POST":
            res.statusCode = 201;
            res.end();
            break;
        default:
            unrecognizedRequest(res);
        break;
    }
};
