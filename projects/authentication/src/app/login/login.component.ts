import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email!: string;
  password!: string;
  private storageList: {
    name: string;
    role: string;
    email: string;
    password: string;
    isActive: boolean;
  }[] = [];
  errorMessage!: string;
  constructor(private cookieService: CookieService) {}

  ngOnInit() {
    const userList = this.cookieService.get('userList');
    if (userList) {
      this.storageList = JSON.parse(userList);
      this.checkUserSession();
    }
  }

  static getApplicationUrl(rolename: string): string {
    switch (rolename) {
      case 'Admin':
        return environment.ADMIN_URL;
      case 'Customer':
        return environment.CUSTOMER_URL;
      default:
        return environment.ADMIN_URL;
    }
  }

  loginHandler() {
    const isVaidUserCredential: boolean =
      !!this.storageList.length &&
      !!this.storageList.filter(
        (user) => user.email === this.email && user.password === this.password
      );
    if (!isVaidUserCredential) {
      this.errorMessage = 'Email or password is incorrect!!';
    } else {
      this.storageList.map((user) => {
        user.isActive = user.email === this.email;
        return user;
      });
      this.cookieService.set('userList', JSON.stringify(this.storageList));
      const getUserDetails = this.storageList.find((user) => user.isActive);

      console.log('getUserDetails', getUserDetails);

      if (getUserDetails) {
        window.location.href = LoginComponent.getApplicationUrl(
          getUserDetails.role
        );
      } else {
        window.location.href = environment.AUTHENTICATION_URL;
      }
    }
  }

  checkFormValidity(): boolean {
    return !!this.email && !!this.password;
  }

  checkUserSession() {
    const getUserDetails = this.storageList.find((user) => user.isActive);

    console.log(`values for getUserDetails`, getUserDetails);

    if (!getUserDetails) {
      return;
    }
    const getPath = LoginComponent.getApplicationUrl(getUserDetails.role);
  }
}
