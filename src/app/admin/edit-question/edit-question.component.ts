import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionService } from '../service/question.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-question',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './edit-question.component.html',
  styleUrl: './edit-question.component.css'
})
export class EditQuestionComponent {
  questionForm!: FormGroup;
  answerTypes: any[] = [];
  questions: any[] = [];

  fetchedQuestionId : any;
  fetchedQuestion : any;


  showOptions : boolean = false;

  constructor(private questionService: QuestionService, private route: ActivatedRoute, private router : Router, private toastr : ToastrService){}


  ngOnInit(): void {

    this.fetchedQuestionId = this.route.snapshot.queryParamMap.get('questionid');

    this.initializeForm();
    this.loadAnswerTypes();
    this.showOptions = false;
    this.loadQuestions();

    this.loadFetchedQuestion();

    
  }

  loadFetchedQuestion() {
    this.questionService.getQuestionById(this.fetchedQuestionId).subscribe({
      next : (res) => {
        this.fetchedQuestion = res.question;
        this.patchFormValues();
        console.log(this.fetchedQuestion);
      },
      error : (err) => {
        this.toastr.error('Error getting question');
        console.log(err.message);
      }
    })
  }

  patchFormValues(): void {
    if (this.fetchedQuestion) {
      this.questionForm.patchValue({
        question: this.fetchedQuestion.question,
        slno: this.fetchedQuestion.slno,
        answerTypeId: this.fetchedQuestion.answerTypeId,
        size: this.fetchedQuestion.size,
        required: this.fetchedQuestion.required,
        addConstraint: this.fetchedQuestion.constraint !== null,
        dataType: this.fetchedQuestion.dataType,
        constraint: this.fetchedQuestion.constraint,
        constraintValue: this.fetchedQuestion.constraintValue,
        warningMessage: this.fetchedQuestion.warningMessage,
      });
  

      const answerOptions = this.fetchedQuestion.answerOptions.map((option: any) => {
        this.showOptions = true;

        const convertedNextQuestionId = option.nextQuestionID === null? null : String(option.nextQuestionID);
        return new FormGroup({
          id : new FormControl(option.id),
          optionValue: new FormControl(option.optionValue, Validators.required),
          nextQuestionID: new FormControl(convertedNextQuestionId),
        });
      });
  
      this.questionForm.setControl('answerOptions', new FormArray(answerOptions));
  
      // Show or hide the constraint fields based on the "addConstraint" value
      this.questionForm.get('addConstraint')?.valueChanges.subscribe((isChecked: boolean) => {
        if (isChecked) {
          this.questionForm.get('dataType')?.setValidators([Validators.required]);
          this.questionForm.get('constraint')?.setValidators([Validators.required]);
          this.questionForm.get('constraintValue')?.setValidators([Validators.required]);
          this.questionForm.get('warningMessage')?.setValidators([Validators.required]);
        } else {
          this.questionForm.get('dataType')?.clearValidators();
          this.questionForm.get('constraint')?.clearValidators();
          this.questionForm.get('constraintValue')?.clearValidators();
          this.questionForm.get('warningMessage')?.clearValidators();
        }
        this.questionForm.get('dataType')?.updateValueAndValidity();
        this.questionForm.get('constraint')?.updateValueAndValidity();
        this.questionForm.get('constraintValue')?.updateValueAndValidity();
        this.questionForm.get('warningMessage')?.updateValueAndValidity();
      });
  
      // Set the initial value for the "required" checkbox
      this.questionForm.get('required')?.setValue(this.fetchedQuestion.required);
  
      // Show or hide the options based on the answer type
      this.questionForm.get('answerTypeId')?.valueChanges.subscribe((answerTypeId: number) => {
        if (answerTypeId === 5 || answerTypeId === 6 || answerTypeId === 3 || answerTypeId === 4) {
          this.showOptions = true;
        } else {
          this.showOptions = false;
          this.getOptions().clear();
        }
      });
    }
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

      console.log(this.questionForm.value);

      const questionDetails = {
        id: this.fetchedQuestionId,
        ...this.questionForm.value
      };

      console.log(questionDetails);

      this.questionService.updateQuestion(questionDetails).subscribe({
        next : (res) => {
          if(res.success){
            this.toastr.success(res.message);
            this.router.navigate(['/admin/existing-questions']);
          }
          else{
            this.toastr.error(res.message);
          }
        },
        error : (err) => {
          this.toastr.error('Something went wrong');
        }
      })
    }
    else{
      console.log('invalid form');
    }
  }
}
