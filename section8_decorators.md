# Decorators

https://www.typescriptlang.org/docs/handbook/decorators.html

- instrument for writing code that is easier to use by other developers

## A First Class Decorator

- `@` symbol used to signify decorator

  - the function after the `@` is what the decorator points at

  ```ts
  function Logger(constructor: Function) {
    console.log('Logging...');
  }

  @Logger
  ```

- decorators execute when your class is defined not when it is created
- decorators have arguments. The number it needs depends on where you use it

## Working with Decorator Factories

- setup a function to return the decorator function
  - advantages: can pass argument to use in our 'decorator factory'

```ts
function Logger(logString: string) {
  return function (constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

@Logger('LOGGING - PERSON')
```

## Building More Usefull Decorators

- Can use decorators to generate HTML string when there is an element with certain id
- use `_` for an argument if we need the argument in the function, but we are not going to use it. It tells Typescript to ignore warning.

```ts
function WithTemplate(template: string, hookId: string) {
  return function (constructor: any) {
    const hookEl = document.getElementById(hookId);
    const p = new constructor();
    if (hookEl) {
      hookEl.innerHTML = template;
      hookEl.querySelector('h1')!.textContent = p.name;
    }
  };
}

@WithTemplate('<h1>My Person Object</h1>', 'app')
class Person {...}
```

- The above puts the `h1` tag in the `app` element, creates a new `Person` (b/c we attached the decorator to the `Person` class), then puts the person name where we created the `h1` element
- Angular does something similar with decorators but has more advanced features

## Adding Multiple Decorators

- decorators execute from the bottom to the top

```ts
@Logger('LOGGING - PERSON')
@WithTemplate('<h1>My Person Object</h1>', 'app')
```

- `WithTemplate` will run first, then `Logger`
- The decorator factories however, will run in top down, like normal code

```ts
function Logger(logString: string) {
  console.log('LOGGER FACTORY');
  return function (constructor: Function) {... }
}

function WithTemplate(template: string, hookId: string) {
  console.log('WITHTEMPLATE FACTORY');
  return function (constructor: any) {...}
}
```

- above will print

```
LOGGER FACTORY
WITHTEMPLATE FACTORY
```

## Diving into Property Decorators

- can use decorators on class properties
  - needs a `target: any` and a `PropertyName: string` argument
  - `target` is the property or the constructor function if the property is a `static` property
- will execute when property is defined

```ts
// decorator function
function Log(target: any, propertyName: string | Symbol) {
  console.log('Property decorator!');
  console.log(target, propertyName);
}

class Prduct {
  @Log
  title: string;
  ...
}
```

- above will log the `title` property

## Accessor & Parameter Decorators

- can apply to accessors
  - need `target: any`, `name: string`, and `descriptor: PropertyDescriptor` args
  ```ts
  function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
    console.log('Accessor decorator!');
    console.log(target);
    console.log(name);
    console.log(descriptor);
  }
  ```
- '' methods
  - need `target: any`, `name: string | symbol`, and `descriptor: PropertyDescriptor` args
  ```ts
  function Log3(target: any, name: string | symbol, descriptor: PropertyDescriptor) {
    console.log('Method decorator!');
    console.log(target);
    console.log(name);
    console.log(descriptor);
  }
  ```
- '' parameters in methods (args)
  - need `target: any`, `name: string | symbol`, and `position: number` args
  - `name` is the name of the method not the parameter name
  - `position` is the index of the parameter (0, 1, 2, 3, etc)
- place parameter decorater in front of the parameters

```ts
function Log4(target: any, name: string | Symbol, position: number) {
  console.log('Parameter decorator!');
  console.log(target);
  console.log(name);
  console.log(position);
}

getPriceWithTax(@Log4 tax: number) {
  return this._price * (1 + tax);
}
```

## When do Decorators Execute?

- decorators execute when the class, method, etc is defined
  - it does not run every time an object of the class with a decorator is created
  - used to add extra functionality / add extra setup work behind the scene when defining classes

## Returning (and changing) a Class in a Class Decorator

