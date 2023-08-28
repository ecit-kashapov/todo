import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { TodoService } from '../todos/todo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})

export class AuthComponent implements OnInit  {
  isLoginMode = true;
  isLoading = false;
  authForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private todoService: TodoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.authForm = this.formBuilder.group({
      email: [''],
      password: [''],
    })
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(): void {
    if (this.authForm.status === "INVALID") return;

    const email = this.authForm.value.email
    const password = this.authForm.value.password

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      (): void => {
        this.isLoading = false;
        this.router.navigate(['/todos'])
      },
      error => {
        this.todoService.openSnackBar(error.message, 'OK');
        this.isLoading = false;
      }
    )

    this.initForm();
  }









}
