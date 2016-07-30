import * as http from "http";
import * as fs from "fs";
import {Observable, Subscriber} from "@reactivex/rxjs";

export interface Job {
    // If sent by client in post request, id won't be present
    id?: string;
    name: string;
    // If sent by client in post request, status won't be present
    status?: string;
    imagePath: string;
    command: string;
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
                const jobConfig = JSON.parse(data.toString());
                if (isValid(jobConfig)) {
                    jobsConfig.config.jobs.push(jobConfig);
                    jobsConfig.save();
                    res.statusCode = 201;
                } else {
                    res.statusCode = 400;
                }
                res.end();
            });
            break;
        default:
            unrecognizedRequest(res);
        break;
    }
};

const isValid = (jobConfig: Object) => {
    return jobConfig.hasOwnProperty("name")
        && jobConfig.hasOwnProperty("command")
        && jobConfig.hasOwnProperty("imagePath");
};
