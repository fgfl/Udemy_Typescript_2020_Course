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

type Combinable = string | number;
type Numermic = number | boolean;

type Universal = Combinable & Numermic;

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

// ====

type UnknownEmployee = Employee | Admin;

function printEmployeeInformtion(emp: UnknownEmployee) {
  console.log('Name: ', emp.name);
  if ('privileges' in emp) {
    console.log('Privileges: ', emp.privileges);
  }
  if ('startDate' in emp) {
    console.log('Start date: ', emp.startDate);
  }
}

printEmployeeInformtion(e1);

class Car {
  drive() {
    console.log('Driving...');
  }
}

class Truck {
  drive() {
    console.log('Driving truck...');
  }

  loadCargo(amount: number) {
    console.log('Loading cargo...' + amount);
  }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();
  if (vehicle instanceof Truck) {
    vehicle.loadCargo(1000);
  }
}

useVehicle(v1);
useVehicle(v2);

// =====
interface Bird {
  type: 'bird';
  flyingSpeed: number;
}

interface Horse {
  type: 'horse';
  runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  let speed;
  switch (animal.type) {
    case 'bird':
      speed = animal.flyingSpeed;
      break;
    case 'horse':
      speed = animal.runningSpeed;
  }
  console.log('Moving with speed: ', speed);
}

//====
// const userInputElement = <HTMLInputElement>document.getElementById('user-input');
const userInputElement = document.getElementById('user-input');

console.log(userInputElement);
if (userInputElement) {
  (userInputElement as HTMLInputElement).value = 'Hi there!';
}

// ====
interface ErrorContainer {
  // { email: 'email error', name: 'name error'}
  [prop: string]: string;
}

const errorBag: ErrorContainer = {
  email: 'Not a valid email!',
  username: 'Must start with a capital letter!',
};

// ===
const fetchedUserData = {
  id: 'u1',
  name: 'Max',
  job: { title: 'CEO', description: 'My own Compa y' },
};

console.log(fetchedUserData?.job?.title);

// ===
const userInput = null;
const storedData = userInput ?? 'DEFAULT';

console.log(storedData);
