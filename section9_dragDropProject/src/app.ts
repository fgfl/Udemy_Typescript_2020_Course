// autobind decorator
function Autobind(_target: any, _methodName: string | symbol, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const boundMethod: PropertyDescriptor = {
    configurable: true,
    get() {
      return originalMethod.bind(this);
    },
  };
  return boundMethod;
}

interface ValidatorConfig {
  [property: string]: {
    [validatableProp: string]: string[];
  };
}

const registeredValidators: ValidatorConfig = {};

const addValidator = (targetName: string, propName: string, validatorName: string) => {
  registeredValidators[targetName] = {
    ...registeredValidators[targetName],
    [propName]: [...registeredValidators[targetName][propName], validatorName],
  };
};

// validate decorator
function isNonEmptyString(target: any, propName: string) {
  addValidator(target.constructor.name, propName, 'isNonEmptyString');
}

function isValidNumber(target: any, propName: string) {
  addValidator(target.constructor.name, propName, 'isValidNumber');
}

function validate(obj: any) {
  const objValidatorConfig = registeredValidators[obj.constructor.name];
  if (!objValidatorConfig) {
    return true;
  }

  let isValid = true;
  for (const prop in objValidatorConfig) {
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case 'isNonEmptyString':
          isValid = isValid && obj[prop].trim().length > 0;
          break;
        case 'isValidNumber':
          isValid = isValid && +obj[prop] > 0;
          break;
      }
    }
  }

  return isValid;
}

// ------
// ProjectInput Class
class ProjectInput {
  templateEl: HTMLTemplateElement;
  appEl: HTMLDivElement;
  insertEl: HTMLFormElement;

  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLTextAreaElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    this.templateEl = document.getElementById('project-input')! as HTMLTemplateElement;
    this.appEl = document.getElementById('app')! as HTMLDivElement;

    const formNode = document.importNode(this.templateEl.content, true);
    this.insertEl = formNode.firstElementChild as HTMLFormElement;
    this.insertEl.id = 'user-input';

    this.titleInputEl = this.insertEl.querySelector('#title') as HTMLInputElement;
    this.descriptionInputEl = this.insertEl.querySelector('#description') as HTMLTextAreaElement;
    this.peopleInputEl = this.insertEl.querySelector('#people') as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputEl.value;
    const enteredDescription = this.descriptionInputEl.value;
    const enteredPeople = this.peopleInputEl.value;

    if (
      validate({ value: enteredTitle, required: true, minLength: 5 }) &&
      validate({ value: enteredDescription, required: true, minLength: 5 }) &&
      validate({ value: enteredPeople, required: true, minLength: 5 })
    ) {
      alert('Invalid user input, please try again');
      return;
    } else {
      return [enteredTitle, enteredDescription, Number(enteredPeople)];
    }
  }

  private clearInputs() {
    this.titleInputEl.value = '';
    this.descriptionInputEl.value = '';
    this.peopleInputEl.value = '';
  }

  @Autobind
  private submitHandler(ev: Event) {
    ev.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      console.log(title, description, people);
      this.clearInputs();
    }
  }

  private configure() {
    this.insertEl.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    this.appEl.insertAdjacentElement('afterbegin', this.insertEl);
  }
}

const prjInput = new ProjectInput();
