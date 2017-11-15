import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})
export class LoginComponent {
  invalidLogin: boolean;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private authService: AuthService) { }


  signIn(formData) {

    let email = formData.email;
    let password = formData.password;

    this.authService.login(email, password).subscribe((result) => {
        if(result.status === 1) {
          let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          localStorage.setItem('token', JSON.stringify(result.token));
          this.router.navigate([returnUrl || '/dashboard']);
        } else {
          this.invalidLogin = true;
        }
      });
  }

}
