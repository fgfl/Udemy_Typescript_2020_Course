/// <reference path="base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../util/validation.ts" />
/// <reference path="../state/project-state.ts" />

namespace App {
  // ProjectInput Class
  export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputEl: HTMLInputElement;
    descriptionInputEl: HTMLTextAreaElement;
    peopleInputEl: HTMLInputElement;

    constructor() {
      super('project-input', 'app', true, 'user-input');

      this.titleInputEl = this.element.querySelector('#title') as HTMLInputElement;
      this.descriptionInputEl = this.element.querySelector('#description') as HTMLTextAreaElement;
      this.peopleInputEl = this.element.querySelector('#people') as HTMLInputElement;

      this.configure();
    }

    renderContent() {}

    configure() {
      this.element.addEventListener('submit', this.submitHandler);
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
        value: +enteredPeople,
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
        return [enteredTitle, enteredDescription, +enteredPeople];
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
        projectState.addProject(title, description, people);
        this.clearInputs();
      }
    }
  }
}
