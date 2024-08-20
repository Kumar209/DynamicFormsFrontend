import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  constructor() { }


  sidebarVisible: boolean = false;
  sidebarVisibleChange: EventEmitter<boolean> = new EventEmitter();

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
    this.sidebarVisibleChange.emit(this.sidebarVisible);
  }
}
