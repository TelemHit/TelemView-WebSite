import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataForHome } from '../_models/dataForHome';

@Injectable({
  providedIn: 'root'
})
export class DataForHomeService {

baseUrl = environment.apiUrl;

constructor(private http: HttpClient) { }

getData(): Observable<DataForHome[]>{
  return this.http.get<DataForHome[]>(this.baseUrl + 'home');
}
}
