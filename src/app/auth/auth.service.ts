import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { User } from './user.model';
import { environment } from '../../environments/environment';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(`${environment.firebaseLoginUrl}?key=${environment.firebaseApiKey}`, {
      email: email,
      password: password,
      returnSecureToken: true,
    })
      .pipe(
        tap(resData => {
          this.handleAuth(resData.localId, resData.email, resData.idToken, +resData.expiresIn);
        })
      )
  }

  signup(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(`${environment.firebaseSignupUrl}?key=${environment.firebaseApiKey}`, {
      email: email,
        password: password,
        returnSecureToken: true,
    })
      .pipe(
        tap(resData => {
          this.handleAuth(resData.localId, resData.email, resData.idToken, +resData.expiresIn);
        })
      )
  }

  logout(): void {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration)
  }

  autoLogin(): void {
    const userCookie: string | null = localStorage.getItem('userData');
    if (!userCookie) {
      return;
    }
    const userData: {
      id: string;
      email: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(userCookie);

    const loadedUser: User = new User(userData.id,userData.email, userData._token, new Date(userData._tokenExpirationDate));

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration: number = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  private handleAuth(userId: string, email: string, token: string, expiresIn: number): void {
    const expirationDate: Date = new Date( new Date().getTime() + +expiresIn * 1000);

    const user: User = new User(
      userId,
      email,
      token,
      expirationDate,
    );

    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }









}
