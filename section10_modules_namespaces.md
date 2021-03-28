# Section 10 Modules & Namespaces

- split code into multiple files to make it easier to work with
- can use namespaces to group files together under one namespace
- es6 use `import`/`export` to handle dependency on code that is in another file
- if we want to ship the project in one file, we need to use third party tools like Webpack to bundle the files together

## Working with Namespaces

[More on JS Modules](https://medium.com/computed-comparisons/commonjs-vs-amd-vs-requirejs-vs-es6-modules-2e814b114a0b)

- namespaces are a TS features. They are not available in JS.
- any code in the namespaces is only available in the namespace

```ts
namespace NamespaceName {
  // code goes here
  export interface Draggable {
    // This interface is accessible in other files by importing the namespace
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
  }
}
```

- use `export` on things inside namespaces to use them outside of namespace
- to import namespaces add

```ts
/// <reference path="drag-drop-interfaces.ts"/>
```

- note `///` is important for TS to recognize this is a reference to your file with namespace that you want to import

- in other files to use our exported namespaces, we need to wrap the code in the same namespace.

- need to change `outfile` setting in tsconfig to let JS know where to find files.
  - TS knows where to find files through the `///` importing, but all this goes away after it is compiled to JS
  - need to use module type 'amd' because of historical reasons. Check link to learn more: https://medium.com/computed-comparisons/commonjs-vs-amd-vs-requirejs-vs-es6-modules-2e814b114a0b

```json
{
  "compilerOptions": {
    "module": "amd" /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */,
    "outFile": "./dist/bundle.js" /* Concatenate and emit output to single file. */
  }
}
```

## Using ES Modules

- problem with `/// <reference path=''>` and `namespace`:

  - if one file has a reference in the namespace, another file with the same namespace doesn't need to add the `reference` to the file.
  - leads to issue where we don't know if and where things are imported

- set `"module": "es2015"` in `tsconfig.json` to say we are using ES modules
  - We get _defined is not defined_ error if we don't
- Do no include the `outFile` option
- the `script` tag in the HTML file should specify the compiled `app.js` file

  - `script` tag must use `type="modules"` as an option

- now we can use `import` instad of the `/// <reference path=''>` syntax

## Understanding various Import & Export Syntaxes

### import everything as an object

- can do `import * as Validation from '../utils/validation.js'`
- this lets us use `Validation` as an object that contains all the exports from the `validation.js` file

```ts
const peopleValidatable: Validation.Validatable = {
  /* stuff here */
};
// call the validate function
Validation.validate(/* stuff to validate */);
```

### import as an alias

- use alias to change the imported object/function's name

  - can use to avoid name clashes

- below capitalize the decorator name

```ts
import { decoratorName as DecoratorName } from '../decorators/myDecorator.js';
```

### import a default export

- export default with `export default MyClass`
  - can only have one
  - can still have other non-default exports in the file
- import with `import MyClass from './myClass.js'`
  - no brace around the import variable name b/c JS knows to use the default
  - can change name of variable to anything `import SomeClassName from './myClass.js'`

## How Does Code in Modules Execute?

- imported code is only run once on the first time it is import
  - it doe not run again on further imports

## Links

JavaScript Modules (Overview): https://medium.com/computed-comparisons/commonjs-vs-amd-vs-requirejs-vs-es6-modules-2e814b114a0b

More on ES Modules: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
