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

  private submitHandler(ev: Event) {
    ev.preventDefault();
    console.log(this.titleInputEl.value);
  }

  private configure() {
    this.insertEl.addEventListener('submit', this.submitHandler.bind(this));
  }

  private attach() {
    this.appEl.insertAdjacentElement('afterbegin', this.insertEl);
  }
}

const prjInput = new ProjectInput();
