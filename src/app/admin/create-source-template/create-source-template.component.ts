import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormControlName, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, FormatWidth } from '@angular/common';
import { QuestionService } from '../service/question.service';
import { ToastrService } from 'ngx-toastr';
import { FormService } from '../service/form.service';

@Component({
  selector: 'app-create-source-template',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create-source-template.component.html',
  styleUrl: './create-source-template.component.css'
})
export class CreateSourceTemplateComponent implements OnInit {
  mainForm! : FormGroup;
  sectionForm! : FormGroup;
  removeSectionById! : number;

  answerTypes : any[] = [];

  allForms : any[] = [];
  questions: any[] = [];
  

  
  selectedForm: number | null = null; // To hold the selected form ID for copy


  selectedSectionIndex : number | null = null;
  selectedSection: any;
  




  constructor(private router:Router, private formService : FormService, private questionService : QuestionService, private toastr : ToastrService) {}





  ngOnInit(): void {
    this.loadQuestions();

    this.loadAnswerTypes();

    this.mainForm = new FormGroup({
      formName : new FormControl('', [Validators.required]),
      formDescription : new FormControl(''),
      isPublish : new FormControl(''),
      version : new FormControl(''),
      sections : new FormArray([]),
    });


    this.sectionForm = new FormGroup({
      sectionName: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      slno: new FormControl('', [Validators.required]),
      
    });


    this.formService.getAllForms().subscribe({
      next : (res)=> {
        this.allForms = res.forms;
      },
      error : (err) => {
        // this.toastr.error('Something went wrong in fetching the all forms')
      }
    })


  }


  loadQuestions() {
    this.questionService.getAllQuestion().subscribe((res: any) => {
      if(res.success){
        this.questions = res.questions; 
        console.log(this.questions);

      }
      else{
        this.toastr.error(res.message);
        this.questions = [];
      }
    });
  }

  loadAnswerTypes(){
    this.questionService.getAnswerTypes().subscribe({
      next : (res) => {
        this.answerTypes = res.data;
      }
    })
  }

 



  get sections(): FormArray {
    return this.mainForm.get('sections') as FormArray;
  }



  getQuestionArray(index: number): FormArray {
    const section = this.sections.at(index) as FormGroup;
    const questions = section.get('questions');
    return questions as FormArray;
  }

  // Convert string to number
  getQuestionByValue(value: any) {
    const id = +value; 
    return this.questions.find(q => q.id === id);
  }

  getQuestionOptinByValue(value : any) {
    const id = +value;
    let question = this.questions.find(q => q.id === id);
    let options = question.answerOptions;
    return options;
  }

  getAnswerTypeText(value : any){
    const question = this.getQuestionByValue(value);

    const typeText = this.answerTypes.find(a => a.id === question.answerTypeId);

    return typeText.typeName;
  }

  


  addSection(): void {
    if (this.selectedSectionIndex !== null) {
      const section = this.sections.at(this.selectedSectionIndex) as FormGroup;

      section.patchValue({
        sectionName: this.sectionForm.get('sectionName')?.value,
        description: this.sectionForm.get('description')?.value,
        slno: this.sectionForm.get('slno')?.value,
      });

      this.selectedSectionIndex = null;
    } 
    
    else {
      const section = new FormGroup({
        sectionName: new FormControl(this.sectionForm.get('sectionName')?.value, [Validators.required]),
        description: new FormControl(this.sectionForm.get('description')?.value),
        slno: new FormControl(this.sectionForm.get('slno')?.value, [Validators.required]),
        questions: new FormArray([]),
        selectedQuestionId: new FormControl(null),
      });

      this.sections.push(section);
    }
    this.sectionForm.reset();
  }

  removeQuestionFromSection(sectionIndex: number, questionIndex: number): void {
    const section = this.sections.at(sectionIndex) as FormGroup; 
    const questionsArray = section.get('questions') as FormArray; 

    if (questionsArray && questionsArray.length > 0) {
        questionsArray.removeAt(questionIndex); 
        this.toastr.success('Question removed successfully.'); 
    }
}


  editSection(index: number) {
    this.selectedSectionIndex = index;
    const section = this.sections.at(index) as FormGroup;


    this.sectionForm.patchValue({
      sectionName: section.get('sectionName')?.value,
      slno: section.get('slno')?.value,
      description: section.get('description')?.value,
    });
  }




  addQuestionToSection(index: number): void {
    const section = this.sections.at(index) as FormGroup; // Get the specific section
    const selectedQuestionId = section.get('selectedQuestionId')?.value; // Get the selected question ID

    if (selectedQuestionId) {
        const questionsArray = section.get('questions') as FormArray;

        // Check if the question is already added to avoid duplicates
        if (!questionsArray.controls.some(control => control.value === selectedQuestionId)) {

            questionsArray.push(new FormControl(selectedQuestionId));
            section.get('selectedQuestionId')?.setValue(null); // Reset the selected question after adding
            console.log(`Added question ID: ${selectedQuestionId} to section ${index}`);
            
        } 
        else {
            this.toastr.warning('This question has already been added to the section.');
        }

    } else {
        this.toastr.warning('Please select a question to add.');
    }
}








  removeSection(index: number): void {
    this.sections.removeAt(index); 
  }

 


  updateSectionIdToRemove(id : number){
    this.removeSectionById = id;
  }




  published : boolean = true;

  updatePublished(value : boolean){
    this.published = value;
  }
  

  onSubmitMainForm(){
    if(this.mainForm.valid){
      console.log(this.mainForm.value);

      const formDetails = {
        formName : this.mainForm.value.formName,
        description : this.mainForm.value.formDescription,
        isPublish : this.published,
        version : 1,
        sections: this.mainForm.value.sections.map((section: any) => ({
          sectionName: section.sectionName,
          description: section.description,
          slno: section.slno,
          selectedQuestions: section.questions 
      }))
      }

      this.formService.createSourceTemplate(formDetails).subscribe({
        next: (response) => {
          if(response.success){
            this.toastr.success(response.message);
          }

          else{
            this.toastr.error(response.message);
          }
        },
        error : (err) => {
          if(err.error && err.error.message){
            this.toastr.error(err.error.message);
          }
          else{
            this.toastr.error('Something went wrong');
          }
        }
      });

      

      console.log(formDetails);
    }
    else{
      this.toastr.warning("invalid form");
    }
  }
  
}
