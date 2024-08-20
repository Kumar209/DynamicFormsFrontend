import { Component, OnInit} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  
}
