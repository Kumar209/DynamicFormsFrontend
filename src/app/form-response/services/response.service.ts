import { Injectable } from '@angular/core';
import { FormService } from '../../admin/service/form.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {

  constructor(private http : HttpClient) { }


  private apiUrl = "https://localhost:44353/api/FormResponse";




  insertFormResponse(response : any, formId : number) : Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/InsertResponse`, response);
  }

  

  getAllResponseByFormId(formId : number) : Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/GetAllResponseByFormId/${formId}`);
  }


  getResponseById(responseId : number) : Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetResponseById/${responseId}`); 
  }


  removeResponse(id : any) :Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteResponse/${id}`)
  }



}
