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
