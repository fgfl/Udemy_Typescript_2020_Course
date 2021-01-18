class Department {
  // private id: string;
  // private name: string;
  private employees: string[] = [];

  constructor(private readonly id: string, public name: string) {
    // this.name = n;
  }

  describe(this: Department) {
    console.log(`Department id: ${this.id}, ${this.name}`);
  }

  addEmployee(employee: string) {
    // Validation
    this.employees.push(employee);
  }

  printEmployeeInformation() {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}

const accounting = new Department('d1', 'Accounting');
accounting.addEmployee('Max');
accounting.addEmployee('Manu');
// accounting.employees[2] = 'anna'; //bad

accounting.describe();
accounting.name = 'new name'; // possible b/c public variable
accounting.printEmployeeInformation();

// const accountingCopy = { name: 's', describe: accounting.describe };
// accountingCopy.describe();
