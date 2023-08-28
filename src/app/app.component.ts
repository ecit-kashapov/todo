import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { TodoService } from './todos/todo.service';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    translate: TranslateService,
    private todoService: TodoService,
    private authService: AuthService
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit(): void {
    this.authService.autoLogin();
  }
}
