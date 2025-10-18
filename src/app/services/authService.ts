import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "http://localhost:8080/auth/";

  constructor(private http:HttpClient){}

  isLoggedIn():boolean {
    return !!localStorage.getItem('token');
  }

  register(data:any):Observable<any>{
    return this.http.post(this.url + "register", data);
  }

  login(data:any):Observable<any>{
    return this.http.post(this.url + "login", data);
  }
}
