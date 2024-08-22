import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
 busyRequesstCount = 0;

  constructor(private spinnerService : NgxSpinnerService) { }

  busy(){
    this.busyRequesstCount++;
    this.spinnerService;
    this.spinnerService.show(undefined, {
      type : 'ball-scale-ripple',
      bdColor : 'rgba(0,0,0,0.8)',
      color: "#fff",
      size  : "default"
    })
  }


  idle(){
    this.busyRequesstCount--;

    if(this.busyRequesstCount <= 0){
      this.busyRequesstCount = 0;
      this.spinnerService.hide();
    }
  }
}
