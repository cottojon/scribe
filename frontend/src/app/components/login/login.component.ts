import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usernameInput: string;
  passwordInput: string;
  errorMessage: string;
  showError: boolean;

  badLoginMessage: string = "Incorrect username or password";
  serverErrorMessage: string = "Internal server error, please try again later";

  constructor(
    private authService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
    if (this.authService.checkToken()){
      this.router.navigate(['/live']);
    }
    this.errorMessage = "";
    this.showError = false;
  }

  login() {
    this.authService.signin(this.usernameInput, this.passwordInput).subscribe(
      x => { setTimeout(x => this.router.navigate(['/live']), 500); this.showError = false; },
      error => { 
        if (error.status == 400) {
          this.errorMessage = this.badLoginMessage;
          this.showError = true;
        }
        else {
          this.errorMessage = this.serverErrorMessage;
          this.showError = true;
        }
      });
  }

}
