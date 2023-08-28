import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from '../../environments/environment';
import { ITodo } from './todo.model';

interface ResponseData {
  [key: string]: ITodo;
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
  ) {}

  fetchTodosFB(): Observable<ITodo[]> {
    return this.http
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
  }

  addTodoFB(todo: ITodo): Observable<ITodo> {
    return this.http
      .post<ITodo>(`${environment.firebaseUrl}/todos.json`, todo);
  }

  updateTodoFB(id: string, newTodo: ITodo): Observable<ITodo> {
    return this.http
      .put<ITodo>(`${environment.firebaseUrl}/todos/${id}.json`, newTodo);
  }

  deleteTodoFB(id: string): Observable<ITodo> {
    return this.http
      .delete<ITodo>(`${environment.firebaseUrl}/todos/${id}.json`);
  }

  openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action);
  }
}
