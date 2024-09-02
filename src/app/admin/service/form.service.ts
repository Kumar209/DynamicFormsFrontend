import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  token : string | null;

  httpHeaders: HttpHeaders;

  constructor(private http : HttpClient, private authService : AuthService) { 
    this.token = this.authService.getToken();

    this.httpHeaders  = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }

  private apiUrl = 'https://localhost:44353/api/FormTemplate';


  


  createSourceTemplate(templateDetails : any) : Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/CreateTemplate`, templateDetails , { headers: this.httpHeaders });
  }

  getAllForms() : Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/GetAllForms`, { headers: this.httpHeaders });
  }


  getFormById(formId : number) : Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/GetFormById/${formId}`, { headers: this.httpHeaders });
  }

  deteteFormById(id : number) : Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/RemoveFormById/${id}`, { headers: this.httpHeaders });
  }

  updateForm(updateDetails: any) : Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/UpdateTemplate/${updateDetails.id}`, updateDetails, { headers: this.httpHeaders });
  }
}
