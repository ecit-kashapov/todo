import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { TodoService } from '../todo.service';
import { ITodo, TodoStatus } from '../todo.model';

@Component({
  selector: 'app-todo-column',
  templateUrl: './todo-column.component.html',
  styleUrls: ['./todo-column.component.scss']
})
export class TodoColumnComponent implements OnInit {
  @Input() columnName: TodoStatus;
  @Input() todos:ITodo[] = [];

  titleForm: FormGroup;
  translatedColumnName: string;
  editingTodoId: string | null = null;
  readonly TodoStatus = TodoStatus;

  constructor(private translate: TranslateService, private todoService: TodoService, private formBuilder: FormBuilder) {}

  get isFetching(): boolean {
    return this.todoService.isFetching;
  }

  getKeys(obj: any): string[] { return Object.keys(obj); }

  parseTodoStatus(status: string): TodoStatus {
    return TodoStatus[status as keyof typeof TodoStatus];
  }

  ngOnInit(): void {
    this.translate.get(this.columnName).subscribe((translation: string) => {
      this.translatedColumnName = translation;
    });
    this.initForm();
  }

  private initForm(): void {
    this.titleForm = this.formBuilder.group({
      title: ['']
    })
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

      this.todoService.updateTodoFB(this.editingTodoId, {
        ...todoToUpdate,
        title: updatedTitle
      })
    }

    this.editingTodoId = null;
    this.initForm();
  }

  onUpdateStatusTodo(id: string, newStatus: TodoStatus): void {
    const todoToUpdate = this.todoService.getTodo(id);

    if (todoToUpdate) {
      this.todoService.updateTodoFB(id, {
        ...todoToUpdate,
        status: newStatus
      })
    }
  }

  onDeleteTodo(id: string): void {
    this.todoService.deleteTodoFB(id);
  }
}
