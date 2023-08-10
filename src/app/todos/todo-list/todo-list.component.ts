import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TodoService } from '../todo.service';
import { Todo, TodoStatus } from '../todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];
  // @ts-ignore
  subscription: Subscription;
  // @ts-ignore
  titleForm: FormGroup;
  editingTodoId: string | null = null;
  readonly TodoStatus = TodoStatus;

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.initForm();
    this.subscription = this.todoService.todosChanged
      .subscribe(
        (updatedTodos: Todo[]) => {
          this.todos = updatedTodos;
        }
      );
    this.todos = this.todoService.getTodos();
  }

  private initForm() {
    const title = '';

    this.titleForm = new FormGroup({
      'title': new FormControl(title),
    });
  }

  onEditTodo(id: string) {
    this.editingTodoId = id;

    if (id) {
      const todo = this.todoService.getTodo(id);
      this.titleForm.get('title')!.setValue(todo.title);
    }
  }

  onSaveTodo() {
    if (this.editingTodoId) {
      const todoToUpdate = this.todoService.getTodo(this.editingTodoId);

      if (todoToUpdate) {
        const updatedTitle = this.titleForm.value.title;

        this.todoService.updateTodo(this.editingTodoId, {
          ...todoToUpdate,
          title: updatedTitle
        })
      }

      this.editingTodoId = null;
      this.initForm();
    }
  }

  onCompleteTodo(id: string) {
    const todoToUpdate = this.todoService.getTodo(id);

    if (todoToUpdate) {
      this.todoService.updateTodo(id, {
        ...todoToUpdate,
        status: TodoStatus.Done
      })
    }
  }

  onDeleteTodo(id: string) {
    this.todoService.deleteTodo(id);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
