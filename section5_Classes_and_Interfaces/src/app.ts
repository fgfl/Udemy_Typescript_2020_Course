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

class ITDepartment extends Department {
  adminds: string[];
  constructor(id: string, admins: string[]) {
    super(id, 'IT');
    this.adminds = admins;
  }
}

class AccountingDepartment extends Department {
  constructor(id: string, private reports: string[]) {
    super(id, 'Accounting');
  }

  addReport(text: string) {
    this.reports.push(text);
  }

  printReports() {
    console.log(this.reports);
  }
}

const it = new ITDepartment('d1', ['Max']);
const accounting = new AccountingDepartment('d2', []);
accounting.addEmployee('Max');
accounting.addEmployee('Manu');
// accounting.employees[2] = 'anna'; //bad

accounting.describe();
accounting.name = 'new name'; // possible b/c public variable
accounting.printEmployeeInformation();

accounting.addReport('Something is wrong?');
accounting.printReports();

console.log(it);

// const accountingCopy = { name: 's', describe: accounting.describe };
// accountingCopy.describe();
