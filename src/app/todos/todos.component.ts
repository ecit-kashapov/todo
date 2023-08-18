import { Component, OnDestroy, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';

import { TodoService } from './todo.service';
import { ITodo, TodoStatus } from './todo.model';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit, OnDestroy {
  todos: ITodo[] = [];
  subscriptionTodoChanges: Subscription;
  readonly TodoStatus = TodoStatus;

  constructor(private todoService: TodoService) {}

  drop(event: CdkDragDrop<ITodo[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const todoToUpdate = event.previousContainer.data[event.previousIndex];
      const newStatus = event.container.id;

      this.todoService.updateTodoFB(todoToUpdate.id, {
        ...todoToUpdate,
        status: newStatus as TodoStatus
      })
    }
  }

  ngOnInit(): void {
    this.subscribeToTodoChanges();
    // this.fetchTodos();
    this.todoService.fetchTodosFB();
  }

  private subscribeToTodoChanges(): void {
    this.subscriptionTodoChanges = this.todoService.todosChanged
      .subscribe(
        (updatedTodos: ITodo[]) => {
          this.todos = updatedTodos;
        }
      );
  }

  // private fetchTodos(): void {
  //   this.todoService.getTodos().subscribe((todos) =>{
  //     this.todos = todos;
  //   });
  // }

  getFilteredTodos(todoStatus: TodoStatus): ITodo[] {
    return this.todos.filter(todo => todo.status === todoStatus);
  }

  ngOnDestroy(): void {
    this.subscriptionTodoChanges.unsubscribe();
  }
}
