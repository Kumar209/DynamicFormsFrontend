import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SharedService } from '../service/shared.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private service : SharedService){}

  toggleSidebar(){
    this.service.toggleSidebar();
  }
}
