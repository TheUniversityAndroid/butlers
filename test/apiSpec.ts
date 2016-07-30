import server from "../server";
// tslint:disable-next-line:no-require-imports no-var-requires
const request = require("supertest");

describe("/api", function() {
    describe("/jobs", function () {
        context("When there are existing configured jobs", function() {
            describe("GET", function () {
                it("returns those configured jobs", function(done) {
                    request(server)
                        .get("/api/jobs")
                        .set("Accept", "application/json")
                        .expect(200,
                            [
                                {
                                    id: 1,
                                    name: "University Android",
                                    status: "new",
                                },
                            ],
                            done);
                });
            });
        });
   });
});
