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
