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

function add(a: Combinable, b: Combinable) {
  if (typeof a == 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}

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