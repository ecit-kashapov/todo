import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment'; // Adjust the path as needed
import { ITodo } from './todo.model';

interface ResponseData {
  [key: string]: ITodo;
}

@Injectable()
export class TodoService {
  todosChanged: Subject<ITodo[]> = new Subject<ITodo[]>();
  isFetching: boolean = false;

  private todos: ITodo[] = [];

  constructor(private http: HttpClient) {}

  fetchTodosFB() {
    this.isFetching = true;
    this.http
      .get<ResponseData>(`${environment.firebaseUrl}/todos.json`)
      .pipe(
        map( responseData => {
          const todosArr: ITodo[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              todosArr.push({...responseData[key], id: key});
            }
          }
          return todosArr;
        })
      )
      .subscribe(todos => {
        this.todos = todos;
        this.notifyTodosChanged();
        this.isFetching = false;
      })
  }

  getTodo(id: string): ITodo | undefined {
    return this.todos.find(todo => todo.id === id);
  }

  // getTodos(): Observable<ITodo[]> {
  //   return of(this.todos);
  // }

  // addTodo(todo: ITodo): void {
  //   this.todos.push(todo);
  //   this.notifyTodosChanged();
  // }

  addTodoFB(todo: ITodo): void {
    this.isFetching = true;
    this.http
      .post<ITodo>(`${environment.firebaseUrl}/todos.json`, todo)
      .subscribe(() => { this.fetchTodosFB() })
  }

  // updateTodo(id: string, newTodo: ITodo): void {
  //   const index = this.todos.findIndex(todo => todo.id === id);
  //   if (index !== -1) {
  //     this.todos[index] = newTodo;
  //     this.notifyTodosChanged();
  //   }
  // }

  updateTodoFB(id: string, newTodo: ITodo): void {
    this.isFetching = true;
    this.http
      .put<ITodo>(`${environment.firebaseUrl}/todos/${id}.json`, newTodo)
      .subscribe(() => { this.fetchTodosFB() });
  }

  // deleteTodo(id: string): void {
  //   const index = this.todos.findIndex(todo => todo.id === id);
  //   if (index !== -1) {
  //     this.todos.splice(index, 1);
  //     this.notifyTodosChanged();
  //   }
  // }

  deleteTodoFB(id: string): void {
    this.isFetching = true;
    this.http
      .delete<ITodo>(`${environment.firebaseUrl}/todos/${id}.json`)
      .subscribe(() => { this.fetchTodosFB() })
  }

  private notifyTodosChanged(): void {
    this.todosChanged.next([...this.todos]);
  }
}
