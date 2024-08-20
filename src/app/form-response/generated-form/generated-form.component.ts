import { Component, OnInit } from '@angular/core';
import { FormService } from '../../admin/service/form.service';
import { ResponseService } from '../services/response.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionService } from '../../admin/service/question.service';

@Component({
  selector: 'app-generated-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule

  ],
  templateUrl: './generated-form.component.html',
  styleUrl: './generated-form.component.css'
})
export class GeneratedFormComponent implements OnInit {
  formData : any;
  answerTypes: any[] = [];
  formId : any;



  constructor(private formService : FormService, private questionService : QuestionService,  private responseService : ResponseService, private router : Router, private activatedRoute : ActivatedRoute, private toastr : ToastrService) {}

  ngOnInit(): void {
    this.formId =  this.activatedRoute.snapshot.queryParams['formId'];


    this.loadFormData();
    this.loadAnswerTypes();
  }



  loadAnswerTypes() {
    this.questionService.getAnswerTypes().subscribe((res: any) => {
      this.answerTypes = res.data;
    });
  }


  loadFormData() {
    this.formService.getFormById(this.formId).subscribe({
      
      next : (res)=> {
        this.formData = res.form;
      },
      error : (err) => {
        this.toastr.error('Something went wrong in fetching form data');
      }
    })
  }



  getAnswerTypeName(answerTypeId: number): string {
    const answerType = this.answerTypes.find(type => type.id === answerTypeId);
    return answerType ? answerType.typeName : '';
  }





  loadNextQuestion(nextQuestionId: number, section: any) {
    this.questionService.getQuestionById(nextQuestionId).subscribe(response => {

      if (response.success && this.formData) {
        section.questions.push(response.question);
      }
      
    });
  }



  
  handleOptionSelect(event: any, option: any, section: any) {
    const answerType = this.getAnswerTypeName(section.question.answerTypeId);
    if (option && option.nextQuestionId) {
      if (answerType === 'radio') {
        section.questions = section.questions.filter((q : any) => q.id !== option.nextQuestionId);
        this.loadNextQuestion(option.nextQuestionId, section);
      } else if (answerType === 'checkbox') {
        if (event.target.checked) {
          this.loadNextQuestion(option.nextQuestionId, section);
        } else {
          const question = section.questions.find((q : any) => q.id === option.nextQuestionId);
          section.questions = section.questions.filter((q : any) => q.id !== option.nextQuestionId);
          if (question) {
            section.questions = section.questions.filter((q : any) => q.id !== question.id);
          }
        }
      } else if (answerType === 'dropdown' || answerType === 'multi-select') {
        section.questions = section.questions.filter((q : any) => q.id !== option.nextQuestionId);
        this.loadNextQuestion(option.nextQuestionId, section);
      }
    }
  }





















  // handleOptionSelect(event : any, option: any, section: any) {
  //   if (option.nextQuestionId) {
  //     this.loadNextQuestion(option.nextQuestionId, section);
  //   }
  // }


  
  
}
