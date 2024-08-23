import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-existing-question-list',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, PaginatorModule],
  templateUrl: './existing-question-list.component.html',
  styleUrls: ['./existing-question-list.component.css']
})
export class ExistingQuestionListComponent implements OnInit {
  allQuestions: any[] = []; 
  questions: any[] = [];
  searchText = '';
  selectedResponseType: any;
  answerTypes: any[] = [];
  
  
  first: number = 0; //  pagination properties initialised
  rows: number = 5;
  totalRecords: number = 0;

  questionIdToDelete!: any;
  
  constructor(private toastr: ToastrService, private questionService: QuestionService, private router: Router) { }

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
      this.totalRecords = this.allQuestions.length; // set total records for paginator
      this.updatePaginatedQuestions(); // Load initial data
    });
  }

  updatePaginatedQuestions() {
    this.questions = this.allQuestions
      .map(question => {
        const answerType = this.answerTypes.find(type => type.id === question.answerTypeId);
        return { ...question, answerType: answerType.typeName }; // Map answerType
      })
      .slice(this.first, this.first + this.rows);
  }

  filterQuestions() {
    if (this.selectedResponseType === '') {
      this.questions = this.allQuestions;
    } else {
      this.questions = this.allQuestions
        .map(question => {
          const answerType = this.answerTypes.find(type => type.id === question.answerTypeId);
          return { ...question, answerType: answerType.typeName }; // Map answerType
        })
        .filter((question: any) => question.answerType === this.selectedResponseType);
    }
    // this.totalRecords = this.questions.length; // Update total records
    // this.first = 0; // Reset pagination to first page
    // this.updatePaginatedQuestions(); // Update paginated data
  }

  updateQuestionIdToDelete(id: number) {
    this.questionIdToDelete = id;
  }

  deleteQuestion() {
    this.questionService.deleteQuestion(this.questionIdToDelete).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.toastr.success('Question deleted successfully!');
          this.getQuestions();   //Refresh the question list
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
    // this.totalRecords = this.questions.length; // Update total records
    // this.first = 0; // Reset pagination to first page
    // this.updatePaginatedQuestions(); // Update paginated data
  }

  onPageChange(event: any) {
    this.first = event.first || 0;      // handle undefined with fallback value
    this.rows = event.rows || 10;      // handle undefined with fallback value
    this.updatePaginatedQuestions();  // Update the displayed questions based on new page
  }
}