- in the class decorator function (not factory function) we can return a new constructor function
  - can extend the original class to get more functionality added to the class or just return another class

```ts
function WithTemplate(template: string, hookId: string) {
  console.log('WITHTEMPLATE FACTORY');
  return function<T extends {new(...args: any[]): {name: string}} (originalConstructor: T) {
    return class extends originalConstructor {
      constructor(..._: any[]) {
        super();
        console.log('Rendering Template');
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector('h1')!.textContent = this.name;
        }
      }

    }
  };
}
```

- above makes it so that the name of the `name` property of the class gets put on the `hookEl` when an object of the class with the decorator attached is created.

  ```ts
  @WithTemplate('<h1>My Person Object</h1>', 'app')
  class Person {
    name = 'Max';

    constructor() {
      console.log('Creating person object....');
    }
  }
  ```

  - i.e. if the decorator was on a `Person` class, then `const pers = new Person();` will call the `Person` constructor then do the above to add the person's name to the page

## Other Decorator Return Types

[Property Descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

- can have returns on accessor and method decorators
- returns on property (class variable) and parameter (args) are ignored by typescript
- accessor and method decorators return new property descriptors

## Example: Creating an "Autobind" Decorator

```ts
class Printer {
  message = 'This works!';

  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();

const button = document.querySelector('button')!;
button.addEventListener('click', p.showMessage);
```

- above doesn't print message because `this` does not have the same context as the class object
  - JS can solve with `button.addEventListener('click', p.showMessage.bind(p)); `
  - TS can solve with decorator on the method
  ```ts
  function Autobind(target: any, methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      enumerable: false,
      get() {
        const boundFn = originalMethod.bind(this);
        return boundFn;
      },
    };
    return adjDescriptor;
  }
  ```
  - `this` will refer to the what defined the `get` method
  - put the `Autobind` decorator on the `showMessage` method, then we don't need to do `.bind(p)` in the event listener. We can do `button.addEventListener('click', p.showMessage);`

## Validation with Decorators - First Steps

```ts
class Course {
  title: string;
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.querySelector('form')!;
courseForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const titleEl = document.getElementById('title') as HTMLInputElement;
  const priceEl = document.getElementById('price') as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value; // '+' is there to convert to number

  if (title.trim().length > 0) {
  } // can add something like this for validation. Not the best thought

  const createdCourse = new Course(title, price);
  console.log(createdCourse);
});
```

- The `Course` object is still created if the form is empty (title is "" and price is 0)
- We can add validation with `if` checks above `const createdCourse = new Course(title, price);`, but we need to do it every time we create a new Course object

- idea: we have decorators and validate function that does this for us. It can be part of a thid party library

```ts
function Required() {}

function PositiveNumber() {}

function validate(obj: object) {}

class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;
  ...
}
// in event listener we can add
const eventHandler = (e) => {
  // get form stuff and create Course Object
  if (!validate(createdCourse)) {
    alert('Invalid input, please try again!');
    return;
  }
};
```

## Validation with Decorators - Finished

- can access `constructor` prototype of an object which has the name property
  - `obj.constructor.name`
  - this is just JS stuff

```ts
interface ValidatorConfig {
  [property: string]: {
    [valiatableProp: string]: string[]; // ['required', 'positive']
  };
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [...registeredValidators[target.constructor.name][propName], 'required'],
  };
}

function PositiveNumber(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [...registeredValidators[target.constructor.name][propName], 'positive'],
  };
}

function validate(obj: any) {
  const objValidatorConfig = registeredValidators[obj.constructor.name];
  if (!objValidatorConfig) {
    return true;
  }

  let isValid = true;
  for (const prop in objValidatorConfig) {
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case 'required':
          isValid = isValid && !!obj[prop];
          break;
        case 'positive':
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }

  return isValid;
}
```

## Wrap Up

- stuff that uses decorators
  - **class-validator** packages does the validation stuff in our example but more complex / more functionality
    - validates length, is date, is email, etc.
  - **Angular**
  - **NestJs**
    - server side framework
