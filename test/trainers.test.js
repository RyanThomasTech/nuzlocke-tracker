import { server, expect, BASE_URL } from "./setup";

describe("Trainers page tests", function () {
  const ENDPOINT = `${BASE_URL}/trainers`;
  describe("GET", function () {
    it(`GET /trainers`, function (done) {
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

    describe("GET /trainers/:id", function () {
      // closure-style dynamic test desired by eslint-mocha
      // as opposed to forEach-style
      const getOneTrainer = ({ id, expected }) =>
        function (done) {
          server
            .get(`${ENDPOINT}/${id}`)
            .expect(200)
            .end((err, res) => {
              expect(res.status).to.equal(expected);
              if (expected === 200) {
                expect(res.body.trainers).to.be.a("Object");
                expect(res.body.trainers).to.have.keys("id", "name");
              }
              done();
            });
        };

      it("GETs a single trainer row", getOneTrainer({ id: 1, expected: 200 }));
      it(
        "GETs 404 due to invalid unoccupied passed",
        getOneTrainer({ id: 5, expected: 404 })
      );
    });
  });

  describe("POST /trainers", function () {
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

  describe("PUT /trainers", function () {
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

  describe("DELETE /trainers/:id", function () {
    const deleteTrainerTest = ({ id, expectedStatus }) =>
      function (done) {
        server
          .delete(`${ENDPOINT}/${id}`)
          .expect(200)
          .end((err, res) => {
            expect(res.status).to.equal(expectedStatus);
            if (expectedStatus === 200) {
              expect(res.body.trainers).to.be.a("Object");
              expect(res.body.trainers).to.have.property("name", "Len");
            }
            done();
          });
      };

    it(
      "Successfully deletes a trainer",
      deleteTrainerTest({ id: 2, expectedStatus: 200 })
    );
    it(
      "Fails to delete trainer due to invalid ID",
      deleteTrainerTest({ id: 8, expectedStatus: 404 })
    );
  });
});
