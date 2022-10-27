import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public name!: string;
  public role!: string;
  public email!: string;
  public password!: string;
  public errorMessage!: string;

  public roleList = ['Admin', 'Customer'];
  private storageList: {
    name: string;
    role: string;
    email: string;
    password: string;
    isActive: boolean;
  }[] = [];

  constructor(private router: Router, private cookieService: CookieService) {}

  ngOnInit() {
    const userList = this.cookieService.get('userList');
    if (userList) {
      this.storageList = JSON.parse(userList);
    }
  }

  registerHandler() {
    const isUserRegistered =
      !!this.storageList.length &&
      !!this.storageList.filter((user) => user.email === this.email).length;

    console.log('Esta el usuario registradao: ', isUserRegistered);

    if (isUserRegistered) {
      this.errorMessage = 'this email is alredy register';
    } else {
      this.storageList.push({
        name: this.name,
        role: this.role,
        email: this.email,
        password: this.password,
        isActive: false,
      });
      this.cookieService.set('userList', JSON.stringify(this.storageList));
      this.router.navigateByUrl('/login').then();
    }
  }

  checkFormValidty(): boolean {
    return !!this.name && !!this.role && !!this.email && !!this.password;
  }
}
