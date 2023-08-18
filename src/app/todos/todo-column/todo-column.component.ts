import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { concatMap, finalize } from 'rxjs';

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
  @Input() isTodoFetching:boolean = false;

  @Output() setIsFetching: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() setTodos: EventEmitter<ITodo[]> = new EventEmitter<ITodo[]>();
  @Output() getTodos: EventEmitter<void> = new EventEmitter();

  titleForm: FormGroup;
  translatedColumnName: string;
  editingTodoId: string | null = null;
  readonly TodoStatus = TodoStatus;

  constructor(private translate: TranslateService, private todoService: TodoService, private formBuilder: FormBuilder) {}

  getKeys(obj: any): string[] { return Object.keys(obj); }

  parseTodoStatus(status: string): TodoStatus {
    return TodoStatus[status as keyof typeof TodoStatus];
  }

  ngOnInit(): void {
    this.initTranslate();
    this.initForm();
  }

  private initForm(): void {
    this.titleForm = this.formBuilder.group({
      title: ['']
    })
  }

  private initTranslate(): void {
    this.translate.get(this.columnName).subscribe((translation: string) => {
      this.translatedColumnName = translation;
    });
  }

  onEditTodo(id: string): void {
    this.editingTodoId = id;
    const todo: ITodo | undefined = this.getTodo(id);
    if (id && todo) {
      this.titleForm.get('title')!.setValue(todo.title);
    }
  }

  getTodo(id: string): ITodo | undefined {
    return this.todos.find(todo => todo.id === id);
  }

  onSaveTodoO(): void {
    if (!this.editingTodoId) return;

    const todoToUpdate = this.getTodo(this.editingTodoId);
    if (!todoToUpdate) return;

    const updatedTitle = this.titleForm.value.title;

    this.setIsFetching.emit(true);
    this.todoService
      .updateTodoFB(this.editingTodoId, {
        ...todoToUpdate,
        title: updatedTitle,
      })
      .pipe(
        finalize(() => this.setIsFetching.emit(false)),
        concatMap(() => this.todoService.fetchTodosFB())
      )
      .subscribe({
        next: (todos: ITodo[]) => {
          this.setTodos.emit(todos);
        },
        error: (error) => {
          this.todoService.openSnackBar(error.message, 'OK');
        },
      });

    this.editingTodoId = null;
    this.initForm();
  }

  onUpdateStatusTodo(id: string, newStatus: TodoStatus): void {
    const todoToUpdate: ITodo | undefined = this.getTodo(id);
    if (!todoToUpdate) return

    this.setIsFetching.emit(true)
    this.todoService.updateTodoFB(id, {
      ...todoToUpdate,
      status: newStatus
    }).pipe(
        finalize(() => this.isTodoFetching = false)
      ).subscribe({
        next: () => {
          this.getTodos.emit()
        },
        error: (error) => {
          this.todoService.openSnackBar(error.message, 'OK');
        },
      })
  }

  onDeleteTodo(id: string): void {
    this.setIsFetching.emit(true)
    this.todoService.deleteTodoFB(id)
      .pipe(
        finalize(() => this.isTodoFetching = false)
      ).subscribe({
      next: () => {
        this.getTodos.emit()
      },
      error: (error) => {
        this.todoService.openSnackBar(error.message, 'OK');
      },
    })
  }
}
