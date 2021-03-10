// Drag & Drop Interfaces
namespace App {
  export interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
  }

  export interface DragTarget {
    dragOverHandler(event: DragEvent): void;
    dropHanlder(event: DragEvent): void;
    dragLeaveHanlder(event: DragEvent): void;
  }
}
