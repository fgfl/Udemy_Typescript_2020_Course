interface Greetable {
  readonly name: string;

  greet(phrase: string): void;
}

class Person implements Greetable {
  name: string;
  age = 30;

  constructor(n: string) {
    this.name = n;
  }

  greet(phrase: string) {
    console.log(`${phrase} ${this.name}`);
  }
}

let user1: Greetable;

user1 = new Person('Max');
// user1.name = 'Manu'; // can't do b/c name is readonly

user1.greet('Hi my name is');
