import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { TodoService } from '../todo.service';
import { TodoStatus } from '../todo.model';

@Component({
  selector: 'app-new-todo-form',
  templateUrl: './new-todo-form.component.html',
  styleUrls: ['./new-todo-form.component.scss']
})
export class NewTodoFormComponent implements OnInit {
  todoForm: FormGroup;

  constructor(private todoService: TodoService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  onSubmit() {
    this.todoService.addTodo(this.todoForm.value);
    this.initForm();
  }

  private initForm() {
    this.todoForm = this.formBuilder.group({
      id: [Date.now().toString],
      title: [''],
      status: [TodoStatus.Backlog]
    })
  }
}
