import { expect, BASE_URL, server } from "./setup";

const ENDPOINT = `${BASE_URL}/games`;

describe("Games page", function () {
  describe("GET", function () {
    describe("GET /games", function () {
      const getGamesPage = (url, expectedStatus) =>
        function (done) {
          server
            .get(url)
            .expect(200)
            .end((err, res) => {
              expect(res.status).to.equal(expectedStatus);
              if (expectedStatus === 200) {
                expect(res.body.games).to.be.an("Array");
                res.body.games.forEach((el) => {
                  expect(el).to.be.an("Object");
                  expect(el).to.have.keys("id", "name", "trainers");
                });
                done();
              }
            });
        };
      it("gets all games", getGamesPage(ENDPOINT, 200));
    });

    describe("GET /games/:id", function () {
      const getSingleGame = (data, expectedStatus) =>
        function (done) {
          const { id } = data;
          server
            .get(`${ENDPOINT}/${id}`)
            .expect(200)
            .end((err, res) => {
              expect(res.status).to.equal(expectedStatus);
              if (expectedStatus === 200) {
                expect(res.body.games).to.be.an("Object");
                expect(res.body.games).to.have.keys("id", "name", "trainers");
                expect(res.body.games).to.have.property("id", id);
                expect(res.body.games.trainers).to.be.an("Array");
              }
              done();
            });
        };
      it("successfully gets a single game", getSingleGame({ id: 1 }, 200));
      it("404 on bad id", getSingleGame({ id: 10 }, 404));
    });
  });
  describe("POST", function () {
    describe("POST /games", function () {
      const postGame = (data, expectedStatus) =>
        function (done) {
          const { name } = data;
          server
            .post(ENDPOINT)
            .send(data)
            .expect(200)
            .end((err, res) => {
              expect(res.status).to.equal(expectedStatus);
              if (expectedStatus === 200) {
                expect(res.body.games).to.be.an("Object");
                expect(res.body.games).to.have.keys("id", "name");
                expect(res.body.games).to.have.property("name", name);
              }
              done();
            });
        };
      it(
        "successfully creates a new game with a name",
        postGame({ name: "NewGame", trainers: [1, 2] }, 200)
      );
      it(
        "successfully creates a new game without a name",
        postGame({ name: null, trainers: [1] }, 200)
      );
      it(
        "Fails to create a new game due to not providing trainers",
        postGame({ name: "NoTrainersGame" }, 500)
      );
      it(
        "Fails to create a new game due to passing invalid trainer IDs",
        postGame({ name: "BadTrainersGame", trainers: [10, 20] }, 500)
      );
    });
  });
  describe("PUT", function () {
    describe("PUT /games/:id", function () {
      const putGame = (data, expectedStatus) =>
        function (done) {
          const { name, id } = data;
          server
            .put(`${ENDPOINT}/${id}`)
            .send(data)
            .expect(200)
            .end((err, res) => {
              expect(res.status).to.equal(expectedStatus);
              if (expectedStatus === 201) {
                expect(res.body.games).to.be.an("Object");
                expect(res.body.games).to.have.keys("id", "name");
                expect(res.body.games).to.have.property("id", id);
                expect(res.body.games).to.have.property("name", name);
              }
              done();
            });
        };
      it(
        "Successfully changes an existing game's name",
        putGame({ id: 1, name: "NewORAS" }, 201)
      );
      it(
        "Successfully erases an existing game's name",
        putGame({ id: 1, name: "" }, 201)
      );
      it(
        "Fails due to illegally long name",
        putGame(
          {
            id: 1,
            name: "SuperLongNameThatIsDefinitelyLongerThan60CharactersBecauseImACompletePsychoThatWontStopPuttingCharactersInNamesOfThingsIreallyHopethisislongerthan60charactersatthispointxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
          },
          501
        )
      );
      it(
        "501's due to invalid id being passed",
        putGame({ id: 10, name: "FailORAS" }, 501)
      );
    });
  });

  describe("DELETE", function () {
    describe("DELETE /games/:id", function () {
      const deleteGame = (data, expectedStatus) =>
        function (done) {
          const { id } = data;
          server
            .delete(`${ENDPOINT}/${id}`)
            .expect(200)
            .end((err, res) => {
              expect(res.status).to.equal(expectedStatus);
              if (expectedStatus === 200) {
                expect(res.body.games.gamesRowDeleted).to.be.an("Object");
                expect(res.body.games.gamesRowDeleted).to.have.keys(
                  "id",
                  "name"
                );
                expect(res.body.games.gamesRowDeleted).to.have.property(
                  "id",
                  id
                );
                expect(res.body.games.gtRowsDeleted).to.be.an("Array");
                res.body.games.gtRowsDeleted.forEach((el) => {
                  expect(el).to.have.keys("game_id", "trainer_id", "id");
                  expect(el).to.have.property("game_id", id);
                });
              }
              done();
            });
        };
      it("Successfully deletes an existing game", deleteGame({ id: 1 }, 200));
      it("404's due to invalid id being passed", deleteGame({ id: 10 }, 404));
    });
  });
});
