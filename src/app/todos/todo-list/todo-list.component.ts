import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  subscriptionTodoChanges: Subscription;
  titleForm: FormGroup;
  editingTodoId: string | null = null;
  readonly TodoStatus = TodoStatus;

  constructor(private todoService: TodoService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.subscribeToTodoChanges();
    this.fetchTodos();
  }

  private initForm() {
    this.titleForm = this.formBuilder.group({
      title: ['']
    })
  }

  private subscribeToTodoChanges() {
    this.subscriptionTodoChanges = this.todoService.todosChanged
      .subscribe(
        (updatedTodos: Todo[]) => {
          this.todos = updatedTodos;
        }
      );
  }

  private fetchTodos() {
    this.todos = this.todoService.getTodos();
  }

  onEditTodo(id: string) {
    this.editingTodoId = id;
    const todo = this.todoService.getTodo(id);
    if (id && todo) {
      this.titleForm.get('title')!.setValue(todo.title);
    }
  }

  onSaveTodo() {
    if (!this.editingTodoId) return

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
    this.subscriptionTodoChanges.unsubscribe();
  }
}
