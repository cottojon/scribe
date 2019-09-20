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

  constructor(
    private authService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
    this.authService.checkAndNavigateToLogin();
  }

  login() {
    this.authService.signin(this.usernameInput, this.passwordInput).subscribe(
      x => { setTimeout(x => this.router.navigate(['/live']), 500) },
      error => { console.log("Login Error: " + error)});
  }

}
