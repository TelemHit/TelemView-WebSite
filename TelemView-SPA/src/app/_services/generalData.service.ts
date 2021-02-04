//service for all general data
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataForEdit } from '../_models/DataForEdit';
import { GeneralData } from '../_models/generalData';
import { OrganizationForUpdate } from '../_models/OrganizationForUpdate';
import { ProductType } from '../_models/productType';
import { Task } from '../_models/task';
import { Organization } from '../_models/organization';
import { OrganizationType } from '../_models/organizationType';
import { Course } from '../_models/Course';
import { Student } from '../_models/Student';
import { Lecturer } from '../_models/lecturer';
import { Tag } from '../_models/Tag';

@Injectable({
  providedIn: 'root',
})
export class GeneralDataService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  //get general data for Edit product page
  getData(): Observable<DataForEdit[]> {
    return this.http.get<DataForEdit[]>(this.baseUrl + 'generaldata');
  }

  // Product types
  getProductTypes(userId: number): Observable<ProductType> {
    return this.http.get<ProductType>(this.baseUrl + 'producttype/' + userId);
  }

  deleteProductType(userId: number, id: number) {
    return this.http.delete(
      this.baseUrl + 'producttype/' + userId + '/' + id,
      {}
    );
  }

  addProductType(userId: number, data: GeneralData) {
    return this.http.post(
      this.baseUrl + 'producttype/' + userId, data
    );
  }

  updateProductType(userId: number, id: number, data: GeneralData) {
    return this.http.put(
      this.baseUrl + 'producttype/' + userId + '/' + id, data
    );
  }

  // Tasks

  getTasks(userId: number): Observable<Task> {
    return this.http.get<Task>(this.baseUrl + 'task/' + userId);
  }

  deleteTask(userId: number, id: number) {
    return this.http.delete(
      this.baseUrl + 'task/' + userId + '/' + id,
      {}
    );
  }

  addTask(userId: number, data: GeneralData) {
    return this.http.post(
      this.baseUrl + 'task/' + userId, data
    );
  }

  updateTask(userId: number, id: number, data: GeneralData) {
    return this.http.put(
      this.baseUrl + 'task/' + userId + '/' + id, data
    );
  }

  //organizations
  getOrganization(userId: number): Observable<Organization> {
    return this.http.get<Organization>(this.baseUrl + 'organization/' + userId);
  }

  deleteOrganization(userId: number, id: number) {
    return this.http.delete(
      this.baseUrl + 'organization/' + userId + '/' + id,
      {}
    );
  }

  addOrganization(userId: number, data: OrganizationForUpdate) {
    return this.http.post(
      this.baseUrl + 'organization/' + userId,
      data
    );
  }

  updateOrganization(userId: number, id: number, data: OrganizationForUpdate) {
    return this.http.put(
      this.baseUrl + 'organization/' + userId + '/' + id, data
    );
  }

    //organizations types
    getOrganizationTypes(userId: number): Observable<OrganizationType> {
      return this.http.get<OrganizationType>(this.baseUrl + 'organizationtype/' + userId);
    }

    deleteOrganizationTypes(userId: number, id: number) {
      return this.http.delete(
        this.baseUrl + 'organizationtype/' + userId + '/' + id,
        {}
      );
    }
  
    addOrganizationTypes(userId: number, data: GeneralData) {
      return this.http.post(
        this.baseUrl + 'organizationtype/' + userId,
        data
      );
    }
  
    updateOrganizationTypes(userId: number, id: number, data: GeneralData) {
      return this.http.put(
        this.baseUrl + 'organizationtype/' + userId + '/' + id, data
      );
    }
  
    // courses
    AddCourse(userId: number, data: GeneralData) {
      return this.http.post(
        this.baseUrl + 'course/' + userId,
        data
      );
    }

    getCourses(userId: number): Observable<Course> {
      return this.http.get<Course>(this.baseUrl + 'course/' + userId);
    }

    deleteCourse(userId: number, id: number) {
      return this.http.delete(
        this.baseUrl + 'course/' + userId + '/' + id,
        {}
      );
    }

    updateCourse(userId: number, id: number, data: GeneralData) {
      return this.http.put(
        this.baseUrl + 'course/' + userId + '/' + id, data
      );
    }

    // students
    addStudent(userId: number, data: GeneralData) {
      return this.http.post(
        this.baseUrl + 'student/' + userId,
        data
      );
    }

    getStudents(userId: number): Observable<Student> {
      return this.http.get<Student>(this.baseUrl + 'student/' + userId);
    }

    deleteStudent(userId: number, id: number) {
      return this.http.delete(
        this.baseUrl + 'student/' + userId + '/' + id,
        {}
      );
    }

    updateStudent(userId: number, id: number, data: GeneralData) {
      return this.http.put(
        this.baseUrl + 'student/' + userId + '/' + id, data
      );
    }

    //lecturers
    addLecturer(userId: number, data: GeneralData) {
      return this.http.post(
        this.baseUrl + 'lecturer/' + userId,
        data
      );
    }

    getLecturers(userId: number): Observable<Lecturer> {
      return this.http.get<Lecturer>(this.baseUrl + 'lecturer/' + userId);
    }

    deleteLecturer(userId: number, id: number) {
      return this.http.delete(
        this.baseUrl + 'lecturer/' + userId + '/' + id,
        {}
      );
    }

    updateLecturer(userId: number, id: number, data: GeneralData) {
      return this.http.put(
        this.baseUrl + 'lecturer/' + userId + '/' + id, data
      );
    }

    //tags
    addTag(userId: number, data: GeneralData) {
      return this.http.post(
        this.baseUrl + 'tag/' + userId,
        data
      );
    }

    getTags(userId: number): Observable<Tag> {
      return this.http.get<Tag>(this.baseUrl + 'tag/' + userId);
    }

    deleteTag(userId: number, id: number) {
      return this.http.delete(
        this.baseUrl + 'tag/' + userId + '/' + id,
        {}
      );
    }

    updateTag(userId: number, id: number, data: GeneralData) {
      return this.http.put(
        this.baseUrl + 'tag/' + userId + '/' + id, data
      );
    }
}
