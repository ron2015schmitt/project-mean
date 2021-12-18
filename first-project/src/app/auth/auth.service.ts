import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  isAuthenticated = false;

  constructor(private http: HttpClient) { }

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
    this.http.post<{token}>(environment.apiUrl + '/user/login', authData)
      .subscribe(response => {
        console.log(response);
        this.token = response.token;
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
  }

}
