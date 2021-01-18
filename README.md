# Udemy_Typescript_2020_Course

https://www.udemy.com/course/understanding-typescript/

## Section 5 - Classes and Interfaces

### Classes

- `this` keyword to access class properties (variables)
- `private` and `public` restrict or allow access to properties. `public` by default
- shorthand initialization

  ```ts
  class Fruit {
    name: string;

    constructor(name: string) {
      this.name = name;
    }
  }
  ```

  vs

  ```ts
  class Fruit {
    constructor(public name: string) {}
  }
  ```

- properties with `readonly` can't be written to. (`readonly id: string`)
- class can inherit another classes properties and methods with `extends` keyword. `class Berry extends Fruit{}`
  - use the `super` keyword to call the parent classes constructor
- child classes (subclass) can override properties (implement their own version of a method) by creating a method of the same name of a method in a parent class

  ```ts
  class Fruit {
    constructor(public name: string) {}
    describe() {
      console.log(name);
    }
  }
  class Berry extends Fruit {
    constructor(name: string, private isRound: boolean) {
      super(name);
    }
    describe() {
      console.log('I am a berry - ' + name);
    }
  }
  ```

- `protect` keyword marks property as accessible from the class or subclass

  ```ts
  class Fruit {
    protected traits: string[];
  }
  class Berry extends Fruit {
    addTrait(trait: string){
      traits.push(trait); // OK
    }
  }

  const blueberry = New Berry('blueberry');
  blueberry.addTrait('blue');
  console.log(blueberry.traits); // NOT ALLOWED
  ```

- `static` methods and properties can be accessed on the class itself and not on an instance of the class

  ```ts
  class Fruit {
    static definition = 'Seed(s) surrounded by fleshy pulp';
    static createFruit(name: string) {
      return { name: name };
    }
  }
  const aFruit = Fruit.createFruit('blueberry'); // OK
  console.log(Fruit.definition); // OK

  const blueberry = new Fruit({ ...aFruit });
  console.log(blueberry.definition); // NOT OK
  ```

- `abstract` keywords forces subclasses to implement the property for themselves
  - the base class must not implement the method
  - `abstract` needs to be infront of the class definition and method
  ```ts
  abstract class Fruit {
    constructor(public name: string) {}
    abstract describe(): void;
  }
  ```
- `private constructor`'s can be used to allow only one instance of a class. The `private` keyword makes the constructor not accessible from outside the class

  ```ts
  class AccountingDepartment extends Department {
    private static instance: AccountingDepartment;

    private constructor(id: string, private reports: string[]) {
      super(id, 'Accounting');
      this.lastReport = reports[0];
    }

    static getInstance() {
      if (AccountingDepartment.instance) {
        return this.instance;
      }
      this.instance = new AccountingDepartment('d2', []);
      return this.instance;
    }
  }

  const accounting = AccountingDepartment.instance();
  ```
