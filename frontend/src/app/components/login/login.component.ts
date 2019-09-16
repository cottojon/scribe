import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usernameInput: string;
  passwordInput: string;

  constructor(
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
  }

  login() {
    this.authService.signin(this.usernameInput, this.passwordInput).subscribe(x => console.log("Recieved: " +x +" token: "+x.accessToken));
  }

}
