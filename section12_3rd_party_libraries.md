# 3rd Party Libraries & Typescript

## Using Javascript Libraries with Typescript

- can install npm package normally or use CDN install

  - e.g. `npm i --save lodash`

- TS can't understand pure JS libraries
- turing `noEmitErrors` in tsconfig to `false` will let the browser run the code, but TS will still give errors when compiling

- need to install types package for lodash for TS to get the translations from JS to TS
  - use definitley typed library
  - `npm i --save-dev @types/lodash`
