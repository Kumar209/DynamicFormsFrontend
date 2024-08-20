import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormService } from '../service/form.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { QuestionService } from '../service/question.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-source-template',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './edit-source-template.component.html',
  styleUrl: './edit-source-template.component.css'
})
export class EditSourceTemplateComponent {
  mainForm! : FormGroup;
  sectionForm! : FormGroup;
  removeSectionById! : number;

  allForms : any[] = [];
  questions: any[] = [];
  

  
  selectedForm: number | null = null; // To hold the selected form ID for copy


  selectedSectionIndex : number | null = null;
  selectedSection: any;

  formId: number | null = null;
  



  constructor(private router:Router, private activatedRoute : ActivatedRoute, private formService : FormService, private questionService : QuestionService, private toastr : ToastrService) {}




  ngOnInit(): void {
    this.loadQuestions();

    this.activatedRoute.queryParams.subscribe(params => {
      this.formId = params['id'];

      if (this.formId) {
        this.loadFormData(this.formId);
      }
    })

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
        this.toastr.error('Something went wrong in fetching the all forms')
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


  loadFormData(formId: number): void {
    this.formService.getFormById(formId).subscribe({
      next: (res) => {
        if (res.success) {
          const formData = res.form;
          this.populateForm(formData);
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err) => {
        this.toastr.error('Failed to load form data');
      }
    });
  }


  populateForm(formData: any): void {
    console.log(formData);

    this.mainForm.patchValue({
      formName: formData.formName,
      formDescription: formData.formDescription,
      isPublish: formData.isPublish,
      version: formData.version,
    });

    const sectionsArray = this.mainForm.get('sections') as FormArray;

    formData.sections.forEach((section: any) => {
      const questionsArray = new FormArray([]);
      section.questions.forEach((questionId: number) => {
        // questionsArray.push(new FormControl(questionId));
      });

      sectionsArray.push(new FormGroup({
        sectionName: new FormControl(section.sectionName, [Validators.required]),
        description: new FormControl(section.description),
        slno: new FormControl(section.slno, [Validators.required]),
        questions: questionsArray,
        selectedQuestionId: new FormControl(null),
      }));
    });
  }





  get sections(): FormArray {
    return this.mainForm.get('sections') as FormArray;
  }



  getQuestionArray(index: number): FormArray {
    const section = this.sections.at(index) as FormGroup;
    const questions = section.get('questions');
    return questions as FormArray;
  }

  getQuestionText(questionId: number): string {
    console.log(questionId);
    console.log(this.questions);
    const question = this.questions.find(q => q.id === questionId);
    return question ? question.question : 'kkkkkkkkk';
  }

  
  getQuestionOptions(questionId: number): string[] {
    const question = this.questions.find(q => q.id === questionId);
    return question ? question.options : [];
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

      // this.formService.createSourceTemplate(formDetails).subscribe({
      //   next: (response) => {
      //     if(response.success){
      //       this.toastr.success(response.message);
      //     }

      //     else{
      //       this.toastr.error(response.message);
      //     }
      //   },
      //   error : (err) => {
      //     if(err.error && err.error.message){
      //       this.toastr.error(err.error.message);
      //     }
      //     else{
      //       this.toastr.error('Something went wrong');
      //     }
      //   }
      // });

      

      console.log(formDetails);
    }
    else{
      this.toastr.warning("invalid form");
    }
  }
}
