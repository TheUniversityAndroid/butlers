import * as http from "http";
import * as fs from "fs";
import {Observable, Subscriber} from "@reactivex/rxjs";

export interface Job {
    id: string;
    name: string;
    status: string;
}

export interface JobsConfig {
    config: {jobs: Job[]};
    save();
}

export class FileJobsConfig implements JobsConfig {
    constructor(private fs, public config: {jobs: Job[]}) {}
    public save() {
        this.fs.writeFile();
    }
}

export const makeServer = (jobsConfig: JobsConfig): http.Server =>
    http.createServer((req, res) => {
        switch (req.url) {
            case "/api/jobs":
                handleJobsRequest(req, res, jobsConfig);
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

const handleJobsRequest = (req: http.IncomingMessage, res: http.ServerResponse, jobsConfig: JobsConfig) => {
    switch (req.method) {
        case "GET":
            res.setHeader("Content-type", "application/json");
            res.end(JSON.stringify(jobsConfig.config));
            break;
        case "POST":
            Observable.create((subscriber: Subscriber<Buffer>) => {
                let data: Buffer = Buffer.from([]);
                req.on("data", (chunk) => {
                    data = Buffer.concat([data, chunk]);
                });

                req.on("error", (err) => {
                    subscriber.error(err);
                });

                req.on("end", () => {
                    subscriber.next(data);
                    subscriber.complete();
                });
            }).subscribe((data: Buffer) => {
                jobsConfig.config.jobs.push(JSON.parse(data.toString()));
                jobsConfig.save();
                res.statusCode = 201;
                res.end();
            });
            break;
        default:
            unrecognizedRequest(res);
        break;
    }
};
