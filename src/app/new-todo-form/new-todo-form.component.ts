import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-new-todo-form',
  templateUrl: './new-todo-form.component.html',
  styleUrls: ['./new-todo-form.component.scss']
})
export class NewTodoFormComponent {
  newTodoTitle: string = '';

  @Output() addTodo = new EventEmitter<string>();

  submitForm() {
    if (this.newTodoTitle.trim() === '') {
      return;
    }

    this.addTodo.emit(this.newTodoTitle);
    this.newTodoTitle = '';
  }
}
