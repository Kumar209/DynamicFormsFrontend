import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResponseService } from '../services/response.service';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-form-response-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, SidebarComponent, HeaderComponent],
  templateUrl: './form-response-list.component.html',
  styleUrl: './form-response-list.component.css'
})
export class FormResponseListComponent {
  responses : any[] = [];
  isDeleteModalVisible: boolean = false;
  currentPage: number = 0;
  itemsPerPage: number = 5;
  searchTerm: string = '';
  selectedResponse : any;

  formId : any;


  constructor(private responseService : ResponseService, private toastr : ToastrService) {}

  ngOnInit(): void {
    this.loadReponses(); 
  }


  loadReponses(): void {
    this.responseService.getAllResponseByFormId(this.formId).subscribe({
      next : (res) => {
        this.responses = Array.isArray(res.forms) ? res.forms : [];
      },
      error : (err) => {
        this.toastr.error('Something went wrong');
      }
    }
     
    );
  }

  get paginatedResponse() {
    if (!Array.isArray(this.responses)) {
      return [];
    }
  
    const filteredResponse = this.responses.filter(response => {
      const formId = response.formId.toLowerCase().includes(this.searchTerm.toLowerCase());
      const email = response.email ? response.email.toLowerCase().includes(this.searchTerm.toLowerCase()) : false;
      return formId || email;
    });
  
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filteredResponse.slice(startIndex, endIndex);
  }
  
  

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.itemsPerPage = event.rows;
  }

  openDeleteModal(form: any) {
    this.selectedResponse = form;
    this.isDeleteModalVisible = true;
  }

  closeDeleteModal() {
    this.isDeleteModalVisible = false;
  }


  

  deleteresponse() {
    // Handle deletion logic with backend integration
    this.responseService.removeResponse(this.selectedResponse.id).subscribe({
      next : (res)=> {
        if(res.success){
          this.toastr.success(res.message);
        }
        else {
          this.toastr.error(res.message);
        }
      },
      error : (err) => {
        if(err.error.message){
          this.toastr.error(err.error.message);
        }
        else {
          this.toastr.error('Something went wrong');
        }
      }
      
    });
  }
}
