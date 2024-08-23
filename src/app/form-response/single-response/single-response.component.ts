import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ResponseService } from '../services/response.service';
import { QuestionService } from '../../admin/service/question.service';

@Component({
  selector: 'app-single-response',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, RouterModule, CommonModule, RouterModule],
  templateUrl: './single-response.component.html',
  styleUrl: './single-response.component.css'
})

export class SingleResponseComponent implements OnInit {

  responseId : any;
  fetchedResponse : any;

  parsedResponse: any[] = [];

  questions : any[] =[]

  constructor(private questionService : QuestionService,  private responseService : ResponseService, private router : Router, private activatedRoute : ActivatedRoute, private toastr:ToastrService){}
  
  
  ngOnInit(): void {
    this.responseId =  this.activatedRoute.snapshot.queryParams['responseId'];

    // this.loadQuestions();
    // this.loadResponse();

    this.loadQuestions().then(() => {
      this.loadResponse();
    });
  }


  // loadQuestions() {
  //   this.questionService.getAllQuestion().subscribe((res: any) => {
  //     if(res.success){
  //       this.questions = res.questions; 

  //     }
  //     else{
  //       this.toastr.error(res.message);
  //       this.questions = [];
  //     }
  //   });
  // }

  loadQuestions(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.questionService.getAllQuestion().subscribe((res: any) => {
        if (res.success) {
          this.questions = res.questions;
          resolve(this.questions); // Pass the questions array to resolve
        } else {
          this.toastr.error(res.message);
          this.questions = [];
          resolve(null); // Pass null to resolve if no questions are found
        }
      }, (err) => {
        this.toastr.error('Error loading questions');
        reject(err);
      });
    });
  }



  loadResponse() {
    this.responseService.getResponseById(this.responseId).subscribe({
      next : (res) => {
        if(res.success){
          this.fetchedResponse = res.responses;
          this.parseResponse();
        }
        else{
          this.toastr.error(res.message);
        }
      },
      error : (err) => {
        if(err.error.message){
          this.toastr.error(err.error.message);
        }
        else{
          this.toastr.error('Something went wrong');
        }
      }
    })
  }


  parseResponse() {
    const responseJson = JSON.parse(this.fetchedResponse.response);
    const sections: any[] = [];

    for (const sectionId in responseJson) {
      if (responseJson.hasOwnProperty(sectionId)) {
        const section: any[] = [];
        for (const questionId in responseJson[sectionId]) {
          if (responseJson[sectionId].hasOwnProperty(questionId)) {
            const question = {
              question: this.getQuestionText(sectionId, questionId),
              answer: responseJson[sectionId][questionId]
            };
            section.push(question);
          }
        }
        sections.push(section);
      }
    }

    this.parsedResponse = sections;
  }

  getQuestionText(sectionId: string, questionId: string): string {
    // return `Question ${sectionId}-${questionId}`;
    console.log(questionId);
    const convertedQuestionId = parseInt(questionId);
    console.log(convertedQuestionId);
    console.log(this.questions);
    const question = this.questions.find(q => q.id === convertedQuestionId);
    console.log(this.questions);

    return question ? question.question : `Unknown Question ${questionId}`;
  }
}
