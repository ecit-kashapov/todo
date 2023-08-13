import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

import { ITodo, TodoStatus } from './todo.model';

@Injectable()
export class TodoService {
  todosChanged: Subject<ITodo[]> = new Subject<ITodo[]>();

  private todos: ITodo[] = [
    { id: '1', title: 'Install Angular', status: TodoStatus.Done },
    { id: '2', title: 'Add Edit TODO title', status: TodoStatus.Done },
    { id: '3', title: 'Create basic TODO app', status: TodoStatus.InProgress },
    { id: '4', title: 'Change UI from Bootstrap to Angular material', status: TodoStatus.Backlog },
    { id: '5', title: 'Make UI like microsoft TODO app', status: TodoStatus.Backlog },
    { id: '6', title: 'Add Edit TODO title', status: TodoStatus.Backlog },
    { id: '7', title: 'Add Firebase API', status: TodoStatus.Backlog },
    { id: '8', title: 'Add Drag-n-drop status columns', status: TodoStatus.Backlog },
  ];

  constructor() {}

  getTodo(id: string): ITodo | undefined {
    return this.todos.find(todo => todo.id === id);
  }

  getTodos(): Observable<ITodo[]> {
    return of(this.todos);
  }

  addTodo(todo: ITodo): void {
    this.todos.push(todo);
    this.notifyTodosChanged();
  }

  updateTodo(id: string, newTodo: ITodo): void {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      this.todos[index] = newTodo;
      this.notifyTodosChanged();
    }
  }

  deleteTodo(id: string): void {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      this.notifyTodosChanged();
    }
  }

  private notifyTodosChanged(): void {
    this.todosChanged.next([...this.todos]);
  }
}
