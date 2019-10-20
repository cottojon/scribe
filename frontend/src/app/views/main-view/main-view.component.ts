import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {
  @Input()
  navToggle: boolean;
  username: string;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.navToggle = false;
    this.username = "UserName";


  }

  logout(): void {
    this.authService.logoutAndRedirect();
  }
}
