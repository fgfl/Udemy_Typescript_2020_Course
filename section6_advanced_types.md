# Advanced Types

More on Advanced Types: https://www.typescriptlang.org/docs/handbook/advanced-types.html

## Intersection types

- can use to combine types

  - if used on an object type, then it combines the object properties into a new type

    ```ts
    type Admin = {
      name: string;
      privileges: string[];
    };

    type Employee = {
      name: string;
      startDate: Date;
    };

    type ElevatedEmployee = Admin & Employee;

    const e1: ElevatedEmployee = {
      name: 'Max',
      privileges: ['crete-server'],
      startDate: new Date(),
    };
    ```

  - if used on a union type, then it creates a type with what both have in common

    ```ts
    type Combinable = string | number;
    type Numermic = number | boolean;

    type Universal = Combinable & Numermic; // number type only
    ```

- can do the same thing with interfaces and inhertance

  ```ts
  interface Admin = {
    name: string;
    privileges: string[];
  };

  interface Employee = {
    name: string;
    startDate: Date;
  };

  interface ElevatedEmployee extends Admin, Employee;
  // OR can do the below
  type ElevtedEmployee = Admin & Employee;
  ```

## Type Guard

- patter where you check type of a variable before using at runtime. e.g.

  - regular javascript types

    `if (typeof a == 'string' || typeof b === 'string') {}`

  - properties in objects

    `if ('privileges' in emp) {}`

  - using a class object

    `if (vehicle instanceof Truck) {}`

## Discriminated Union

- helps with type guard
  - makes implementing type guards easier when working with object types
- use a property that we know exists to check for the type
- VScode has autocomplete in the switch statement because it knows `animal.type` is only certain values

  ```ts
  interface Bird {
    type: 'bird';
    ...
  }

  interface Horse {
    type: 'horse';
    ...
  }

  type Animal = Bird | Horse;
  let animal: Animal;
  switch(animal.type) {
    case 'bird':
      break;
    case 'horse':
      break;
  }
  ```

  ## Type Casting

- two ways
  - put in front of what you want to cast with angle brackets <type here>
    `const userInputElement = <HTMLInputElement>document.getElementById('user-input');`
  - with `as` keyword
    `const userInputElement = document.getElementById('user-input')! as HTMLInputElement;`
  - need to use `!` to tell ts that it's guaranteed to nto be null. If we don't use `!` and use the `as` keyword, then that tells ts that it's not null.
  - if it can be null, then use an `if` check and the `as` keyword when accessing the value property
  ```ts
  if (userInputElement) {
    (userInputElement as HTMLInputElement).value = 'Hi there!';
  }
  ```

## Index Properties

- Reason to use: know value type, but don't know how many we will have and don't know the name
- when using index property in an interface all properties must follow the same type as the index property

```ts
interface ErrorContainer {
  [prop: string]: string;
  id: string; // OK
  id2: number; // NOT OK
}
```

## Function Overload

- define different combinations of types that a function can take in to let ts know that return types are a certain type when the input parameters are a certain type

  ```ts
  function add(a: number, b: number): number;
  function add(a: string, b: string): string;
  function add(a: number, b: string): string;
  function add(a: string, b: number): string;
  function add(a: Combinable, b: Combinable) {
    if (typeof a == 'string' || typeof b === 'string') {
      return a.toString() + b.toString();
    }
    return a + b;
  }

  const result = add('hello', 5);
  result.split('');
  ```

- without the function overloadds, the `.split('')` with complain because `result` if of type `Combinable` instead of type `string`

## Optional Chaining

- `?.` operator on objects checks if the object exists before accessing the property
  `fetchedData?.title`
- useful if we are fetching data and do not know if the object exists or not
- in JS, we can do `fetchedData && fetchedData.title` or use `if` statements

## Nulliah Coalesciing

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator

- `??` return right hand side if left hand side is `null` or `undefined`
- useful if store other falsy values, like empty strings, are ok

  ```ts
  const userInput = null;
  const storedData = userInput ?? 'DEFAULT'; // 'DEFAULT'

  const userInput2 = '';
  const storedData2 = userInput2 ?? 'DEFAULT'; // ''
  ```
