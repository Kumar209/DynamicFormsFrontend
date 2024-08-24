import { Component, OnInit } from '@angular/core';
import { FormService } from '../../admin/service/form.service';
import { ResponseService } from '../services/response.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuestionService } from '../../admin/service/question.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-generated-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, NgSelectComponent],
  templateUrl: './generated-form.component.html',
  styleUrls: ['./generated-form.component.css']
})
export class GeneratedFormComponent implements OnInit {
  formData: any;
  answerTypes: any[] = [];
  formId: any;


  selectedAnswers: { [sectionId: string]: { [questionId: string]: any } } = {};

  userEmail: string | null = null;

  constructor(
    private formService: FormService,
    private questionService: QuestionService,
    private responseService: ResponseService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.formId = this.activatedRoute.snapshot.queryParams['formId'];

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
      next: (res) => {
        this.formData = res.form;
      },
      error: (err) => {
        this.toastr.error('Something went wrong in fetching form data');
      }
    });
  }

  getAnswerTypeName(answerTypeId: number): string {
    const answerType = this.answerTypes.find((type) => type.id === answerTypeId);
    return answerType ? answerType.typeName : '';
  }

  loadNextQuestion(nextQuestionId: number, section: any) {
    this.questionService.getQuestionById(nextQuestionId).subscribe((response) => {
      if (response.success && this.formData) {
        section.questions.push(response.question);
      }
    });
  }






  selectedMultiSelectOptions: any[] = [];


  handleOptionSelect(event: any, option: any, section: any, question: any, questionIndex: number) {
    const questionId = question.id;
    let answerValue;

    switch (this.getAnswerTypeName(question.answerTypeId)) {
      case 'radio':
        answerValue = event.target.value;
        break;

      case 'checkbox':
        if (!this.selectedAnswers[section.id]) {
          this.selectedAnswers[section.id] = {};
        }
        if (!this.selectedAnswers[section.id][questionId]) {
          this.selectedAnswers[section.id][questionId] = [];
        }
        const checkboxValue = event.target.value;

        if (event.target.checked) {
          this.selectedAnswers[section.id][questionId].push(checkboxValue);
        } 
        else {
          const index = this.selectedAnswers[section.id][questionId].indexOf(checkboxValue);
          
          if (index !== -1) {
            this.selectedAnswers[section.id][questionId].splice(index, 1);
          }
        }
        answerValue = this.selectedAnswers[section.id][questionId];
        break;

      case 'dropdown':
        answerValue = event.target.value;
        break;

      case 'text':
        answerValue = event.target.value;
        if (question.question.toLowerCase().includes('email')) {
          this.userEmail = answerValue;
        }
        break;

      case 'number':
        answerValue = event.target.valueAsNumber;
        break;

      case 'date':
        answerValue = event.target.valueAsDate;
        break;

      case 'multi-select':
        if (!this.selectedAnswers[section.id]) {
          this.selectedAnswers[section.id] = {};
        }
        if (!this.selectedAnswers[section.id][questionId]) {
          this.selectedAnswers[section.id][questionId] = [];
        }
        const checkbox = event.target;
        if (checkbox.checked) {
          this.selectedAnswers[section.id][questionId].push(option.optionValue);
        } else {
          const index = this.selectedAnswers[section.id][questionId].indexOf(option.optionValue);
          if (index !== -1) {
            this.selectedAnswers[section.id][questionId].splice(index, 1);
          }
        }
        break;


      default:
        answerValue = null;
    }

    // Store the selected answer using the original section ID
    const originalSectionId = section.originalId || section.id;

    if (this.getAnswerTypeName(question.answerTypeId) !== 'checkbox' && this.getAnswerTypeName(question.answerTypeId) !== 'multi-select') {
      if (!this.selectedAnswers[originalSectionId]) {
        this.selectedAnswers[originalSectionId] = {};
      }

      this.selectedAnswers[originalSectionId][questionId] = answerValue;
    }

    // Handle next question logic --- Changed
    if (option && option.nextQuestionId) {
      if (event.target.type === 'radio' && event.target.checked) {
        // this.replaceNextQuestion(section, questionIndex, option.nextQuestionId);
        if (option.nextQuestionId) {
          this.replaceNextQuestion(section, questionIndex, option.nextQuestionId);
        } 
        else {
          // Hide next question if radio option does not have a next question
          this.removeNextQuestion(section, questionIndex);
        }
      } 
      
      else if (event.target.type === 'checkbox' && event.target.checked) {
        // this.addNextQuestion(section, questionIndex, option.nextQuestionId);
        if (option.nextQuestionId) {
          this.addNextQuestion(section, questionIndex, option.nextQuestionId);
        }
      } 
      else if (event.target.type === 'checkbox' && !event.target.checked) {
        this.removeNextQuestion(section, questionIndex);
      }
    }

    
  }





  // Method to replace next question
  replaceNextQuestion(section: any, questionIndex: number, nextQuestionId: number) {
    this.questionService.getQuestionById(nextQuestionId).subscribe({
      next: (response) => {
        if (response.success) {
          // Replace next question
          section.questions[questionIndex + 1] = response.question;
        } else {
          console.error('Failed to load next question:', response);
        }
      },
      error: (error) => {
        console.error('Error loading next question:', error);
      }
    });
  }

  // Method to add next question
  addNextQuestion(section: any, questionIndex: number, nextQuestionId: number) {
    this.questionService.getQuestionById(nextQuestionId).subscribe({
      next: (response) => {
        if (response.success) {
          // Add next question
          section.questions.splice(questionIndex + 1, 0, response.question);
        } else {
          console.error('Failed to load next question:', response);
        }
      },
      error: (error) => {
        console.error('Error loading next question:', error);
      }
    });
  }

  // Method to remove next question
  removeNextQuestion(section: any, questionIndex: number) {
    if (section.questions.length > questionIndex + 1) {
      section.questions.splice(questionIndex + 1, 1);
    }
  }




  onSubmit(event: any) {
    event.preventDefault();

    // Loop through sections and questions
    for (const sectionId in this.selectedAnswers) {
      if (this.selectedAnswers.hasOwnProperty(sectionId)) {
        const sectionAnswers = this.selectedAnswers[sectionId];
        console.log(`Section ID: ${sectionId}`);
        for (const questionId in sectionAnswers) {
          if (sectionAnswers.hasOwnProperty(questionId)) {
            const answerValue = sectionAnswers[questionId];
            console.log(`Question ID: ${questionId}, Answer: ${answerValue}`);
          }
        }
      }
    }

    const outerEmail = this.userEmail || 'anonymous';

    // Convert selectedAnswers to a JSON string
    const answersJson = JSON.stringify(this.selectedAnswers);

    const responseData = {
      formId: this.formId,
      response: answersJson,
      email: outerEmail,
      AnswerMasterId: null
    };

    console.log(responseData);

    this.responseService.insertFormResponse(responseData, this.formId).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastr.success(res.message);
          // this.router.navigate(['/form-response/form-response-list']);

          this.router.navigate(['/form-response/form-response-list'], { queryParams: { formId: this.formId } });
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err) => {
        if (err.error.message) {
          this.toastr.error(err.error.message);
        } else {
          this.toastr.error('Something went wrong');
        }
      }
    });
  }
}


