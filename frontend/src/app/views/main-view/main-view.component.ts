import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProfileService } from 'src/app/services/profile.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {
  @Input()
  navToggle: boolean;
  username: string;
  profileImage: any;
  profileImageLoaded: boolean;
  fileReader: FileReader;
  selectedImage: any;
  currentPasswordField: string;
  newPasswordField: string;
  confirmNewPasswordField: string;
  changePasswordError: string;

  constructor(private authService: AuthenticationService,
    private profileService: ProfileService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.navToggle = false;
    this.username = "Username";
    this.fileReader = new FileReader();

    this.currentPasswordField = "";
    this.newPasswordField = "";
    this.confirmNewPasswordField = "";

    this.loadProfileInformation();
  }

  loadProfileInformation(): void {
    this.profileImageLoaded = false;

    this.profileService.getUsername().subscribe((name) => { this.username = name["username"]; });
    this.profileService.getImage().subscribe((raw) => { this.convertBlobToImage(raw); });
  }

  open(content) {
    this.modalService.open(content).result;
  }

  logout(): void {
    this.authService.logoutAndRedirect();
  }

  convertBlobToImage(raw: Blob): void {
    if (raw && raw.size != 0) {
      this.fileReader.addEventListener("load", () => { this.profileImage = this.fileReader.result; this.profileImageLoaded = true; }, false);
      this.fileReader.readAsDataURL(raw);
    }
  }

  onProfileImageSelected(event): void {
    if (event.target.files && event.target.files[0]) {
      this.selectedImage = event.target.files[0];
    }
  }

  uploadSelectedImage(): void {
    if (this.selectedImage) {
      this.profileService.uploadProfileImage(this.selectedImage).subscribe(() => { this.loadProfileInformation(); });
    }
  }

  changePassword(): void {
    this.changePasswordError = "";

    if (this.newPasswordField == "") {
      this.changePasswordError = "New password cannot be empty";
      return;
    }

    if ((this.newPasswordField != this.confirmNewPasswordField)) {
      this.changePasswordError = "New passwords do not match";
      return;
    }

    this.profileService.changePassword(this.currentPasswordField, this.newPasswordField).subscribe((response) => {
      this.changePasswordError = ""
    }, (error) => {
      console.log(error);
      this.changePasswordError = "Incorrect current password or new password is too weak";
    });
  }
}
