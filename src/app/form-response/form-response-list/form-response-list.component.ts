import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResponseService } from '../services/response.service';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-form-response-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, SidebarComponent, HeaderComponent,PaginatorModule],
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


  constructor(private responseService : ResponseService, private activatedRoute: ActivatedRoute, private toastr : ToastrService) {}

  ngOnInit(): void {
    this.formId =  this.activatedRoute.snapshot.queryParams['formId'];

    this.loadReponses(); 
  }


  loadReponses(): void {
    this.responseService.getAllResponseByFormId(this.formId).subscribe({
      next : (res) => {
        console.log(res);

        this.responses = Array.isArray(res.responses) ? res.responses : [];
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
  
    console.log(this.responses);
    
    const filteredResponse = this.responses.filter(response => {
      const email = response.email ? response.email.toLowerCase().includes(this.searchTerm.toLowerCase()) : false;
      return  email;
    });

  
  
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    var arr = filteredResponse.slice(startIndex, endIndex);

    console.log(arr);

    return arr;
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
