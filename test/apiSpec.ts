import createServer from "../server";
// tslint:disable-next-line:no-require-imports no-var-requires
const request = require("supertest");

const sampleJob = {
    jobs: [
        {
            id: 1,
            name: "University Android",
            status: "new",
        },
    ],
};

describe("/api", function () {

    describe("/jobs", function () {

        context("When there are existing configured jobs", function () {

            describe("GET", function () {

                const server = createServer("test-jobs.toml");

                it("returns those configured jobs", function (done) {

                    request(server)
                        .get("/api/jobs")
                        .set("Accept", "application/json")
                        .expect(200, sampleJob, done);
                });
            });

            describe("POST", function () {

                const server = createServer("empty-jobs.toml");

                it("appends the posted job to the list of jobs", function (done) {
                    request(server)
                        .post("/api/jobs")
                        .expect(201);

                    request(server)
                        .get("/api/jobs")
                        .expect(200, sampleJob, done);
                });

            })
        });
    });
});
