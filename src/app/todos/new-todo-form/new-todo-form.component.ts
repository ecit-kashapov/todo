import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  @Output() setIsFetching: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() getTodos: EventEmitter<void> = new EventEmitter();

  constructor(private todoService: TodoService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit(): void {
    this.setIsFetching.emit(true);
    this.todoService.addTodoFB(this.todoForm.value)
      .subscribe(() => {
        this.setIsFetching.emit(false);
        this.getTodos.emit();
      });
    this.initForm();
  }

  private initForm(): void {
    this.todoForm = this.formBuilder.group({
      id: [Date.now().toString()],
      title: [''],
      status: [TodoStatus.Backlog]
    })
  }
}
