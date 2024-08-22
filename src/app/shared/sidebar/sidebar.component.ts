import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { SharedService } from '../service/shared.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/service/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SidebarModule, RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  sidebarVisible: boolean;

  constructor(
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService : AuthService
  ) {
    this.sidebarVisible = sharedService.sidebarVisible;
  }

  ngOnInit(): void {
    this.sharedService.sidebarVisibleChange.subscribe((visible: boolean) => {
      this.sidebarVisible = visible;
      this.cdr.detectChanges();
    });
  }

  closeSidebarOnClick() {
    this.sharedService.toggleSidebar();
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }


  logout() : void {
    this.authService.logout();
  }
}
