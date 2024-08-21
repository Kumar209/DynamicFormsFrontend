import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { FormService } from '../service/form.service';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    TableModule,
    PaginatorModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  forms: any[] = []; // Array to store the forms data
  selectedForm: any;
  isDeleteModalVisible: boolean = false;
  currentPage: number = 0;
  itemsPerPage: number = 5;
  searchTerm: string = '';

  constructor(private formService: FormService, private toastr : ToastrService) {}

  ngOnInit(): void {
    this.loadForms(); // Load forms data when component initializes
  }

  // (data) => {
  //   console.log('Fetched data:', data);
  //   this.forms = Array.isArray(data) ? data : [];
  // },
  // (error) => {
  //   console.error('Error fetching forms data', error);
  // }

  loadForms(): void {
    this.formService.getAllForms().subscribe({
      next : (res) => {
        this.forms = Array.isArray(res.forms) ? res.forms : [];
      },
      error : (err) => {
        this.toastr.error('Something went wrong');
      }
    }
     
    );
  }

  get paginatedForms() {
    if (!Array.isArray(this.forms)) {
      return [];
    }
  
    const filteredForms = this.forms.filter(form => {
      const formNameMatch = form.formName.toLowerCase().includes(this.searchTerm.toLowerCase());
      const descriptionMatch = form.description ? form.description.toLowerCase().includes(this.searchTerm.toLowerCase()) : false;
      return formNameMatch || descriptionMatch;
    });
  
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filteredForms.slice(startIndex, endIndex);
  }
  
  

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.itemsPerPage = event.rows;
  }

  openDeleteModal(form: any) {
    this.selectedForm = form;
    this.isDeleteModalVisible = true;
  }

  closeDeleteModal() {
    this.isDeleteModalVisible = false;
  }

  deleteForm() {
    // Handle deletion logic with backend integration
    this.formService.deteteFormById(this.selectedForm.id).subscribe(() => {
      this.forms = this.forms.filter(f => f !== this.selectedForm);
      this.closeDeleteModal();
    });
  }
}
