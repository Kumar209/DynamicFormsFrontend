import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { QuestionService } from '../service/question.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-question',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './create-question.component.html',
  styleUrl: './create-question.component.css'
})
export class CreateQuestionComponent implements OnInit {
  questionForm!: FormGroup;
  answerTypes: any[] = [];
  questions: any[] = [];

  showOptions : boolean = false;

  constructor(private questionService: QuestionService, private router : Router, private toastr : ToastrService){}


  ngOnInit(): void {
    this.initializeForm();
    this.loadAnswerTypes();
    this.showOptions = false;
    this.loadQuestions();
  }

  loadQuestions() {
    this.questionService.getAllQuestion().subscribe((res: any) => {
      if(res.success){
        this.questions = res.questions; 
      }
      else{
        this.toastr.error(res.message);
        this.questions = [];
      }
    });
  }

  initializeForm() {
    this.questionForm = new FormGroup({
      question: new FormControl('', Validators.required),
      slno: new FormControl('', Validators.required),
      answerTypeId: new FormControl('', Validators.required),
      size: new FormControl('small'),
      addConstraint: new FormControl(false),
      required: new FormControl(false),
      dataType: new FormControl(null),
      constraint: new FormControl(null),
      constraintValue: new FormControl(null),
      warningMessage: new FormControl(null),
      answerOptions: new FormArray([]) 
    });


    this.questionForm.get('addConstraint')?.valueChanges.subscribe((isChecked: boolean) => {
      if (!isChecked) {
        // Reset the fields when unchecked
        this.questionForm.patchValue({
          dataType: null,        
          constraint: null,      
          constraintValue: null, 
          warningMessage: null   
        });
      }
    });
  }

  loadAnswerTypes() {
    this.questionService.getAnswerTypes().subscribe((res: any) => {
      this.answerTypes = res.data;
    });
  }


  onResponseTypeChange(event: Event) {
    const selectedType = (event.target as HTMLSelectElement).value;

    const typeId = parseInt(selectedType, 10);


    // Assuming dropdown, radio, and multi-select
    if (typeId === 5 || typeId === 6 || typeId === 3 || typeId === 4 ) { 
      this.getOptions().clear();
      this.questionForm.get('answerOptions')?.setValidators([Validators.required]);
      this.addOption();

      this.showOptions = true;
    } 
    else {
      this.questionForm.get('answerOptions')?.clearValidators();
      this.getOptions().clear();
      this.showOptions = false;
    }

    this.questionForm.get('answerOptions')?.updateValueAndValidity();
  }


  getOptions(): FormArray {
    return this.questionForm.get('answerOptions') as FormArray;
  }


  addOption() {
    const optionFormGroup = new FormGroup({
      optionValue: new FormControl('', Validators.required),
      nextQuestionID: new FormControl(null) 
    });

    this.getOptions().push(optionFormGroup);
  }


  removeOption(index: number) {
    this.getOptions().removeAt(index);
  }


  

  onSubmit() {
    if (this.questionForm.valid) {
      this.questionService.createQuestion(this.questionForm.value).subscribe({
        next : (response) => {
          if(response.success){
            this.toastr.success(response.message);
            this.questionForm.reset();
            this.getOptions().clear();
            this.router.navigate(['/admin/existing-questions']);
          }
          else {
            this.toastr.error(response.message);
          }
        },

        error : (err) => {
          if(err.error && err.error.message){
            this.toastr.error(err.error.message, 'Error!');
          }
          else{
            this.toastr.error('Something went wrong', 'Error!');
          }
        }
      })

      console.log(this.questionForm.value);
    }
    else{
      console.log('invalid form');
    }
  }
}
