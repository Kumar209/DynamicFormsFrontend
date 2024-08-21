// import { Component, OnInit } from '@angular/core';
// import { FormService } from '../../admin/service/form.service';
// import { ResponseService } from '../services/response.service';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import { QuestionService } from '../../admin/service/question.service';

// @Component({
//   selector: 'app-generated-form',
//   standalone: true,
//   imports: [CommonModule, RouterModule, ReactiveFormsModule],
//   templateUrl: './generated-form.component.html',
//   styleUrls: ['./generated-form.component.css']
// })
// export class GeneratedFormComponent implements OnInit {
//   formData: any;
//   answerTypes: any[] = [];
//   formId: any;
//   selectedAnswers: any = {}; // To store selected answers

//   constructor(
//     private formService: FormService,
//     private questionService: QuestionService,
//     private responseService: ResponseService,
//     private router: Router,
//     private activatedRoute: ActivatedRoute,
//     private toastr: ToastrService
//   ) {}

//   ngOnInit(): void {
//     this.formId = this.activatedRoute.snapshot.queryParams['formId'];
//     this.loadFormData();
//     this.loadAnswerTypes();
//   }

//   loadAnswerTypes() {
//     this.questionService.getAnswerTypes().subscribe((res: any) => {
//       this.answerTypes = res.data;
//     });
//   }

//   loadFormData() {
//     this.formService.getFormById(this.formId).subscribe({
//       next: (res) => {
//         this.formData = res.form;
//       },
//       error: (err) => {
//         this.toastr.error('Something went wrong in fetching form data');
//       }
//     });
//   }

//   getAnswerTypeName(answerTypeId: number): string {
//     const answerType = this.answerTypes.find(type => type.id === answerTypeId);
//     return answerType ? answerType.typeName : '';
//   }

//   loadNextQuestion(nextQuestionId: number, section: any) {
//     this.questionService.getQuestionById(nextQuestionId).subscribe(response => {
//       if (response.success && this.formData) {
//         section.questions.push(response.question);
//       }
//     });
//   }

//   handleOptionSelect(event: any, option: any, section: any) {
//     const questionId = section.id; // Assuming each section has an id
//     if (!this.selectedAnswers[questionId]) {
//       this.selectedAnswers[questionId] = {};
//     }

//     // Handle selection based on the input type
//     if (event.target.type === 'checkbox') {
//       // Store checkbox selections
//       this.selectedAnswers[questionId][option.optionValue] = event.target.checked;
//     } else {
//       // Store single selections for radio, dropdown, etc.
//       this.selectedAnswers[questionId] = option.optionValue;
//     }

//     if (option.nextQuestionId) {
//       this.loadNextQuestion(option.nextQuestionId, section);
//     }
//   }

//   onSubmit() {
//     const jsonData = {
//       answers: this.selectedAnswers
//     };
//     console.log(JSON.stringify(jsonData, null, 2)); // Log to console
//     alert(JSON.stringify(jsonData, null, 2)); // Display in alert
//   }
// }


























































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



  handleOptionSelect(event : any, option: any, section: any) {
    if (option.nextQuestionId) {
      this.loadNextQuestion(option.nextQuestionId, section);
    }
  }


  

  
  
}


