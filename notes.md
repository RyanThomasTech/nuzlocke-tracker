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

* `@babel/core` - Required. Core code for Babel.
* `@babel/cli` - Required unless you're building a Babel package, I guess. Allows CLI-access to Babel functionality.
* `@babel/preset-env` - Babel transforms modern code to make it compatible with older browsers. It transforms that code based on rules set by "plugins" such as `@babel/plugin-transform-arrow-functions`. This install is a "preset" which combines a number of plugins in order to transform ES2015+ syntax into ES5. It requires no additional configuration to perform this default functionality, but can accept add'l config if desires.
* `@babel/register` - Required if running tests through Mocha.
* `@babel/node` - Required for use with nodemon. This is a node-like CLI that runs using the Babel presets and plugins. 
* `@babel/plugin-transform-runtime` - Optional. This saves on code size by reducing the frequency with which Babel will add helper functions to files on output.
* `@babel/runtime` - Part of the above optimization.

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
* Notice that babel builds into the `build` folder, and `start` launches from the build folder.
* Notice that nodemon is executing babel-node at the location of .src/bin/www

Finally, `npm install nodemon` and create `nodemon.json` in the project root and fill it with the following to enable tracking of relevant files for the project...
* `nodemon` - Running the app through nodemon allows you to specify watched folders, and in response to any changes in those folders, the server will restart itself automatically. Not technically required, but saves sanity.

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