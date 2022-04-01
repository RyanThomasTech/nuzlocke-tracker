# Starting an ExpressJS Project

## Setup

`npx express-generator [PROJECT_NAME]`

It still uses jade instead of pug, so...

```
npm install pug
npm remove jade
```

Now, in `app.js`, change jade => pug as the view engine being loaded. Rename the files in `views` to .pug files instead of .jade files.

Optionally, can remove `public` and `views` folder if not using that functionality for the project. Also, can create a `src` folder to put `bin`,`routes`, and `app.js` inside. Remember to change `package.json`'s start script, and any other paths looking for folders (like the view engine) if I did that.

For nuzlocke-tracker I'm going to remove the views engine to play with that some other time. `npm remove pug` Thus, in the routes, I will not use `.render(...)` functions, as that calls the view engine. Instead,

```
router.get('/', function(req, res, next) {
  return res.status(200).json({message: 'Welcome to the Nuzlocke tracker!'});
});
```

Furthermore, I should remove the error-handling functions from `app.js`, as their purpose is to export errors to the view engine that is no longer present.

This is a decent base-state for the app, so now is a good time to git init.

## Convert to ES6 + code quality

1. Rename `www` to `www.js`.
2. Change all instances of `var foo = require('bar');` to `import foo from 'bar';` across `www.js, app.js,routes/*`.
3. Change instances of `module.exports = foo` to `export default foo`.

### Babel

In the previous project I decided not to use Babel to avoid using tooling that I didn't understand. Converting to ES6 required a bit of googling and playing with various things including setting the project to type: module, changing the way the dirname is detected, and appending filetypes to files. It worked, but I'm not entirely certain of the ramifications of running the project as a module in the first place. This time, I'll use Babel and try to understand it as I go.

The `babel` npm package is a deprecated version of Babel. The most recent version exists as a series of separate packages scoped under `@babel`. I'll start by installing the Babel pieces as dev dependencies.

`npm install --save-dev @babel/core @babel/cli @babel/preset-env @babel/register @babel/node @babel/plugin-transform-runtime @babel/runtime`

- `@babel/core` - Required. Core code for Babel.
- `@babel/cli` - Required unless you're building a Babel package, I guess. Allows CLI-access to Babel functionality.
- `@babel/preset-env` - Babel transforms modern code to make it compatible with older browsers. It transforms that code based on rules set by "plugins" such as `@babel/plugin-transform-arrow-functions`. This install is a "preset" which combines a number of plugins in order to transform ES2015+ syntax into ES5. It requires no additional configuration to perform this default functionality, but can accept add'l config if desires.
- `@babel/register` - Required if running tests through Mocha.
- `@babel/node` - Required for use with nodemon. This is a node-like CLI that runs using the Babel presets and plugins.
- `@babel/plugin-transform-runtime` - Optional. This saves on code size by reducing the frequency with which Babel will add helper functions to files on output.
- `@babel/runtime` - Part of the above optimization.

Now you must create a babel config file named `.babelrc` (or `babel.config.json`--these are similar but there are some minor differences I found while researching on SO) at the project root, and populate it with...

```
{
    "presets":["@babel/preset-env"],
    "plugins":["@babel/plugin-transform-runtime", "istanbul"]
}
```

Now we're going to change the scripts in `package.json`...

```
...
  "scripts": {
    "prestart": "babel ./src -d build",
    "start": "node ./build/bin/www",
    "startdev": "nodemon --exec babel-node ./src/bin/www "
  },
...
```

- Notice that babel builds into the `build` folder, and `start` launches from the build folder.
- Notice that nodemon is executing babel-node at the location of .src/bin/www

Finally, `npm install nodemon` and create `nodemon.json` in the project root and fill it with the following to enable tracking of relevant files for the project...

- `nodemon` - Running the app through nodemon allows you to specify watched folders, and in response to any changes in those folders, the server will restart itself automatically. Not technically required, but saves sanity.

```
{
    "watch": [
      "package.json",
      "nodemon.json",
      ".eslintrc.json",
      ".babelrc",
      ".prettierrc",
      "src/"
    ],
    "verbose": true,
    "ignore": ["*.test.js", "*.spec.js"]
}
```

The server should be able to start with `npm run startdev`. If so, this is a good place to commit the code.

### ESLint, Prettier

```
npm install eslint --save-dev
npm init @eslint/config
npm install --save-dev prettier eslint-config-prettier
echo {} > .prettierrc.json
```

