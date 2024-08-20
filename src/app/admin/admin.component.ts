import { Component } from '@angular/core';
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { HeaderComponent } from "../shared/header/header.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
