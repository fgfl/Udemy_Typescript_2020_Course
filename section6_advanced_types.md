# Advanced Types

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

- check type of a variable before using. e.g.

  - regular javascript types

    `if (typeof a == 'string' || typeof b === 'string') {}`

  - properties in objects

    `if ('privileges' in emp) {}`

  - using a class object

    `if (vehicle instanceof Truck) {}`
