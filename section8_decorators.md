# Decorators

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
  - needs a `target` and a `PropertyName` argument
- will execute when property is defined
