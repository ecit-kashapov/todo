export enum TodoStatus {
  Backlog = 'Backlog',
  InProgress = 'InProgress',
  Done = 'Done',
}

export interface ITodo {
  id: string;
  title: string;
  status: TodoStatus;
}
