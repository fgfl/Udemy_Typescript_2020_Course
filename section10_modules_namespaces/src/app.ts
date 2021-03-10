/// <reference path="drag-drop-interfaces.ts"/>
/// <reference path="project-model.ts"/>

namespace App {
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

  // -----
  // Project State Management
  type ListenerFn<T> = (prjs: T[]) => void;

  class State<T> {
    protected listeners: ListenerFn<T>[] = [];

    addListener(listenerFn: ListenerFn<T>) {
      this.listeners.push(listenerFn);
    }
  }

  class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
      super();
    }

    static getInstance() {
      if (!this.instance) {
        this.instance = new ProjectState();
      }
      return this.instance;
    }

    addProject(title: string, description: string, numOfPeople: number) {
      const newProject = new Project(
        Math.random().toString(),
        title,
        description,
        numOfPeople,
        ProjectStatus.ACTIVE
      );
      this.projects.push(newProject);
      this.updateListeners();
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
      const project = this.projects.find((prj) => prj.id === projectId);
      if (project && project.status !== newStatus) {
        project.status = newStatus;
        this.updateListeners();
      }
    }

    updateListeners() {
      for (const listenerFn of this.listeners) {
        listenerFn(this.projects.slice());
      }
    }
  }

  const projectState = ProjectState.getInstance();

  // -----
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

  // -----
  /**
   * @template T host element type
   * @template U the inserted element type
   */
  abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateEl: HTMLTemplateElement;
    hostEl: T;
    element: U;

    constructor(
      templateId: string,
      hostElementId: string,
      insertAtStart: boolean,
      newElementId?: string
    ) {
      this.templateEl = document.getElementById(templateId)! as HTMLTemplateElement;
      this.hostEl = document.getElementById(hostElementId)! as T;

      const importedNode = document.importNode(this.templateEl.content, true);
      this.element = importedNode.firstElementChild as U;
      if (newElementId) {
        this.element.id = newElementId;
      }

      this.attach(insertAtStart);
    }

    private attach(insertAtBeginning: boolean) {
      this.hostEl.insertAdjacentElement(
        insertAtBeginning ? 'afterbegin' : 'beforeend',
        this.element
      );
    }

    abstract configure(): void;
    abstract renderContent(): void;
  }

  // -----
  // Project List Item Class
  class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project;

    get persons() {
      if (this.project.people === 1) {
        return '1 person';
      }
      return `${this.project.people} persons`;
    }

    constructor(hostId: string, project: Project) {
      super('single-project', hostId, false, project.id);
      this.project = project;

      this.configure();
      this.renderContent();
    }

    configure() {
      this.element.addEventListener('dragstart', this.dragStartHandler);
      this.element.addEventListener('dragend', this.dragEndHandler);
    }

    renderContent() {
      this.element.querySelector('h2')!.textContent = this.project.title;
      this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
      this.element.querySelector('p')!.textContent = this.project.description;
    }

    @Autobind
    dragStartHandler(event: DragEvent) {
      event.dataTransfer!.setData('text/plain', this.project.id);
      event.dataTransfer!.effectAllowed = 'move';
    }

    dragEndHandler(_event: DragEvent) {
      console.log('drag end');
    }
  }

  // -----
  // ProjectList Class
  class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished') {
      super('project-list', 'app', false, `${type}-projects`);
      this.assignedProjects = [];

      this.configure();
      this.renderContent();
    }

    configure() {
      projectState.addListener((projects: Project[]) => {
        const relevantProjects = projects.filter((prj) =>
          this.type === 'active'
            ? prj.status === ProjectStatus.ACTIVE
            : prj.status === ProjectStatus.FINISHED
        );
        this.assignedProjects = relevantProjects;
        this.renderProjects();
      });

      this.element.addEventListener('drop', this.dropHanlder);
      this.element.addEventListener('dragover', this.dragOverHandler);
      this.element.addEventListener('dragleave', this.dragLeaveHanlder);
    }

    renderContent() {
      const listId = `${this.type}-projects-list`;
      this.element.querySelector('ul')!.id = listId;
      this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    @Autobind
    dragLeaveHanlder(_event: DragEvent) {
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.remove('droppable');
    }

    @Autobind
    dragOverHandler(event: DragEvent) {
      if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
        // need to prevent default to allow dropping. Default JS behaviour is to not allow dropping
        event.preventDefault();
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.add('droppable');
      }
    }

    @Autobind
    dropHanlder(event: DragEvent) {
      event.preventDefault(); // Needed for Firefox to stop trying to open a new page
      const prjId = event.dataTransfer!.getData('text/plain');
      projectState.moveProject(
        prjId,
        this.type === 'active' ? ProjectStatus.ACTIVE : ProjectStatus.FINISHED
      );
    }

    private renderProjects() {
      const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
      listEl.innerHTML = '';
      for (const project of this.assignedProjects) {
        new ProjectItem(this.element.querySelector('ul')!.id, project);
      }
    }
  }

  // ------
  // ProjectInput Class
  class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

  new ProjectInput();
  new ProjectList('active');
  new ProjectList('finished');
}
