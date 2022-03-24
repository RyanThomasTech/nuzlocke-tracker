import { server, expect, BASE_URL } from "./setup";

describe("Trainers page test", function () {
  it(`GETs the current table contents`, function (done) {
    server
      .get(`${BASE_URL}/trainers`)
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.trainers).to.be.a("Array");
        res.body.trainers.forEach((el) => {
          expect(el).to.have.keys(["id", "name"]);
        });
        done();
      });
  });
});
