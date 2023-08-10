export enum TodoStatus {
  Backlog = 'backlog',
  InProgress = 'in-progress',
  Done = 'done',
  None = '',
}

export class Todo {
  public id: string;
  public title: string;
  public status: TodoStatus;

  constructor(id: string, title: string, status: TodoStatus) {
    this.id = id;
    this.title = title;
    this.status = status;
  }
}
