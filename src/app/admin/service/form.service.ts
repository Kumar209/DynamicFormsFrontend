import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private http : HttpClient) { }

  private apiUrl = 'https://localhost:44353/api/FormTemplate';

  createSourceTemplate(templateDetails : any) : Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/CreateTemplate`, templateDetails);
  }

  getAllForms() : Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/GetAllForms`);
  }


  getFormById(id : number) : Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/GetFormById/${id}`);
  }

  deteteFormById(id : number) : Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/RemoveFormById/${id}`);
  }

  updateForm(updateDetails: any) : Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/UpdateForm`, updateDetails);
  }
}
