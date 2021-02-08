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

class DataStorage<T extends string | number | boolean> {
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

const textStorage = new DataStorage<string>();
textStorage.addItem('Max');
textStorage.addItem('Manu');
textStorage.removeItem('Max');
console.log(textStorage.getItems());

const numberStorage = new DataStorage<number>();

// const objStorage = new DataStorage<object>();
// objStorage.addItem({ name: 'Max' });
// objStorage.addItem({ name: 'Manu' });
// objStorage.removeItem({ name: 'Max' }); // doesn't remove the same object
// console.log(objStorage.getItems());

// const maxObj = { name: 'Max2' };
// objStorage.addItem(maxObj);
// objStorage.removeItem(maxObj); // this works because the object has the same reference

interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}

function createCourseGoal(title: string, description: string, date: Date): CourseGoal {
  let courseGoal: Partial<CourseGoal> = {};
  courseGoal.title = title;
  courseGoal.description = description;
  courseGoal.completeUntil = date;
  return courseGoal as CourseGoal;
}

const names: Readonly<string[]> = ['Max', 'Anna'];
// names.push('Manu');
// names.pop();

let test: Readonly<number> = 5;
console.log(test);
test = 6;
console.log(test);
