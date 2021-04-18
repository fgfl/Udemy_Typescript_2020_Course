# 3rd Party Libraries & Typescript

## Using Javascript Libraries with Typescript

- can install npm package normally or use CDN install

  - e.g. `npm i --save lodash`

- TS can't understand pure JS libraries
- turing `noEmitErrors` in tsconfig to `false` will let the browser run the code, but TS will still give errors when compiling

- need to install types package for lodash for TS to get the translations from JS to TS
  - use definitley typed library
  - `npm i --save-dev @types/lodash`

### Using "decalre" as a "Last Resort"

- what if no types package exist?
  - e.g. global variable set in inline script code in html file
  - can use `declare`
    - tells TS that it will exists
    - `decalre let GLOBAL: any;`

### No Types Needed: class-transformer

- package for tranforming data into a class object

### TypeScript - embracing: class-validator
