import {Injectable, OnDestroy, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {User} from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://dummyjson.com/auth/login';
  private readonly TOKEN_KEY = 'auth_token';

  public currentUserSubject = new BehaviorSubject<User | null>(null);
  public isAuthenticatedSubject = new BehaviorSubject(false);

  constructor(private http: HttpClient) {
    this.loadLoggedInUser();
  }

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(this.API_URL, { username, password })
      .pipe(tap(data => {
        if (!data) {
          return;
        }

        localStorage.setItem(this.TOKEN_KEY, data.accessToken);
        localStorage.setItem('user', JSON.stringify(data));
        this.currentUserSubject.next(data);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  isAuthenticated(): any {
    this.loadLoggedInUser();
    return this.isAuthenticatedSubject.value;
  }

  authenticatedSubject(): any {
    this.loadLoggedInUser();
    return this.isAuthenticatedSubject.asObservable();
  }

  private loadLoggedInUser(): void {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      this.currentUserSubject.next(JSON.parse(loggedInUser));
    }

    this.isAuthenticatedSubject.next(!!loggedInUser);
  }
}
