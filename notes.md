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

## Convert to ES6

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
    "plugins":["@babel/plugin-transform-runtime"]
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

And in `package.json` we add the `test` script: `"test": "nyc --reporter=html --reporter=text --reporter=lcov mocha -r @babel/register`

- Notice that we are calling `nyc`(istanbul? not sure what's up with the name) and telling it to provide reports in html, `lcov.info`, and on the console via text, and using it to run `mocha` which (-r)equires `@babel/register` to compile in a babel project.