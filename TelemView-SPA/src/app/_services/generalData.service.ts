import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataForHome } from '../_models/dataForHome';
import { GeneralData } from '../_models/generalData';
import { OrganizationForUpdate } from '../_models/OrganizationForUpdate';

@Injectable({
  providedIn: 'root',
})
export class GeneralDataService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getData(): Observable<DataForHome[]> {
    return this.http.get<DataForHome[]>(this.baseUrl + 'generaldata');
  }

  updateStudent(userId: number, data: GeneralData) {
    return this.http.put(
      this.baseUrl + 'generalData/editor/updateStudent/' + userId,
      data
    );
  }
  updateLecturer(userId: number, data: GeneralData) {
    return this.http.put(
      this.baseUrl + 'generalData/editor/updateLecturer/' + userId,
      data
    );
  }
  updateTag(userId: number, data: GeneralData) {
    return this.http.put(
      this.baseUrl + 'generalData/editor/updateTag/' + userId,
      data
    );
  }
  updateCourse(userId: number, data: GeneralData) {
    return this.http.put(
      this.baseUrl + 'generalData/editor/updateCourse/' + userId,
      data
    );
  }
  updateOrganization(userId: number, data: OrganizationForUpdate) {
    return this.http.put(
      this.baseUrl + 'generalData/editor/updateOrganization/' + userId,
      data
    );
  }
}
