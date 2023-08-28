import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { finalize } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { ITodo, TodoStatus } from './todo.model';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {
  protected readonly TodoStatus = TodoStatus;
  todos: ITodo[] = [];
  isTodoFetching: boolean = false;

  constructor(translate: TranslateService, private todoService: TodoService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit(): void {
    this.getTodos();
  }

  drop(event: CdkDragDrop<ITodo[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const todoToUpdate: ITodo = event.previousContainer.data[event.previousIndex];
      const newStatus: TodoStatus = event.container.id as TodoStatus;

      this.setIsFetching(true)
      this.todoService.updateTodoFB(todoToUpdate.id, {
        ...todoToUpdate,
        status: newStatus
      })
        .subscribe(() => {
          this.getTodos()
          this.setIsFetching(false)
        })
    }
  }

  setTodos(todos: ITodo[]): void {
    this.todos = todos
  }

  setIsFetching(value: boolean): void {
    this.isTodoFetching = value
  }

  getTodos(): void {
    this.isTodoFetching = true;
    this.todoService.fetchTodosFB().pipe(
      finalize((): boolean => this.isTodoFetching = false)
    ).subscribe({
      next: (todos: ITodo[]): void => {
        this.setTodos(todos);
      },
      error: (error: Error): void => {
        this.todoService.openSnackBar(error.message, 'OK');
      }
    });
  }

  getFilteredTodos(todoStatus: TodoStatus): ITodo[] {
    return this.todos.filter((todo: ITodo): boolean => todo.status === todoStatus);
  }
}
