import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  title: string;
  isAuth = false;

  constructor(private translateService: TranslateService, private authService: AuthService) {
    this.translateService.get('app-title').subscribe((translation: string) => {
      this.title = translation;
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(user => {
      this.isAuth = !!user;
    });
  }
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
