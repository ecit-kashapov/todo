import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Todo, TodoStatus } from './todo.model';

@Injectable()
export class TodoService {
  todosChanged = new Subject<Todo[]>();

  private todos: Todo[] = [
    new Todo( '1', 'Install Angular', TodoStatus.Done),
    new Todo( '2', 'Add Edit TODO title', TodoStatus.Done),
    new Todo( '3', 'Create basic TODO app', TodoStatus.InProgress),
    new Todo( '4', 'Change UI from Bootstrap to Angular material', TodoStatus.Backlog),
    new Todo( '5', 'Make UI like microsoft TODO app', TodoStatus.Backlog),
    new Todo( '6', 'Add Edit TODO title', TodoStatus.Backlog),
    new Todo( '7', 'Add Firebase API', TodoStatus.Backlog),
    new Todo( '8', 'Add Drag-n-drop status columns', TodoStatus.Backlog),
  ];

  constructor() {}

  getTodo(id: string): Todo | undefined {
    return this.todos.find(todo => todo.id === id);
  }

  getTodos(): Todo[] {
    return [...this.todos];
  }

  addTodo(todo: Todo): void {
    this.todos.push(todo);
    this.notifyTodosChanged();
  }

  updateTodo(id: string, newTodo: Todo): void {
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
