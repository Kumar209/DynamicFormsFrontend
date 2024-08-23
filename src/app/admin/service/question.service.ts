import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private apiUrl = 'https://localhost:44353/api/Question';

  constructor(private http: HttpClient) {}

  getAnswerTypes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetResponseTypes`);
  }

  createQuestion(questionDetails: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/AddQuestion`, questionDetails);
  }

  getAllQuestion() : Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetAllQuestions`);
  }

  getQuestionById(id : number) : Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetQuestionById/${id}`);
  }

  deleteQuestion(id : number) : Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/RemoveQuestionById/${id}`);
  }


  updateQuestion(updateDetails : any) : Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/UpdateQuestion`, updateDetails);
  }
}
