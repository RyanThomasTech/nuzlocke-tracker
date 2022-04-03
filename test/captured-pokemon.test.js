import { BASE_URL, expect, server } from "./setup";

const ENDPOINT = `${BASE_URL}/captured-pokemon`;

describe("Captured Pokemon page", function () {
  describe("GET", function () {
    it("GET /captured-pokemon", function (done) {
      server
        .get(ENDPOINT)
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.captured_pokemon).to.be.a("Array");
          res.body.captured_pokemon.forEach((el) => {
            expect(el).to.be.a("Object");
            expect(el).to.have.keys([
              "id",
              "nickname",
              "is_alive",
              "owner_id",
              "species_id",
              "game_id",
            ]);
          });
          done();
        });
    });

    describe("GET /captured-pokemon/:id", function () {
      const getOneCapdPokemon = ({ id, expectedStatus }) =>
        function (done) {
          server
            .get(`${ENDPOINT}/${id}`)
            .expect(200)
            .end((err, res) => {
              expect(res.status).to.equal(expectedStatus);
              if (expectedStatus === 200) {
                expect(res.body.captured_pokemon).to.be.a("Object");
                expect(res.body.captured_pokemon).to.have.keys([
                  "id",
                  "nickname",
                  "is_alive",
                  "owner_id",
                  "species_id",
                  "game_id",
                ]);
                expect(res.body.captured_pokemon.id).to.equal(id);
              }
              done();
            });
        };
      it(
        "GET a single captured 'mon",
        getOneCapdPokemon({ id: 1, expectedStatus: 200 })
      );
      it(
        "GET 404 from bad 'mon id",
        getOneCapdPokemon({ id: 5, expectedStatus: 404 })
      );
    });
  });

  describe("PUT", function () {
    describe("PUT /captured-pokemon/:id", function () {
      const updateCapturedMon = (data, expectedStatus) =>
        function (done) {
          server
            .put(`${ENDPOINT}/${data.id}`)
            .send(data)
            .expect(200)
            .end((err, res) => {
              expect(res.status).to.equal(expectedStatus);
              if (expectedStatus === 201) {
                expect(res.body.captured_pokemon).to.be.a("Object");
                expect(res.body.captured_pokemon).to.have.keys([
                  "id",
                  "nickname",
                  "is_alive",
                  "owner_id",
                  "species_id",
                  "game_id",
                ]);
                expect(res.body.captured_pokemon.nickname).to.equal(
                  "ChloroPhil"
                );
                expect(res.body.captured_pokemon.is_alive).to.equal(true);
                expect(res.body.captured_pokemon.id).to.equal(data.id);
              }
              done();
            });
        };
      it(
        "Updates an existing cap'd pokemon",
        updateCapturedMon({ id: 2, is_alive: true }, 201)
      );
      it(
        "Reports 501 when fed an invalid id",
        updateCapturedMon({ id: 10, is_alive: false }, 501)
      );
    });
  });

  describe("POST", function () {
    describe("POST /captured-pokemon", function () {
      const createCapdPokemon = (data, expectedStatus) =>
        function (done) {
          server
            .post(ENDPOINT)
            .send(data)
            .expect(200)
            .end((err, res) => {
              expect(res.status).to.equal(expectedStatus);
              if (expectedStatus === 200) {
                expect(res.body.captured_pokemon).to.be.an("Object");
                expect(res.body.captured_pokemon).to.have.keys([
                  "id",
                  "nickname",
                  "is_alive",
                  "owner_id",
                  "species_id",
                  "game_id",
                ]);
              }
              done();
            });
        };

      it(
        "creates a new cap'd pokemon",
        createCapdPokemon(
          {
            nickname: "Purifier",
            is_alive: true,
            species_id: 662,
            owner_id: 1,
            game_id: 1,
          },
          200
        )
      );
      it(
        "400's due to not receiving necessary data",
        createCapdPokemon(
          {
            nickname: "Fair'NSquare",
            is_alive: true,
            owner_id: 1,
          },
          400
        )
      );
    });
  });

  describe("DELETE", function () {
    describe("DELETE /captured-pokemon/:id", function () {
      const deleteCapdPokemon = (data, expectedStatus) =>
        function (done) {
          server
            .delete(`${ENDPOINT}/${data.id}`)
            .expect(200)
            .end((err, res) => {
              expect(res.status).to.equal(expectedStatus);
              if (expectedStatus === 200) {
                expect(res.body.captured_pokemon).to.be.an("Object");
                expect(res.body.captured_pokemon).to.have.property(
                  "id",
                  data.id
                );
              }
              done();
            });
        };
      it(
        "deletes a pokemon and returns the deleted 'mon",
        deleteCapdPokemon({ id: 2 }, 200)
      );
      it(
        "returns 404 on being fed an invalid id",
        deleteCapdPokemon({ id: 20 }, 404)
      );
    });
  });
});
