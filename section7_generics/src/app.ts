// == Built in Generics
// const names: Array<string> = ['Max', 'Manuel']; // string[]

// const promise: Promise<string> = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('This is done!');
//   }, 2000);
// });

// promise.then((data) => {
//   data.split(' ');
// });

function merge<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}

const mergedObj = merge({ name: 'Max' }, { age: 30 });
console.log(mergedObj);

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

console.log(countAndDescribe('Hi There!'));
console.log(countAndDescribe(['Sport', 'Ball']));

// == The "keyof" Constraint
function extractAndConvert<T extends object, U extends keyof T>(obj: T, key: U) {
  return 'Value: ' + obj[key];
}

// extractAndConvert({}, 'name'); // error
extractAndConvert({ name: 'Max' }, 'name');
