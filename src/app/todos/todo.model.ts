export enum TodoStatus {
  Backlog = 'backlog',
  InProgress = 'in-progress',
  Done = 'done',
  None = '',
}

export interface ITodo {
  id: string;
  title: string;
  status: TodoStatus;
}
