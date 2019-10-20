import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {
  @Input()
  navToggle: boolean;
  username: string;

  constructor(private authService: AuthenticationService,
    private profileService: ProfileService) { }

  ngOnInit() {
    this.navToggle = false;
    this.username = "UserName";

    this.profileService.getUsername().subscribe((name) => {this.username = name["username"];});
  }

  logout(): void {
    this.authService.logoutAndRedirect();
  }
}
