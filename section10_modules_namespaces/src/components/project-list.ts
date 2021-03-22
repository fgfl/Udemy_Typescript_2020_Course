/// <reference path="base-component.ts" />
/// <reference path="project-item.ts" />

namespace App {
  // ProjectList Class
  export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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
}
