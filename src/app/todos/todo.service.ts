import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

import { ITodo, TodoStatus } from './todo.model';

@Injectable()
export class TodoService {
  todosChanged: Subject<ITodo[]> = new Subject<ITodo[]>();

  private todos: ITodo[] = [
    { id: '2', title: 'Add Edit TODO title', status: TodoStatus.Done },
    { id: '3', title: 'Create basic TODO app', status: TodoStatus.InProgress },
    { id: '4', title: 'Change UI from Bootstrap to Angular material', status: TodoStatus.Backlog },
  ];

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
