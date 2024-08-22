import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm: any;
  showPassword: boolean = false;

  constructor(private toastr: ToastrService, private router: Router, private service : AuthService) {}



  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      password: new FormControl('', [Validators.required, this.noSpacesValidator])
    });
  }



  passwordShowHide() {
    this.showPassword = !this.showPassword;
  }



  noSpacesValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value && control.value.includes(' ')) {
      return { noSpaces: true };
    }
    return null;
  }



  onSubmitLoginForm() {
    if (this.loginForm.valid) {
      this.service.login(this.loginForm.value).subscribe({
        next : (res) => {
          if(res.success){
            this.router.navigate(['admin/dashboard']);
            this.toastr.success(res.message, 'Successfull!');
          }
          
          else {
            this.toastr.error(res.message, 'Error!');
          }
        },

        error : (err) => {
          if(err.error && err.error.message){
            this.toastr.error(err.error.message, 'Error!');
          }
        }
      })

    } 
    else {
      this.toastr.error('Login Validation Failed');
    }
  }
}

