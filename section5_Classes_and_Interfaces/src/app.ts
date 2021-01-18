class Department {
  static fiscalYear = 2020;
  // private id: string;
  // private name: string;
  protected employees: string[] = [];

  constructor(private readonly id: string, public name: string) {
    // this.id = id;
    // this.name = n;
    // console.log(Department.fiscalYear);
  }

  static createEmployee(name: string) {
    return { name: name };
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
  private lastReport: string;

  get mostRecentReport() {
    if (this.lastReport) {
      return this.lastReport;
    }
    throw new Error('No report found');
  }

  set mostRecentReport(value: string) {
    if (!value) {
      throw new Error('Please pass in a valid value');
    }
    this.addReport(value);
  }

  constructor(id: string, private reports: string[]) {
    super(id, 'Accounting');
    this.lastReport = reports[0];
  }

  addEmployee(name: string) {
    if (name === 'Max') {
      return;
    }
    this.employees.push(name);
  }

  addReport(text: string) {
    this.reports.push(text);
    this.lastReport = text;
  }

  printReports() {
    console.log(this.reports);
  }
}

const employee1 = Department.createEmployee('Max');
console.log(employee1);

const it = new ITDepartment('d1', ['Max']);
const accounting = new AccountingDepartment('d2', []);
accounting.addEmployee('Max');
accounting.addEmployee('Manu');
// accounting.employees[2] = 'anna'; //bad

accounting.describe();
accounting.name = 'new name'; // possible b/c public variable
accounting.printEmployeeInformation();

accounting.mostRecentReport = 'Year end report';
accounting.addReport('Something is wrong?');
accounting.printReports();
console.log(accounting.mostRecentReport);

console.log(it);

// const accountingCopy = { name: 's', describe: accounting.describe };
// accountingCopy.describe();
