- axios serves the same function as the `fetch()` api; making HTTP requests. For my purposes, since I'm only using it once for this utility, I'll just use `fetch()`

- alternative form of `INSERT INTO table(columns) VALUES (values)` : `INSERT INTO table(column) SELECT rows`

  - valuable because `unnest(array[])` resolves to `row` values, so I can feed an array of data into INSERT this way.
  - **Or just use the built-in pgp.helpers functions**

- dynamic test creation in mocha is useful for testing both the catch and try blocks in a few less lines

- Use plenty of `CASCADE` when running the tests database queries.
