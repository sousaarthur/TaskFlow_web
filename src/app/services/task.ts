import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Task {
  private url = "http://localhost:8080/task";

  constructor(
    private http:HttpClient
  ){}

  createTask(data:any):Observable<any>{
    return this.http.post(this.url, data);
  }

  listTask(page: number =0, size:number = 5, completed?: boolean):Observable<any>{
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);
    if (completed !== undefined) {
      params = params.set('completed', completed);
    }
    return this.http.get(this.url + "/list", { params });
  }

  deleteTask(id:number):Observable<any>{
    return this.http.delete(this.url + `/${id}`);
  }

  updateTask(data:any):Observable<any>{
    return this.http.put(this.url, data);
  }

  getStatsTask():Observable<any>{
    return this.http.get(this.url + "/stats");
  }
}  