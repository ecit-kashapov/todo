import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TodoService } from '../todo.service';
import { ITodo, TodoStatus } from '../todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit, OnDestroy {
  todos: ITodo[] = [];
  subscriptionTodoChanges: Subscription;
  titleForm: FormGroup;
  editingTodoId: string | null = null;
  readonly TodoStatus = TodoStatus;

  constructor(private todoService: TodoService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.subscribeToTodoChanges();
    this.fetchTodos();
  }

  private initForm(): void {
    this.titleForm = this.formBuilder.group({
      title: ['']
    })
  }

  private subscribeToTodoChanges(): void {
    this.subscriptionTodoChanges = this.todoService.todosChanged
      .subscribe(
        (updatedTodos: ITodo[]) => {
          this.todos = updatedTodos;
        }
      );
  }

  private fetchTodos(): void {
    this.todoService.getTodos().subscribe((todos) =>{
      this.todos = todos;
    });
  }

  onEditTodo(id: string): void {
    this.editingTodoId = id;
    const todo = this.todoService.getTodo(id);
    if (id && todo) {
      this.titleForm.get('title')!.setValue(todo.title);
    }
  }

  onSaveTodo(): void {
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

  onCompleteTodo(id: string): void {
    const todoToUpdate = this.todoService.getTodo(id);

    if (todoToUpdate) {
      this.todoService.updateTodo(id, {
        ...todoToUpdate,
        status: TodoStatus.Done
      })
    }
  }

  onDeleteTodo(id: string): void {
    this.todoService.deleteTodo(id);
  }

  ngOnDestroy(): void {
    this.subscriptionTodoChanges.unsubscribe();
  }
}
