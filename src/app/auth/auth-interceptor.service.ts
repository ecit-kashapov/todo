import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpParams, HttpRequest } from '@angular/common/http';
import { exhaustMap, Observable, take } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        if (!user) {
          return next.handle(request);
        }

        const modifiedRequest: HttpRequest<any> = request.clone({
          params: new HttpParams().set('auth', user?.token ?? '')
        })

        return next.handle(modifiedRequest);
      })

    )
  }
}
