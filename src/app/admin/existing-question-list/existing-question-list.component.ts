import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-existing-question-list',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './existing-question-list.component.html',
  styleUrls: ['./existing-question-list.component.css']
})
export class ExistingQuestionListComponent implements OnInit {

  allQuestions: any[] = []; 
  questions: any[] = [];
  searchText = '';
  selectedResponseType: any;
  answerTypes: any[] = [];

  questionIdToDelete! : any;
  
  constructor(private toastr: ToastrService ,private questionService: QuestionService, private router: Router) { }
  ngOnInit(): void {
    this.getQuestions();
    this.loadAnswerTypes();
  }

  loadAnswerTypes() {
    this.questionService.getAnswerTypes().subscribe((res: any) => {
      this.answerTypes = res.data;
      
    });
  }



  getQuestions(): void {
    this.questionService.getAllQuestion().subscribe(response => {
      this.allQuestions = response.questions; // store all questions
     
      this.questions = this.allQuestions.map(question => {
        const answerType = this.answerTypes.find(type => type.id === question.answerTypeId);
        return { ...question, answerType: answerType.typeName }; // Map answerType
      });
      });

  }

  filterQuestions() {
    if (this.selectedResponseType === '') {
      this.questions = this.allQuestions;
    } 
    else {
      this.questions = this.allQuestions.map(question => {
        const answerType = this.answerTypes.find(type => type.id === question.answerTypeId);
        return { ...question, answerType: answerType.typeName }; // Map answerType
      }).filter((question: any) => {

        return question.answerType === this.selectedResponseType;
      });
    }
  }

  updateQuestionIdToDelete(id : number){
    this.questionIdToDelete = id;
  }

  deleteQuestion() {
    this.questionService.deleteQuestion(this.questionIdToDelete).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.toastr.success('Question deleted successfully!');
          window.location.reload();
        } else {
          this.toastr.error('Error deleting question');
        }
      },
      error: (error: any) => {
        this.toastr.error('Error deleting question');
        console.error(error);
      }
    });
  }


  searchQuestions() {
    this.questions = this.allQuestions.filter((question: any) => {
      return question.question.toLowerCase().includes(this.searchText.toLowerCase());
    });
  
  }

}