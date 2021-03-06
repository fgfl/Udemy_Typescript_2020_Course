# Generics

## Built-in Generics

- type that is connected to another type
- example `Array` or `Promise` type
- shown as `Array<T>` and `Promise<T>`
- `Array<string>` === `string[]`
- above tells TS that the array is of type string. It will give errrors if we try to call non string functions on the data in the array

## Creating a Generic Function

```ts
function merge(objA: object, objB: object) {
  return Object.assign(objA, objB);
}
const mergedObj = merge({ name: 'Max' }, { age: 30 });
mergeObj.name; // TS error. No `name` prop on object type

const mergedObj = merge({ name: 'Max' }, { age: 30 } as { name: string; age: number });
```

- can use the above to tell TS that mergedObj has the `name` and `age` property, but it's cumbersome
- usually use a single character to represent the generic type. Usually use `T` for type and `U` as the next generic type. `U` is the next letter

```ts
function merge<T, U>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}
```

- above returns an object with the type of intersection of `T` and `U`
- TS will infer the types of `T` and `U` given the arguments on the function

## Work with Constraints

`const mergedObj = merge({ name: 'Max' }, 30);`

- above will fail silently because `30` is not an object that can be used in the `Object.assign` function. The resulting object will not have `30` in it.
- can use type contraints
  `function merge<T extends object, U extends object>(objA: T, objB: U) {}`
- extend the generic types to be of the type you want to contrain to. in this case an object type.
- trying to merge `30` with an object now will throw a TS error

## Another Generic Function

```ts
interface Lengthy {
  length: number;
}

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  let descriptonText = 'Got no value.';
  if (element.length === 0) {
    descriptonText = 'Got 1 element.';
  } else if (element.length > 1) {
    descriptonText = 'Got ' + element.length + ' elements.';
  }
  return [element, descriptonText];
}
```

- need to extend the interface `Lengthy` to guarantee that the `element` argument has the `.length` property. If we don't extend `Lengthy` then TS will throw error on `element.length` b/c generic type `T` doesn't have the `length` property
- now we can pass in anything that has a `.length` property. It can be a string, array, or custom class we created.

## The "keyof" Constraint

```ts
function extractAndConvert(obj: object, key: string) {
  return 'Value: ' + obj[key];
}
```

- can't call the `key` prop of `obj` b/c there is no guarantee that `obj` has a `key` prop
  - TS error is: **Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'.**

```ts
function extractAndConvert<T extends object, U extends keyof T>(obj: T, key: U) {
  return 'Value: ' + obj[key];
}
```

- can use generics to force the `key` arguement to be a _keyof_ the first argument `obj`

## Generic Classes

- Can apply generic types to classes

```ts
class DataStorage<T> {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItems() {
    return [...this.data];
  }
}
```

- the problem with the above class is that it doesn't handle `object` types well. If we don't pass in the same reference to the object, it can't find the correct object to remove
  - We can instead specify that this class can't be created to hold objects
    `class DataStorage<T extends string | number | boolean> { ... }`
- generics give us flexibility and type safety

## Generic Utility Types

https://www.typescriptlang.org/docs/handbook/utility-types.html

- **`Partial`** makes all the properties optional

  - contrived example: We use `Partial` to be able to assign object properties separately

  ```ts
  function createCourseGoal(title: string, description: string, date: Date): CourseGoal {
    let courseGoal: Partial<CourseGoal> = {};
    courseGoal.title = title;
    courseGoal.description = description;
    courseGoal.completeUntil = date;
    return courseGoal as CourseGoal;
  }
  ```

- **`Readonly`** makes it so you can't change the property of objects or arrays

```ts
const names: Readonly<string[]> = ['Max', 'Anna'];
names.push('Manu'); // push and pop with throw TS error. We are changing the array
names.pop();

let test: Readonly<number> = 5;
console.log(test); // 5
test = 6; // This is only. `test` will be changed without errors
console.log(test); // 6
```

## Generic Types vs Union Types

- Union types is good if we want to be able to call/create something with that can be of any of the specified types at any time
- Generic types are good if we want to lock down the type to one specific thing, but it allows us to specify the exact type throughout the whole class or object
