import {makeServer, FileJobsConfig} from "./server";
import * as fs from "fs";
// tslint:disable-next-line:no-require-imports no-var-requires
const toml = require("toml-j0.4");

const configPath = "jobs-config.toml";

if (!fs.statSync(configPath).isFile()) {
    fs.writeFileSync(configPath, "");
}
const data = fs.readFileSync(configPath, "utf-8");
const rawJobConfig = toml.parse(data);
const jobConfig = new FileJobsConfig(fs, rawJobConfig);
makeServer(jobConfig).listen(8080);
