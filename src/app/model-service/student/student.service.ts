import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseUrlStudent = 'http://localhost:8000/api/students';

  constructor(private http: HttpClient) { }

  getStudentList(): Observable<any>{
    return this.http.get(`${this.baseUrlStudent}`);
  }

  getStudentByMatric(matric: string): Observable<object>{
    return this.http.get(`${this.baseUrlStudent}/${matric}`);
  }

  createStudent(student: any): Observable<object>{
    return this.http.post(`${this.baseUrlStudent}`, student);
  }

  updateStudent(matric: string, student: any): Observable<object>{
    return this.http.put(`${this.baseUrlStudent}/${matric}`, student);
  }

  deleteStudent(matric: string): Observable<any>{
    return this.http.delete(`${this.baseUrlStudent}/${matric}`);
  }

  deleteAllStudents(): Observable<any>{
    return this.http.delete(`${this.baseUrlStudent}`);
  }
}
