import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private apiUrl = 'https://localhost:44353/api/Question';



  token : string | null;

  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient, private authService : AuthService) {
    this.token = this.authService.getToken();

    this.httpHeaders  = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }
  

  getAnswerTypes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetResponseTypes`, { headers: this.httpHeaders });
  }

  createQuestion(questionDetails: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/AddQuestion`, questionDetails, { headers: this.httpHeaders });
  }

  getAllQuestion() : Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetAllQuestions`, { headers: this.httpHeaders });
  }

  getQuestionById(id : number) : Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetQuestionById/${id}`, { headers: this.httpHeaders });
  }

  deleteQuestion(id : number) : Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/RemoveQuestionById/${id}`, { headers: this.httpHeaders });
  }


  updateQuestion(updateDetails : any) : Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/UpdateQuestion`, updateDetails, { headers: this.httpHeaders });
  }
}
