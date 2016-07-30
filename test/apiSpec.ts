import {makeServer} from "../server";
import {expect} from "chai";
// tslint:disable-next-line:no-require-imports no-var-requires
const request = require("supertest");

const sampleJob = {
    jobs: [
        {
            id: "1",
            name: "University Android",
            status: "new",
        },
    ],
};

describe("/api", function () {

    describe("/jobs", function () {

        context("When there are existing configured jobs", function () {

            describe("GET", function () {

                const server = makeServer({
                    config: sampleJob,
                    // tslint:disable-next-line: no-empty
                    save: () => {},
                });

                it("returns those configured jobs", function (done) {

                    request(server)
                        .get("/api/jobs")
                        .set("Accept", "application/json")
                        .expect(200, sampleJob, done);
                });
            });

            describe("POST", function () {
                let savedCalled = false;
                const server = makeServer({
                    config: {jobs: []},
                    // tslint:disable-next-line: no-empty
                    save: () => { savedCalled = true; },
                });

                it("appends the posted job to the list of jobs", function (done) {
                    request(server)
                        .post("/api/jobs")
                        .send(sampleJob.jobs[0])
                        .expect(201)
                        .end(() => {
                            request(server)
                            .get("/api/jobs")
                            .expect(200, sampleJob)
                            .end((err, res) => {
                                if (err) { done(err); return; }
                                expect(savedCalled).to.equal(true);
                                done();
                            });
                        });
                });

            });
        });
    });
});