make sure to add prettier and mocha to `.eslint.json` after the other configs...

```
...
{
  "extends": [
    "some-other-config-you-use",
    "prettier"
  ]
}
```

Create a `.prettierignore` file, consider ignoring generated/not-project-relevant code like `build`, `node_modules`, and `coverage`.

Finally, add some scripts to `package.json`.

```

"lint": "npx eslint ./src"

"pretty": "prettier --write ."

"postpretty": "npm run lint --fix"

```

Since _postpretty_ runs after _pretty_, running _lint_ is usually not necessary.

## Testing

```
npm install --save-dev mocha chai nyc supertest eslint-plugin-mocha
mkdir test
touch test/setup.js test/index.test.js test/.eslintrc.json
```

- `mocha` is the test framework.
- `chai` allows expect-based assertions, which I like.
- `nyc` Allows me to track test coverage. It's yet to feel particularly helpful, but it's kind of cool to look at.
- `supertest` makes the HTTP calls for the tests
- `eslint-plugin-mocha` is an ESLint plugin that contains recommended rules for test linting.

In setup.js, I can declare the variables that I will use in various points throughout my tests so that they needn't be imported on each test file.

```
import chai from 'chai';
import supertest from 'supertest';
import app from '../src/app';

export const { expect } = chai;
export const server = supertest.agent(app);
export const BASE_URL = 'nuzlocke-tracker';
```

