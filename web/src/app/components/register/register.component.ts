import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AuthService]
})
export class RegisterComponent {
  invalidSignup: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService) { }

  signUp(formData) {
    let firstName = formData.firstName;
    let lastName = formData.lastName;
    let email = formData.email;
    let password = formData.password;

    this.authService.signUp(firstName, lastName, email, password).subscribe((result) => {
      if(result.status === 200) {
        localStorage.setItem('token', JSON.stringify(result.token));
        this.router.navigate(['/dashboard']);
      } else {
        this.invalidSignup = true;
      }
    });

  }
  
}
