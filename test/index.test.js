import { server, expect, BASE_URL } from "./setup";

describe("Index page test", function () {
  it(`GETs base url`, function (done) {
    server
      .get(`${BASE_URL}/`)
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal("Welcome to the Nuzlocke tracker!");
        done();
      });
  });
});
