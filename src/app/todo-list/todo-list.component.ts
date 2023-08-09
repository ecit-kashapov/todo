import { Component } from '@angular/core';

import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent {
  editingTodoId: string | null = null;

  todos: Todo[] = [
    { id: '1', title: 'Install Angular', status: 'done'},
    { id: '2', title: 'Add Edit TODO title', status: 'done'},
    { id: '3', title: 'Create basic TODO app', status: 'in-progress'},
    { id: '4', title: 'Change UI from Bootstrap to Angular material', status: 'backlog'},
    { id: '5', title: 'Make UI like microsoft TODO app', status: 'backlog'},
    { id: '6', title: 'Add Edit TODO title', status: 'backlog'},
    { id: '7', title: 'Add Firebase API', status: 'backlog'},
    { id: '8', title: 'Add Drag-n-drop status columns', status: 'backlog'},
  ];

  addTodo(newTodoTitle: string) {
    if (newTodoTitle.trim() === '') {
      return;
    }

    const newTodo = new Todo(
      Date.now().toString(),
      newTodoTitle,
      'backlog'
    );

    this.todos.push(newTodo);
  }

  completeTodo(id: string) {
    let todo = this.todos.filter(x=>x.id === id)[0];
    todo.status = 'done';
  }

  editTodo(id: string | null) {
    this.editingTodoId = id;
  }

  deleteTodo(id: string) {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index > -1) {
      this.todos.splice(index, 1);
    }
  }

}
