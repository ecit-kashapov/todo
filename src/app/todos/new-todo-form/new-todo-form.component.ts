import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { TodoService } from '../todo.service';
import { TodoStatus } from '../todo.model';

@Component({
  selector: 'app-new-todo-form',
  templateUrl: './new-todo-form.component.html',
  styleUrls: ['./new-todo-form.component.scss']
})
export class NewTodoFormComponent implements OnInit {
  // @ts-ignore
  todoForm: FormGroup;

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.initForm();
  }

  onSubmit() {
    this.todoService.addTodo(this.todoForm.value);
    this.initForm();
  }

  private initForm() {
    const id = Date.now().toString();
    const title = '';
    const status = TodoStatus.Backlog;

    this.todoForm = new FormGroup({
      'id': new FormControl(id),
      'title': new FormControl(title),
      'status': new FormControl(status),
    });
  }
}
