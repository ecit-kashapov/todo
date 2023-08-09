export type TodoStatus = 'backlog' | 'in-progress' | 'done' | '';

export class Todo {
  constructor(
    public id: string,
    public title: string,
    public status: TodoStatus
  ){  }
}
