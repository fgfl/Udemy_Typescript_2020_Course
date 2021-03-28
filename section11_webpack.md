# Section 11 Using Webpack with Typescript

## What is Webpack & Why do we need it?

- We have many compiled .js files the browser needs to get (multiple HTTP requests) which leads to a lot of over head and causes things to load slower
- Webpack combines everything into one file so there is less overhead.

- Webpack is a bundling and "Build Orchestration" tool

| Normal setup                                | With Webpack                                     |
| ------------------------------------------- | ------------------------------------------------ |
| Mutiple .ts files & imports (Http requests) | code bundles, less import required               |
| Unoptimized code (not as small as possible) | Optimized (minified) code, less code to download |
| "External" development server needed        | More build steps can be added easily             |

## Installing Webpack & Important Dependencies

```
npm i --save-dev webpack webpack-cli webpack-dev-server typescript ts-loader
```

webpack: bundles and build our ts files
webpack-cli: used to run commands in our project
webpack-dev-server: gives us a server, watches files and triggers recompile
ts-loader: tells webpack how to compile our TS code to JS
typescript: gives us typescript, but also good to include it here as a fallback in case it gets removed or the global version gets updated. The project knows it can use the version stated in the package.json file

## Adding Entry & Output Configuration

- in tsconfig.json:

  - don't include `outFile`. We are using modules
  - don't include `rootDir`. Webpack will take care of it.

- create a new file `webpack.config.js`

  - webpack options live here

  ```js
  const path = require('path');

  module.exports = {
    mode: 'development',
    entry: './src/app.ts', // start of our project
    output: {
      filename: 'bundle.js', // output filename
      path: path.resolve(__dirname, 'dist'), // needs absolute path. use path module
    },
    devtool: 'inline-source-map', // use source map for debugging. Need `sourceMap: true` in tsconfig
    module: {
      rules: [
        {
          test: /\.ts$/, // find all .ts files
          use: 'ts-loader', // let ts-laoder hendle them
          exclude: /node_modules/, // ignore node_modules
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'], // which files webpack adds to the imports it finds. Add TS and JS files
    },
  };
  ```

- remove the `.js` extension from the imports. Webpack doesn't need them.
