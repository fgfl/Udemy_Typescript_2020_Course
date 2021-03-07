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

// Validation
interface Validatable {
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  max?: number;
  min?: number;
}

interface ValidatableNumber extends Validatable {
  value: number;
}

interface ValidatableString extends Validatable {
  value: string;
}

function validate(validatableInput: ValidatableNumber | ValidatableString) {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
    // != checks if null or undefined
    isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  if (validatableInput.max != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  if (validatableInput.min != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value >= validatableInput.min;
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

    const titleValidatable: ValidatableString = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: ValidatableString = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: ValidatableNumber = {
      value: Number(enteredPeople),
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
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
