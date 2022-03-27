import { server, expect, BASE_URL } from "./setup";

describe("Trainers page tests", function () {
  const ENDPOINT = `${BASE_URL}/trainers`;
  describe("GET", function () {
    it(`GETs the current table contents`, function (done) {
      server
        .get(ENDPOINT)
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

    /** Disabled until I change the endpoints
    it("GETs a single trainer's data", function(done) {
        const data = { id:1};
        server
        .get(ENDPOINT)
        .send(data)
        .expect(200)
        .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.trainers).to.be.a('Object');
            expect(res.body.trainers).to.have.keys("id","name");
            done();
        })
    })
    */
  });

  describe("POST", function () {
    it("adds a trainer to the table, returns trainer object", function (done) {
      const data = { name: "Connor" };
      server
        .post(ENDPOINT)
        .send(data)
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.trainers).to.be.a("Object");
          expect(res.body.trainers).to.have.keys(["id", "name"]);
          expect(res.body.trainers).to.have.property("name", "Connor");
          done();
        });
    });
  });

  describe("PUT", function () {
    it("updates the name of a trainer that exists", function (done) {
      const data = {
        id: 1,
        name: "Aly",
      };
      server
        .put(ENDPOINT)
        .send(data)
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it("creates a new trainer because it was told to update a nonexistent trainer", function (done) {
      const data = {
        id: 10,
        name: "Lucy",
      };
      server
        .put(ENDPOINT)
        .send(data)
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.trainers).to.be.a("Object");
          expect(res.body.trainers).to.have.keys("id", "name");
          expect(res.body.trainers).to.have.property("name", "Lucy");
          done();
        });
    });
  });

  describe("DELETE", function () {
    it("deletes a trainer", function (done) {
      const data = { id: 2 };
      server
        .delete(ENDPOINT)
        .send(data)
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.trainers).to.be.a("Object");
          expect(res.body.trainers).to.have.property("name", "Len");
          done();
        });
    });
  });
});
