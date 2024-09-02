import { Injectable } from '@angular/core';
import { FormService } from '../../admin/service/form.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  token : string | null;

  httpHeaders: HttpHeaders;


  
  constructor(private http : HttpClient, private authService : AuthService) { 
    this.token = this.authService.getToken();

    this.httpHeaders  = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }


  private apiUrl = "https://localhost:44353/api/FormResponse";




  insertFormResponse(response : any, formId : number) : Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/InsertResponse`, response);
  }

  

  getAllResponseByFormId(formId : number) : Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/GetAllResponseByFormId/${formId}`, { headers: this.httpHeaders });
  }


  getResponseById(responseId : number) : Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetResponseById/${responseId}`, { headers: this.httpHeaders }); 
  }


  removeResponse(id : any) :Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteResponse/${id}`, { headers: this.httpHeaders })
  }



}