Mocha has some features that cause ESLint to throw a lot of errors/warnings in the test files. Most particularly, Mocha recommends [not using arrow functions](https://mochajs.org/#arrow-functions)to avoid their lexical `this` scoping. In order to allow ESLint to help in the test files, I can create a separate `.eslintrc.json` file within the `/test` directory, and it will be applied to those files only. This allows me to disable rules that don't really apply for tests.

```
{
    "env": {
        "browser": true,
        "es2021": true,
        "node": true,
        "mocha": true
    },
    "extends": ["plugin:react/recommended", "airbnb", "plugin:mocha/recommended", "prettier"],
    "plugins": ["react","mocha"],
    "rules":{
        "prefer-arrow-callback":0,
        "func-names":0
    }
}
```

Now, finally, we can add a test under `index.test.js`

```
import { server, expect, BASE_URL } from './setup';

describe('Index page test', function() {
    it('GETs base url', function(done) {
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
```

If I want to configure nyc beyond using default functionality at a later time, I will have to start (at this point)[https://github.com/istanbuljs/nyc#configuring-nyc].

And in `package.json` we add the `test` script: `"test": "nyc --reporter=html --reporter=text --reporter=lcov mocha -r @babel/register`

- Notice that we are calling `nyc`(istanbul? not sure what's up with the name) and telling it to provide reports in html, `lcov.info`, and on the console via text, and using it to run `mocha` which (-r)equires `@babel/register` to compile in a babel project.

## Integrating PostgreSQL

I'll be working with the PostgresQL installation present on my dev machine.

```
npm install pg-promise pg-monitor dotenv
mkdir src/db
touch .env src/db/database.js
out=$(echo .env; cat .gitignore)
echo "$out" > .gitignore
```

- Note that these are being installed as normal dependencies, not dev-dependencies.
- `pg-promise` When I started looking into ExpressJS, the official docs pointed me at (pg-promise)[https://github.com/vitaly-t/pg-promise], so that's what I'll continue using for now.
- `pg-monitor` Very useful tool that outputs the DB calls made by the app to the console while it's running. This feels like it should be a dev-dependency, but until i can figure out how to import it in development-only code, I'm treating it as a full dependency.
- `dotenv` Will allow me to assign environment variables for the application that live in a specified `.env` file. This allows me to hide certain information from the git repo.
- The `out='echo...` adds `.env` to the top of the `.gitignore`.

Per `pg-promise`(henceforth pgp)'s docs, I will create a single database object and export it for use across the app. It handles pools internally. First, I'll create a `settings.js` file in `src/` and utilize object destructuring to assign the appropriate `process.env` keys to their respective in-app lookalikes...

```
import 'dotenv/config';

//object destructuring is cool!
export const {DB_USER, DB_PASSWORD, DB_PORT}=process.env;
```

Afterwards, in `src/db/database.js`, per the `pgp` Docs, we create a single database objecdt and let it handle its pools on its own. We will also `monitor.attach(/*initOptions*/)` to it while we're here. We will `export default db` so that the rest of the program can call it...

```
import pgpromise from "pg-promise";
import monitor from "pg-monitor";
import { DB_USER, DB_PASSWORD, DB_PORT } from "../settings";

const initOptions = {
  /** pgp and pgm need to have options passed to them, even if blank, otherwise they throw errors */
};
const pgp = pgpromise(initOptions);
const conn = `postgres://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/nuzlocke`;
const db = pgp(conn);
monitor.attach(initOptions);

export default db;

```

With this, the PostgresQL database is now connected to the app. Groovy!

## MVC structure

It's worth noting that our routes are essentially acting as our "view" in this app.

```
mkdir src/controllers src/models
touch src/controllers/home.js src/controllers/index.js src/controllers/trainers.js src/models/model.js
```

Ideally, I'd like to be able to import the entirety of the `controllers/` directory into the `routes/index.js` file to simplify the import process, but that's not possible. There's a convenient work around, though. First, I'll create `controllers/home.js`

```
const indexPage = (req, res) =>
  res.status(200).json({ message: "Welcome to the Nuzlocke tracker!" });

export default indexPage;

```

And in `controllers/index.js`, I will implement the "index re-export" pattern by exporting the default exports of other files as named exports from this file!

```
// a fancy pattern for simplifying my router import that I found at https://sunnysingh.io/blog/javascript-import-from-folder
export { default as indexPage } from "./home";
export { default as trainersPage } from "./trainers";

```

That allows me to simplify my import in `routes/index.js` to `import { indexPage, trainersPage } from "../controllers";`

Now, we have to develop a model that the app (or at least the trainers page, for now) will be using! A Model in this context is the specification for the SQL queries that we will be triggering from within the app, and how the data will be received from the server. For example, we may simply want to make a basic `SELECT * FROM [table]` query, and we decide that will return an `Array` filled with multiple JSON `Objects` (not that there are many other ways one could think to return data from a `SELECT *` query... other examples may give more freedom for choice). First, we declare a class Model and give it a constructor which takes the table name from the file that calls it. Then, we will give it a number of async functions which will return `pgp` calls as appropriate. (The docs will come in handy here)[https://github.com/vitaly-t/pg-promise].

```
import db from "../db/database";

class Model {
  constructor(table) {
    this.table = table;
  }

  async selectAll() {
    const { table } = this;
    return db.any("SELECT * FROM $1:name", table);
  }
}

export default Model;

```

Now, with our model in place we can create the controller which is called by our route. We create an instance of our Model with "trainers" as the targeted table, and we create an async function which `try/catch`'s our model functions. `pgp` returns Promises, so it's important that we use a `try/catch` schema for interacting with our model.
```
import Model from "../models/model";

const trainersModel = new Model("trainers");
const trainersPage = async (req, res) => {
  try {
    const data = await trainersModel.selectAll();
    res.status(200).json({ trainers: data });
  } catch (err) {
    res.status(200).json({ trainers: err.stack });
  }
};

export default trainersPage;
```
Finally, we can update our `routes/index.js` file to call the `trainersPage` controller that we so easily imported before.

```
import express from "express";
import { indexPage, trainersPage } from "../controllers";

const router = express.Router();

/* GET home page. */
router.get("/", indexPage);
router.get("/trainers", trainersPage);

export default router;

router.get("/trainers", trainersPage);
```

TODO: I've gotten ahead of myself in the actual coding, and I should test whether what I wrote here is all that's necessary to get this all started, or if there's more that I've done and forgotten about since writing this.

## Testing 2: Electric Boogaloo

Per (Mocha Docs)[https://mochajs.org/#root-hook-plugins] we can define some root hooks that will be called before the entire testing suite--this allows us to create a DB for running tests on. Create `test/hooks.js` and add...
```
/**
 * According to mocha docs, we need to export our hooks as a named export,
 * so for this file I'm disabling eslint's prefer-default-export
 */
/* eslint-disable import/prefer-default-export */
import {
    dropTables,
    createTables,
    insertIntoTables
} from '../src/utils/queryFunctions';

export const mochaHooks = {

    beforeAll: [
        async function() {
            await createTables();
            await insertIntoTables();
        }
    ],

    afterAll: [
        async function() {
            await dropTables();
        }
    ]
};
```

Now we can add test/hooks.js as a required file for our test script in `package.json`: `"test": "nyc --reporter=html --reporter=text --reporter=lcov mocha -r @babel/register -r test/hooks.js"`