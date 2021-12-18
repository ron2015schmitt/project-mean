import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private tokenTimer: NodeJS.Timer;
  private authStatusListener = new Subject<boolean>();
  isAuthenticated = false;
  isLoading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password } as AuthData;
    console.log(`authService.createUser: authData:`, authData);
    this.http.post(environment.apiUrl + '/user/signup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password } as AuthData;
    console.log(`authService.login: authData:`, authData);
    this.http.post<{ token: string, expiresIn: number }>(
      environment.apiUrl + '/user/login',
      authData,
    ).subscribe(response => {
      console.log(response);
      const token = response.token;
      this.token = token;
      if (token) {
        const expiresInDuration = response.expiresIn;
        // console.log(expiresInDuration);
        this.tokenTimer = setTimeout(() => {
          this.logout();
        },
          1000 * expiresInDuration
        );
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      }
    });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }

}
