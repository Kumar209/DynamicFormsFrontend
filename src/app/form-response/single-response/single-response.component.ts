import { Component } from '@angular/core';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-single-response',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, RouterModule, CommonModule, RouterModule],
  templateUrl: './single-response.component.html',
  styleUrl: './single-response.component.css'
})
export class SingleResponseComponent {

}
